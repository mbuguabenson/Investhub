/**
 * Pesapal V3 API Utility
 * Implementation based on https://developer.pesapal.com/
 */

const PESAPAL_URL =
  process.env.NODE_ENV === "production"
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3";

export async function getAccessToken() {
  const response = await fetch(`${PESAPAL_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error?.message || "Failed to get Pesapal access token",
    );
  }

  return data.token;
}

export async function registerIPN(token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`;

  const response = await fetch(`${PESAPAL_URL}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: url,
      ipn_notification_type: "GET",
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to register IPN");
  }

  return data.ipn_id;
}

export async function submitOrder(
  token: string,
  ipnId: string,
  orderData: {
    id: string;
    amount: number;
    description: string;
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    callback_url?: string;
  },
) {
  const payload = {
    id: orderData.id,
    currency: "KES",
    amount: orderData.amount,
    description: orderData.description,
    callback_url:
      orderData.callback_url ||
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?status=callback`,
    notification_id: ipnId,
    billing_address: {
      email_address: orderData.email,
      phone_number: orderData.phone || "",
      country_code: "KE",
      first_name: orderData.firstName || "Investor",
      last_name: orderData.lastName || "User",
      line_1: "",
      line_2: "",
      city: "",
      state: "",
      postal_code: "",
      zip_code: "",
    },
  };

  const response = await fetch(
    `${PESAPAL_URL}/api/Transactions/SubmitOrderRequest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to submit Pesapal order");
  }

  return data; // Contains order_tracking_id and redirect_url
}

export async function getTransactionStatus(
  token: string,
  orderTrackingId: string,
) {
  const response = await fetch(
    `${PESAPAL_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to get transaction status");
  }

  return data; // Contains payment_status_description
}

export async function submitPayoutRequest(
  token: string,
  payoutData: {
    reference: string;
    amount: number;
    phone: string;
    description: string;
  },
) {
  const payload = {
    merchant_reference: payoutData.reference,
    amount: payoutData.amount,
    currency: "KES",
    description: payoutData.description,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/withdraw/webhook`,
    destination_channel: "MPESA", // Default to Mpesa
    destination_account: payoutData.phone,
  };

  const response = await fetch(
    `${PESAPAL_URL}/api/Transactions/SubmitPayoutRequest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to submit Pesapal payout");
  }

  return data; // Contains order_tracking_id
}
