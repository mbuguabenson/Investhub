import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getAccessToken, getTransactionStatus } from "@/lib/pesapal";

// Pesapal IPN hit for V3 Payouts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const notificationType = searchParams.get("OrderNotificationType");

  if (!orderTrackingId) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  try {
    const token = await getAccessToken();
    const statusData = await getTransactionStatus(token, orderTrackingId);
    const pesapalStatus = statusData.payment_status_description?.toUpperCase();

    // Find the withdrawal request by tracking ID (stored in 'reference')
    const { data: withdrawal, error: wErr } = await supabase
      .from("withdrawal_requests")
      .select("id")
      .eq("reference", orderTrackingId)
      .single();

    if (wErr || !withdrawal) {
      console.warn(`Withdrawal not found for tracking ID: ${orderTrackingId}`);
      return NextResponse.json({ message: "withdrawal_not_found" });
    }

    let nextStatus = "pending";
    if (pesapalStatus === "COMPLETED" || pesapalStatus === "SUCCESS") {
      nextStatus = "completed";
    } else if (pesapalStatus === "FAILED" || pesapalStatus === "INVALID") {
      nextStatus = "failed";
    }

    if (nextStatus !== "pending") {
      // Update withdrawal request
      await supabase
        .from("withdrawal_requests")
        .update({ status: nextStatus })
        .eq("id", withdrawal.id);

      // Update mirrored transaction status
      await supabase
        .from("transactions")
        .update({ status: nextStatus })
        .eq("reference", `Withdrawal: ${withdrawal.id.slice(0, 8)}`);
    }

    return NextResponse.json({
      success: true,
      status: nextStatus,
      orderTrackingId,
      pesapalStatus,
    });
  } catch (e) {
    console.error("Webhook processing error:", e);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
