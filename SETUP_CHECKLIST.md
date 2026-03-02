# InvestHub Setup Checklist

Complete these steps in order to get the app running:

## Before You Start
- [ ] Have Supabase account ready
- [ ] Have Node.js 18+ installed
- [ ] Have pnpm installed
- [ ] Clone this project

## Step 1: Install Dependencies (2 min)
```bash
pnpm install
```
- [ ] No errors during installation

## Step 2: Get Supabase Credentials (3 min)
1. Log in to Supabase dashboard
2. Go to **Settings → API**
3. Copy these three values:
   - [ ] Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - [ ] Anon Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - [ ] Service Role Key (SUPABASE_SERVICE_ROLE_KEY)

## Step 3: Create .env.local File (1 min)
1. Create file named `.env.local` in project root
2. Paste these lines (replace with your values):
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
- [ ] File created with correct values

## Step 4: Initialize Database (CRITICAL!) (5 min)

**⚠️ SKIP THIS AND THE APP WILL NOT WORK**

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to Supabase Dashboard
2. Click **SQL Editor** in left menu
3. Click **+ New Query**
4. Open file: `scripts/01-create-schema.sql` (from this project)
5. Copy ALL the SQL code
6. Paste into Supabase SQL editor
7. Click **RUN** button (blue button in top right)
8. Wait for all statements to complete (see green checkmarks)
9. Create **+ New Query** again
10. Open file: `scripts/02-seed-investment-plans.sql`
11. Copy and paste into editor
12. Click **RUN**

- [ ] Schema SQL executed successfully
- [ ] Seed data SQL executed successfully

### Option B: Command Line (Alternative)
```bash
node scripts/execute-sql.mjs
```
- [ ] Command executed without errors

### Verify It Worked
1. Go to Supabase → **Table Editor**
2. Check you can see these tables:
   - [ ] user_profiles
   - [ ] investment_plans
   - [ ] investments
   - [ ] transactions
   - [ ] daily_returns
   - [ ] withdrawal_requests
   - [ ] payment_webhooks

If any table is missing, go back to Step 4 and run the schema migration again.

## Step 5: Start Development Server (1 min)
```bash
pnpm dev
```
- [ ] Server started successfully
- [ ] Console shows "ready on http://localhost:3000"

## Step 6: Test the App (5 min)

1. Open browser to http://localhost:3000
   - [ ] See InvestHub landing page
   
2. Click "Get Started"
   - [ ] See signup form
   
3. Fill in signup form and click "Create Account"
   - [ ] Get redirected to KYC form (if successful)
   - [ ] If error: see TROUBLESHOOTING.md
   
4. Fill in KYC info and submit
   - [ ] Get redirected to dashboard
   
5. See dashboard page
   - [ ] Portfolio stats show
   - [ ] Investment plans display
   - [ ] Can see navigation tabs

## ✅ You're Done!

If all checkboxes are marked, congratulations! The app is now fully set up.

---

## If Something Failed

1. **Got "Could not find table" error?**
   - See "Step 4: Initialize Database" above
   - Make sure you ran both SQL files

2. **Got authentication error?**
   - Check .env.local has correct Supabase credentials
   - Restart dev server after adding .env.local

3. **Signup form not working?**
   - Check browser console (F12) for errors
   - See TROUBLESHOOTING.md for solutions

4. **Still stuck?**
   - Visit `/setup` page in the app for visual guide
   - Read TROUBLESHOOTING.md for common issues
   - Check README.md for overview

---

## What's Next?

- [ ] Sign up with test account
- [ ] Complete KYC verification
- [ ] Choose investment plan
- [ ] Test investment creation
- [ ] Check transactions page
- [ ] Test withdrawal request

Enjoy InvestHub! 🚀
