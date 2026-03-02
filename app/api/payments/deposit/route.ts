import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createTransaction } from "@/lib/db";

// Pesapal V3 Config (Should be in env)
const PESAPAL_URL =
  process.env.NODE_ENV === "production"
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3";

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

    // 1. Create a pending transaction in our DB first
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

    // 2. Prepare Pesapal SubmitOrderRequest structure
    // In a real implementation, you'd fetch the Bearer Token first
    const pesapalOrder = {
      id: transaction.id, // Our internal reference
      currency: "KES",
      amount: amount,
      description: `InvestHub Deposit - ${user.email}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?status=callback`,
      notification_id: process.env.PESAPAL_IPN_ID, // Pre-registered IPN ID
      billing_address: {
        email_address: user.email,
        phone_number: "", // Can be fetched from profile
        first_name: "",
        last_name: "",
      },
    };

    // 3. For now, we simulate the Pesapal response
    // In production, you'd POST to `${PESAPAL_URL}/api/Transactions/SubmitOrderRequest`
    const simulatedRedirectUrl = `${PESAPAL_URL}/Transactions/SubmitOrderRequest?id=${transaction.id}`;

    return NextResponse.json({
      success: true,
      orderTrackingId: `SIM-${transaction.id.slice(0, 8)}`,
      redirectUrl: simulatedRedirectUrl,
    });
  } catch (error) {
    console.error("Pesapal Deposit Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
