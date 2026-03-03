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

    // 1. Store/Check the IPN notification for auditing and idempotency
    const { data: existingWebhook } = await client
      .from("payment_webhooks")
      .select("*")
      .eq("pesapal_reference", orderTrackingId)
      .single();

    if (existingWebhook && existingWebhook.processed) {
      console.log(`Webhook already processed for ${orderTrackingId}`);
      return NextResponse.json({ status: 200, message: "Already processed" });
    }

    if (!existingWebhook) {
      await client.from("payment_webhooks").insert({
        pesapal_reference: orderTrackingId,
        webhook_data: { orderTrackingId, merchantReference, type: "IPN_GET" },
        processed: false,
      });
    }

    // 2. Fetch real transaction status from Pesapal
    const token = await getAccessToken();
    const statusData = await getTransactionStatus(token, orderTrackingId);

    console.log("Pesapal Transaction Status:", statusData);

    // Pesapal V3 status: 1 = Completed, 0 = Failed, 2 = Pending
    const isSuccess =
      statusData.status_code === 1 ||
      statusData.payment_status_description === "Completed";

    if (isSuccess) {
      // 3. Find our transaction using merchantReference (which is our internal transaction ID)
      const { data: transaction, error: transError } = await client
        .from("transactions")
        .select("*")
        .eq("id", merchantReference)
        .single();

      if (transError || !transaction) {
        console.error(
          "Transaction not found for merchantReference:",
          merchantReference,
        );
        return NextResponse.json(
          { error: "Transaction not found" },
          { status: 404 },
        );
      }

      if (transaction.status === "completed") {
        console.log(
          "Transaction already marked as completed:",
          merchantReference,
        );
      } else {
        // 4. Update transaction status and process balance
        // We use a simple update here, ideally this would be a single RPC call for atomicity if needed
        const { error: updateError } = await client
          .from("transactions")
          .update({
            status: "completed",
            pesapal_reference: orderTrackingId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", transaction.id);

        if (updateError) {
          console.error("Error updating transaction status:", updateError);
          throw updateError;
        }

        // 5. Update user balance
        const { data: profile, error: profileError } = await client
          .from("user_profiles")
          .select("account_balance")
          .eq("id", transaction.user_id)
          .single();

        if (profileError || !profile) {
          console.error(
            "User profile not found for balance update:",
            transaction.user_id,
          );
          throw new Error("Profile not found");
        }

        const newBalance =
          Number(profile.account_balance) + Number(transaction.amount);

        const { error: balanceError } = await client
          .from("user_profiles")
          .update({
            account_balance: newBalance,
            updated_at: new Date().toISOString(),
          })
          .eq("id", transaction.user_id);

        if (balanceError) {
          console.error("Error updating user balance:", balanceError);
          throw balanceError;
        }

        console.log(
          `Successfully updated balance for user ${transaction.user_id}. New balance: ${newBalance}`,
        );
      }

      // Mark webhook as processed
      await client
        .from("payment_webhooks")
        .update({
          processed: true,
          webhook_data: {
            ...statusData,
            processed_at: new Date().toISOString(),
          },
        })
        .eq("pesapal_reference", orderTrackingId);
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
