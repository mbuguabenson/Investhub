export type UserProfile = {
  id: string
  full_name: string
  id_number: string
  id_type: string
  date_of_birth: string
  phone_number: string
  address: string
  city: string
  country: string
  kyc_status: 'pending' | 'approved' | 'rejected'
  kyc_submitted_at: string | null
  kyc_verified_at: string | null
  account_balance: number
  total_invested: number
  total_returns: number
  created_at: string
  updated_at: string
  is_admin: boolean
}

export type InvestmentPlan = {
  id: string
  name: string
  description: string | null
  minimum_amount: number
  maximum_amount: number | null
  daily_return_rate: number
  maturity_days: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Investment = {
  id: string
  user_id: string
  plan_id: string
  amount: number
  invested_at: string
  maturity_date: string
  status: 'active' | 'matured' | 'withdrawn'
  accrued_returns: number
  paid_returns: number
  created_at: string
  updated_at: string
}

export type Transaction = {
  id: string
  user_id: string
  investment_id: string | null
  type: 'deposit' | 'return' | 'withdrawal'
  amount: number
  currency: string
  reference: string | null
  status: 'pending' | 'completed' | 'failed'
  pesapal_reference: string | null
  created_at: string
  updated_at: string
}

export type DailyReturn = {
  id: string
  investment_id: string
  return_date: string
  daily_return_amount: number
  is_paid: boolean
  paid_at: string | null
  created_at: string
}

export type WithdrawalRequest = {
  id: string
  user_id: string
  investment_id: string | null
  amount: number
  reason: string | null
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  requested_at: string
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export type PaymentWebhook = {
  id: string
  pesapal_reference: string | null
  webhook_data: Record<string, any>
  processed: boolean
  created_at: string
}
