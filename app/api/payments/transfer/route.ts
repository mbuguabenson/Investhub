import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { amount, recipientId, recipientName } = await request.json();
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!recipientId) {
      return NextResponse.json(
        { error: "Recipient is required" },
        { status: 400 },
      );
    }

    // Check balance
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("account_balance")
      .eq("id", user.id)
      .single();

    if (!profile || profile.account_balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 },
      );
    }

    // Deduct balance immediately
    const newBalance = profile.account_balance - amount;
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ account_balance: newBalance })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // Create completed transaction for transfer out
    const { error: tError } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "withdrawal", // Treating transfer out as withdrawal for now
      amount: amount,
      currency: "KES",
      reference: `Transfer to ${recipientName || recipientId}`,
      status: "completed",
    });

    if (tError) throw tError;

    return NextResponse.json({ success: true, newBalance });
  } catch (error: any) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
