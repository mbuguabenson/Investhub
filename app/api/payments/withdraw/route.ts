import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getAccessToken, submitPayoutRequest } from "@/lib/pesapal";

export async function POST(request: NextRequest) {
  try {
    const { amount, reason, phoneNumber } = await request.json();
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

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required for withdrawal" },
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

    // Create withdrawal request
    const { data: withdrawal, error: wError } = await supabase
      .from("withdrawal_requests")
      .insert({
        user_id: user.id,
        amount: amount,
        reason: `[Phone: ${phoneNumber}] ${reason || "Direct Wallet Withdrawal"}`,
        status: "pending",
        requested_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (wError) throw wError;

    // Create pending transaction
    const { error: tError } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "withdrawal",
      amount: amount,
      currency: "KES",
      reference: `Withdrawal: ${withdrawal.id.slice(0, 8)}`,
      status: "pending",
    });

    if (tError) throw tError;

    // Deduct balance immediately
    const newBalance = profile.account_balance - amount;
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ account_balance: newBalance })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // --- PROACTIVE PESAPAL PAYOUT INITIATION ---
    try {
      const token = await getAccessToken();
      const payoutResponse = await submitPayoutRequest(token, {
        reference: `Withdrawal-${withdrawal.id.slice(0, 8)}`,
        amount: amount,
        phone: phoneNumber,
        description: reason || "Wallet Withdrawal",
      });

      if (payoutResponse?.order_tracking_id) {
        // Store the tracking ID back in the withdrawal request
        await supabase
          .from("withdrawal_requests")
          .update({ reference: payoutResponse.order_tracking_id })
          .eq("id", withdrawal.id);
      }
    } catch (pesapalError) {
      // We log but don't fail the request here, since the balance is deducted
      // and the status is 'pending'. The background cron will retry this.
      console.error("Pesapal proactive payout failed:", pesapalError);
    }
    // ------------------------------------------

    return NextResponse.json({ success: true, withdrawalId: withdrawal.id });
  } catch (error: any) {
    console.error("Withdrawal error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
