import { supabase, supabaseAdmin } from "./supabase";
import type {
  UserProfile,
  InvestmentPlan,
  Investment,
  Transaction,
} from "./database.types";

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-url")
  );
};

// User Profile Operations
export async function checkAccountExists(
  phoneNumber: string,
  idNumber: string,
): Promise<boolean> {
  const client = supabaseAdmin || supabase; // Fallback to public client if admin is not available

  if (!isSupabaseConfigured()) return false;

  try {
    const { data, error } = await client
      .from("user_profiles")
      .select("id")
      .or(`phone_number.eq.${phoneNumber},id_number.eq.${idNumber}`)
      .limit(1);

    if (error) {
      console.error("Error checking account existence:", error);
      return false;
    }
    return !!(data && data.length > 0);
  } catch (e) {
    return false;
  }
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

export async function createUserProfile(
  userId: string,
  profileData: Partial<UserProfile>,
): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const client = supabaseAdmin || supabase; // Use Admin if available to bypass RLS

  try {
    const { data, error } = await client
      .from("user_profiles")
      .insert({
        id: userId,
        ...profileData,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>,
): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(profileData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

// Investment Plan Operations
export async function getInvestmentPlans(): Promise<InvestmentPlan[]> {
  if (!isSupabaseConfigured()) {
    // Return mock plans for UI preview
    return [
      {
        id: "1",
        name: "Micro Strategy",
        minimum_amount: 1000,
        daily_return_rate: 2,
        maturity_days: 1, // 24 hours minimum
        is_active: true,
        description:
          "Perfect for beginners. Institutional-grade algorithmic trading with stable 2% daily yields.",
      },
      {
        id: "2",
        name: "Alpha Growth",
        minimum_amount: 5000,
        daily_return_rate: 5,
        maturity_days: 7,
        is_active: true,
        description:
          "Balanced growth with higher compounding power and mid-term stability.",
      },
      {
        id: "3",
        name: "Institutional Alpha",
        minimum_amount: 50000,
        daily_return_rate: 8,
        maturity_days: 30,
        is_active: true,
        description:
          "Maximum leverage for serious capital deployment and priority execution.",
      },
    ] as any;
  }

  try {
    const { data, error } = await supabase
      .from("investment_plans")
      .select("*")
      .eq("is_active", true)
      .order("minimum_amount", { ascending: true });

    if (error) {
      console.error("Error fetching investment plans:", error);
      return [];
    }
    return data || [];
  } catch (e) {
    return [];
  }
}

export async function getInvestmentPlanById(
  planId: string,
): Promise<InvestmentPlan | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from("investment_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (error) {
      console.error("Error fetching investment plan:", error);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

// Investment Operations
export async function getUserInvestments(
  userId: string,
): Promise<Investment[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", userId)
      .order("invested_at", { ascending: false });

    if (error) {
      console.error("Error fetching user investments:", error);
      return [];
    }
    return data || [];
  } catch (e) {
    return [];
  }
}

export async function createInvestment(
  userId: string,
  planId: string,
  amount: number,
  maturityDate: string,
): Promise<Investment | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from("investments")
      .insert({
        user_id: userId,
        plan_id: planId,
        amount,
        maturity_date: maturityDate,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating investment:", error);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

// Transaction Operations
export async function getUserTransactions(
  userId: string,
): Promise<Transaction[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
    return data || [];
  } catch (e) {
    return [];
  }
}

export async function createTransaction(
  userId: string,
  type: "deposit" | "return" | "withdrawal",
  amount: number,
  reference?: string,
): Promise<Transaction | null> {
  if (!isSupabaseConfigured()) return null;

  const client = supabaseAdmin || supabase;

  try {
    const { data, error } = await client
      .from("transactions")
      .insert({
        user_id: userId,
        type,
        amount,
        currency: "KES",
        reference,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

export async function getPockets(userId: string) {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("pockets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching pockets:", error);
      return [];
    }
    return data || [];
  } catch (e) {
    return [];
  }
}
