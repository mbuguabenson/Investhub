-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create user_profiles table for KYC information
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  id_number TEXT UNIQUE NOT NULL,
  id_type VARCHAR(50), -- national_id, passport, etc
  date_of_birth DATE,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  kyc_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  kyc_submitted_at TIMESTAMP WITH TIME ZONE,
  kyc_verified_at TIMESTAMP WITH TIME ZONE,
  account_balance DECIMAL(15, 2) DEFAULT 0,
  total_invested DECIMAL(15, 2) DEFAULT 0,
  total_returns DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE
);

-- Create investment_plans table
CREATE TABLE investment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL, -- Basic, Premium, VIP
  description TEXT,
  minimum_amount DECIMAL(15, 2) NOT NULL,
  maximum_amount DECIMAL(15, 2),
  daily_return_rate DECIMAL(5, 2) NOT NULL, -- e.g., 5.00, 10.00, 15.00
  maturity_days INTEGER NOT NULL, -- How many days until maturity
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES investment_plans(id),
  amount DECIMAL(15, 2) NOT NULL,
  invested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  maturity_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- active, matured, withdrawn
  accrued_returns DECIMAL(15, 2) DEFAULT 0,
  paid_returns DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table (deposits, returns, withdrawals)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES investments(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- deposit, return, withdrawal
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'KES',
  reference VARCHAR(255), -- M-Pesa transaction reference
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
  pesapal_reference VARCHAR(255), -- Pesapal transaction reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_returns table (track daily return accrual)
CREATE TABLE daily_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  return_date DATE NOT NULL,
  daily_return_amount DECIMAL(15, 2) NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create withdrawal_requests table
CREATE TABLE withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES investments(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, completed
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pockets table
CREATE TABLE IF NOT EXISTS pockets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0,
  icon VARCHAR(50) DEFAULT 'Umbrella',
  color VARCHAR(50) DEFAULT 'bg-emerald-500',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_webhooks table (for logging M-Pesa/Pesapal webhooks)
CREATE TABLE payment_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pesapal_reference VARCHAR(255) UNIQUE,
  webhook_data JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin check function to avoid RLS recursion
CREATE OR REPLACE FUNCTION check_is_admin(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT is_admin FROM user_profiles WHERE id = uid;
$$ LANGUAGE sql SECURITY DEFINER;

-- Create indices for better query performance
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_maturity_date ON investments(maturity_date);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_daily_returns_investment_id ON daily_returns(investment_id);
CREATE INDEX idx_daily_returns_is_paid ON daily_returns(is_paid);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_user_profiles_kyc_status ON user_profiles(kyc_status);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pockets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pockets
CREATE POLICY "Users can view their own pockets" ON pockets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pockets" ON pockets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (check_is_admin(auth.uid()));

-- RLS Policies for investments
CREATE POLICY "Users can view their own investments" ON investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all investments" ON investments
  FOR SELECT USING (check_is_admin(auth.uid()));

CREATE POLICY "Users can insert their own investments" ON investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT USING (check_is_admin(auth.uid()));

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_returns
CREATE POLICY "Users can view returns for their investments" ON daily_returns
  FOR SELECT USING (
    investment_id IN (
      SELECT id FROM investments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all returns" ON daily_returns
  FOR SELECT USING (check_is_admin(auth.uid()));

-- RLS Policies for withdrawal_requests
CREATE POLICY "Users can view their own withdrawal requests" ON withdrawal_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert withdrawal requests" ON withdrawal_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all withdrawal requests" ON withdrawal_requests
  FOR SELECT USING (check_is_admin(auth.uid()));

CREATE POLICY "Admins can update withdrawal requests" ON withdrawal_requests
  FOR UPDATE USING (check_is_admin(auth.uid()));

-- RLS Policies for investment_plans (public read)
CREATE POLICY "Anyone can view investment plans" ON investment_plans
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage investment plans" ON investment_plans
  FOR ALL USING (check_is_admin(auth.uid()));

-- RLS Policies for payment_webhooks (service role only - no user access)
CREATE POLICY "Service role only for webhooks" ON payment_webhooks
  FOR ALL USING (auth.role() = 'service_role');
