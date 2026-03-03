import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { getAccessToken, getTransactionStatus } from "@/lib/pesapal";

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

    const client = supabaseAdmin || supabase;
    // 1. Store the IPN notification for auditing
    await client.from("payment_webhooks").insert({
      pesapal_reference: orderTrackingId,
      webhook_data: { orderTrackingId, merchantReference, type: "IPN_GET" },
      processed: false,
    });

    // 2. Fetch real transaction status from Pesapal
    const token = await getAccessToken();
    const statusData = await getTransactionStatus(token, orderTrackingId);

    // Pesapal V3 status: 1 = Completed, 0 = Failed, 2 = Pending
    const isSuccess =
      statusData.payment_status_description === "Completed" ||
      statusData.status_code === 1;

    if (isSuccess) {
      // 3. Find our transaction
      const { data: transaction } = await client
        .from("transactions")
        .select("*")
        .eq("id", merchantReference)
        .eq("status", "pending")
        .single();

      if (transaction) {
        // 4. Update transaction status
        await client
          .from("transactions")
          .update({
            status: "completed",
            pesapal_reference: orderTrackingId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", transaction.id);

        // 5. Update user balance
        const { data: profile } = await client
          .from("user_profiles")
          .select("account_balance")
          .eq("id", transaction.user_id)
          .single();

        if (profile) {
          await client
            .from("user_profiles")
            .update({
              account_balance: profile.account_balance + transaction.amount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", transaction.user_id);
        }
      }
    }

    return NextResponse.json({
      orderNotificationId: orderTrackingId,
      merchantReference: merchantReference,
      status: 200,
    });
  } catch (error: any) {
    console.error("Pesapal IPN Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
