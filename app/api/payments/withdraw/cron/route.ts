import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import {
  getAccessToken,
  getTransactionStatus,
  submitPayoutRequest,
} from "@/lib/pesapal";

export async function GET() {
  const supabase = await createServerSupabase();

  // Fetch pending withdrawals
  const { data: pending, error } = await supabase
    .from("withdrawal_requests")
    .select("id, user_id, amount, reference, status, reason")
    .eq("status", "pending");

  if (error) {
    console.error("Failed to fetch pending withdrawals:", error);
    return NextResponse.json({ error: "fetch_error" }, { status: 500 });
  }

  if (!pending || pending.length === 0) {
    return NextResponse.json({
      processed: 0,
      message: "No pending withdrawals",
    });
  }

  const token = await getAccessToken();
  let processedCount = 0;

  for (const w of pending) {
    try {
      if (w.reference) {
        // --- CASE 1: Reference exists, check status ---
        const statusData = await getTransactionStatus(token, w.reference);
        const pesapalStatus =
          statusData.payment_status_description?.toUpperCase();

        if (pesapalStatus === "COMPLETED" || pesapalStatus === "SUCCESS") {
          await updateWithdrawalStatus(supabase, w.id, "completed");
          processedCount++;
        } else if (pesapalStatus === "FAILED" || pesapalStatus === "INVALID") {
          await updateWithdrawalStatus(supabase, w.id, "failed");
          // Optionally refund here
          processedCount++;
        }
      } else {
        // --- CASE 2: No reference, try to submit (retry) ---
        // We need the user's phone number. We store it in 'reason' currently
        // as "[Phone: ...] Reason". Let's try to extract it.
        const phoneMatch = w.reason?.match(/\[Phone: (.*?)\]/);
        const phone = phoneMatch ? phoneMatch[1] : null;

        if (phone) {
          const payoutResponse = await submitPayoutRequest(token, {
            reference: `Withdrawal-${w.id.slice(0, 8)}`,
            amount: Number(w.amount),
            phone: phone,
            description: w.reason || "Wallet Withdrawal",
          });

          if (payoutResponse?.order_tracking_id) {
            await supabase
              .from("withdrawal_requests")
              .update({ reference: payoutResponse.order_tracking_id })
              .eq("id", w.id);
            processedCount++;
          }
        }
      }
    } catch (e) {
      console.error(`Error processing withdrawal ${w.id}:`, e);
    }
  }

  return NextResponse.json({ processed: processedCount });
}

async function updateWithdrawalStatus(
  supabase: any,
  id: string,
  status: string,
) {
  // Update withdrawal request
  await supabase
    .from("withdrawal_requests")
    .update({ status: status })
    .eq("id", id);

  // Update mirrored transaction status
  await supabase
    .from("transactions")
    .update({ status: status })
    .eq("reference", `Withdrawal: ${id.slice(0, 8)}`);
}
