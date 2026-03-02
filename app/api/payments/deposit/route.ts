import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createTransaction } from "@/lib/db";
import { getAccessToken, registerIPN, submitOrder } from "@/lib/pesapal";

export async function POST(request: NextRequest) {
  try {
    const { amount, method } = await request.json();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 1. Create a pending transaction in our DB
    const transaction = await createTransaction(
      user.id,
      "deposit",
      amount,
      `Deposit via ${method.toUpperCase()}`,
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Failed to create transaction" },
        { status: 500 },
      );
    }

    // 2. Automate Pesapal Flow
    const token = await getAccessToken();

    // Check if we have an IPN ID in env, otherwise register one dynamically
    let ipnId = process.env.PESAPAL_IPN_ID;
    if (!ipnId) {
      console.log("No PESAPAL_IPN_ID found, registering dynamically...");
      ipnId = await registerIPN(token);
    }

    // 3. Submit Order to Pesapal
    const result = await submitOrder(token, ipnId!, {
      id: transaction.id,
      amount: amount,
      description: `InvestHub Deposit - ${user.email}`,
      email: user.email!,
    });

    return NextResponse.json({
      success: true,
      orderTrackingId: result.order_tracking_id,
      redirectUrl: result.redirect_url,
    });
  } catch (error: any) {
    console.error("Pesapal Deposit Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
