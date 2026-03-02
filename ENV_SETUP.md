# Environment Setup Guide

This project requires Supabase to be set up and connected. Follow these steps:

## 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. In your Supabase dashboard:
   - Go to Settings > API
   - Copy your project URL and public API key
   - Copy your service role key (keep this secret)

3. Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 2. Database Schema Setup

**IMPORTANT: You must run the database migrations before using the app!**

### Option A: Using Supabase SQL Editor (Recommended)

1. In your Supabase dashboard, go to **SQL Editor** → Click **+ New Query**
2. Copy the entire contents of `scripts/01-create-schema.sql` from this project
3. Paste it in the SQL editor and click **RUN**
4. Wait for it to complete (you should see ✓ checks next to each statement)
5. Create another new query
6. Copy the entire contents of `scripts/02-seed-investment-plans.sql`
7. Paste it in the SQL editor and click **RUN**
8. Wait for completion

### Option B: Using Command Line (Alternative)

```bash
# Install dependencies if not already done
pnpm install

# Run the database setup (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)
node scripts/execute-sql.mjs
```

**If you see errors during migration**, they're usually harmless (e.g., "already exists"). As long as you see the tables created successfully in your Supabase dashboard, you're good to go.

## 3. Authentication Setup (Supabase Auth)

Supabase Auth is already configured in the code:

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Email/Password provider (usually enabled by default)
3. Users can now sign up with email and password

## 4. Testing the App

1. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

2. Navigate to `http://localhost:3000`
3. Create a new account
4. Complete KYC verification
5. Start investing!

## 5. Optional: M-Pesa & Pesapal Integration

For payment processing:

1. Get API keys from:
   - M-Pesa Daraja API
   - Pesapal API

2. Add to environment variables:
```
NEXT_PUBLIC_PESAPAL_CONSUMER_KEY=your_pesapal_key
PESAPAL_CONSUMER_SECRET=your_pesapal_secret
```

3. Implement the payment processing logic in the transaction handlers

## Database Tables Overview

- **user_profiles**: User KYC information
- **investment_plans**: Available investment tiers (Basic, Premium, VIP)
- **investments**: User investment records
- **transactions**: Payment history (deposits, returns, withdrawals)
- **daily_returns**: Daily accrual tracking
- **withdrawal_requests**: Withdrawal requests management
- **payment_webhooks**: M-Pesa/Pesapal webhook logs

All tables have Row Level Security enabled for data protection.

## Troubleshooting

### "Could not find the table 'public.user_profiles'" Error

**This means the database migrations haven't been run yet!**

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Open a new query and paste the contents of `scripts/01-create-schema.sql`
4. Click **RUN** and wait for all statements to execute
5. Repeat with `scripts/02-seed-investment-plans.sql`
6. Restart your development server

### Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see these tables:
   - `user_profiles`
   - `investment_plans`
   - `investments`
   - `transactions`
   - `daily_returns`
   - `withdrawal_requests`
   - `payment_webhooks`

If any are missing, the schema migration didn't run successfully.
