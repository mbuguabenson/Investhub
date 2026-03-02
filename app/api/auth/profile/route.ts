import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, profileData } = await request.json();

    if (!userId || !profileData) {
      return NextResponse.json(
        { error: "Missing userId or profileData" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase admin credentials missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Use Service Role to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        id: userId,
        full_name: profileData.full_name || "New User",
        phone_number: profileData.phone_number,
        id_number: profileData.id_number,
        // Provide defaults for strict DB constraints
        id_type: profileData.id_type || "National ID",
        date_of_birth: profileData.date_of_birth || "1990-01-01",
        address: profileData.address || "Not Provided",
        city: profileData.city || "Not Provided",
        country: profileData.country || "Kenya",
        account_balance: 0,
        total_invested: 0,
        total_returns: 0,
        kyc_status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating profile via admin:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error: any) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
