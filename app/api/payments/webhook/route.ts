import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const merchantReference = searchParams.get("OrderMerchantReference");

  try {
    if (!orderTrackingId || !merchantReference) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    // 1. Store the IPN notification for auditing
    await supabase.from("payment_webhooks").insert({
      pesapal_reference: orderTrackingId,
      webhook_data: { orderTrackingId, merchantReference, type: "IPN_GET" },
      processed: false,
    });

    // 2. Fetch transaction status from Pesapal (Simulated status check)
    // In production, call GET `${PESAPAL_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`
    const isSuccess = true; // Simulation

    if (isSuccess) {
      // 3. Find our transaction
      const { data: transaction } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", merchantReference)
        .eq("status", "pending")
        .single();

      if (transaction) {
        // 4. Update transaction status
        await supabase
          .from("transactions")
          .update({
            status: "completed",
            pesapal_reference: orderTrackingId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", transaction.id);

        // 5. Update user balance
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("account_balance")
          .eq("id", transaction.user_id)
          .single();

        if (profile) {
          await supabase
            .from("user_profiles")
            .update({
              account_balance: profile.account_balance + transaction.amount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", transaction.user_id);
        }
      }
    }

    // Pesapal V3 IPN expects a specific response structure or 200 OK
    return NextResponse.json({
      orderNotificationId: orderTrackingId,
      merchantReference: merchantReference,
      status: 200,
    });
  } catch (error) {
    console.error("Pesapal IPN Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Keep POST for other webhook types if needed
export async function POST(request: NextRequest) {
  return GET(request);
}
