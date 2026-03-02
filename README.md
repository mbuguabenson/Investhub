# InvestHub - Investment Platform

A modern investment platform built with Next.js 16, React 19, and Supabase. Offers tiered investment plans with daily returns, KYC verification, and integrated M-Pesa payments.

## ⚠️ IMPORTANT: Database Setup Required

**The app will not work until you initialize the database.** See [Database Setup](#database-setup-required) below.

## Features

- **User Authentication**: Secure email/password authentication via Supabase Auth
- **KYC Verification**: Complete Know-Your-Customer verification process
- **Investment Plans**: Three-tier investment system (Basic, Premium, VIP)
  - Basic: 5% daily return on 1,000-50,000 KES for 30 days
  - Premium: 10% daily return on 50,001-500,000 KES for 30 days
  - VIP: 15% daily return on 500,001+ KES for 30 days
- **Portfolio Dashboard**: Real-time investment tracking and performance metrics
- **Transaction History**: Complete record of deposits, returns, and withdrawals
- **Withdrawal Management**: Request and track withdrawal of matured investments
- **Payment Integration**: M-Pesa and Pesapal webhook support (ready for integration)

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui with Tailwind CSS
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── auth/
│   │   ├── login/               # Login page
│   │   ├── signup/              # Registration page
│   │   └── kyc/                 # KYC verification
│   ├── dashboard/
│   │   ├── page.tsx             # Main dashboard
│   │   ├── transactions/        # Transaction history
│   │   └── withdrawals/         # Withdrawal management
│   └── api/
│       └── payments/webhook/    # Payment webhook endpoint
├── components/
│   ├── dashboard/               # Dashboard components
│   │   ├── header.tsx           # Dashboard header
│   │   ├── portfolio-stats.tsx  # Portfolio statistics
│   │   ├── investments-list.tsx # Investment listings
│   │   ├── investment-plans-grid.tsx # Plans display
│   │   ├── investment-form.tsx  # Investment form
│   │   └── withdrawal-form.tsx  # Withdrawal form
│   └── ui/                      # shadcn UI components
├── lib/
│   ├── supabase.ts             # Supabase client setup
│   ├── database.types.ts       # TypeScript database types
│   └── db.ts                   # Database utility functions
├── scripts/
│   ├── 01-create-schema.sql    # Database schema
│   └── 02-seed-investment-plans.sql # Seed data
└── ENV_SETUP.md                # Environment setup guide
```

## Quick Start (5 minutes)

### Step 1: Prerequisites

- Node.js 18+
- pnpm
- Supabase account (free tier works great)

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Add Environment Variables

Create `.env.local` in project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these from: Supabase Dashboard → Settings → API

### Step 4: Database Setup (CRITICAL!)

**This step is required or the app won't work!**

1. Go to your Supabase Dashboard → **SQL Editor**
2. Click **+ New Query**
3. Copy entire contents of `scripts/01-create-schema.sql`
4. Paste into editor and click **RUN**
5. Repeat with `scripts/02-seed-investment-plans.sql`

👉 **See `/setup` page in the app for step-by-step visual guide**

### Step 5: Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000

## Database Setup Required

### Why is this needed?

The database tables (user_profiles, investments, etc.) must be created before the app can work. The SQL files are provided in the `scripts/` folder.

### How to Fix "Could not find table" Error

1. Go to Supabase Dashboard
2. Click **SQL Editor** → **+ New Query**
3. Open file: `scripts/01-create-schema.sql` from this project
4. Copy ALL the SQL code
5. Paste into Supabase editor
6. Click **RUN**
7. Wait for completion
8. Repeat with `scripts/02-seed-investment-plans.sql`

### Verify Setup

After running migrations, check Supabase → **Table Editor**. You should see:
- user_profiles ✓
- investment_plans ✓
- investments ✓
- transactions ✓
- daily_returns ✓
- withdrawal_requests ✓
- payment_webhooks ✓

If tables are missing, the migration didn't run. Restart the dev server and try again.

## Key Features Explained

### Authentication Flow
1. User signs up with email and password
2. Completes KYC verification form
3. Account is marked as pending approval
4. Once approved, user can start investing

### Investment Process
1. Browse available investment plans
2. Select desired plan and amount
3. Confirm investment
4. Receive M-Pesa payment prompt
5. Complete payment to activate investment
6. Daily returns accrue automatically

### Withdrawal Process
1. View matured investments in withdrawals section
2. Request withdrawal with desired amount
3. Admin reviews and approves request
4. Funds transferred back to user's M-Pesa account

## Database Schema

### Core Tables
- **user_profiles**: User account information and KYC data
- **investment_plans**: Available investment products
- **investments**: Active and historical user investments
- **transactions**: All financial transactions
- **daily_returns**: Daily return accrual tracking
- **withdrawal_requests**: Withdrawal request management
- **payment_webhooks**: Payment provider webhooks

All tables include Row Level Security policies to ensure data privacy.

## API Endpoints

### Public
- `GET /` - Landing page
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Protected (Auth Required)
- `GET /dashboard` - Main dashboard
- `GET /dashboard/transactions` - Transaction history
- `GET /dashboard/withdrawals` - Withdrawal management

### Webhooks
- `POST /api/payments/webhook` - M-Pesa/Pesapal webhook

## Future Enhancements

- [ ] Email notifications for investments and returns
- [ ] SMS alerts via M-Pesa
- [ ] Admin dashboard for KYC approval
- [ ] Admin panel for managing investment plans
- [ ] Referral system
- [ ] In-app messaging/support
- [ ] Document upload for KYC
- [ ] Two-factor authentication
- [ ] Investment calculator
- [ ] Mobile app

## Payment Integration

The app is ready for M-Pesa and Pesapal integration:

1. **M-Pesa Daraja API**: For collecting payments
2. **Pesapal**: For payment processing and withdrawals

Webhook endpoints are configured in `/api/payments/webhook` to handle payment callbacks.

## Security Considerations

- ✅ Supabase Row Level Security (RLS) policies
- ✅ Secure password hashing via Supabase Auth
- ✅ HTTP-only session cookies
- ✅ Environment variables for sensitive data
- ✅ CSRF protection via Next.js
- ✅ SQL injection prevention via parameterized queries

## License

This project is licensed under the MIT License.

## Support

For setup assistance, refer to:
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration
- [Supabase Docs](https://supabase.com/docs) - Database and auth
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
