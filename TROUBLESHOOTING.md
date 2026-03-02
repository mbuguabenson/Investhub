# Troubleshooting Guide

## Common Issues & Solutions

### Error: "Could not find the table 'public.user_profiles'"

**This is the most common error and means the database hasn't been initialized.**

#### Solution:

1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Click **+ New Query**
4. Copy entire contents of `scripts/01-create-schema.sql` from this project
5. Paste into the SQL editor
6. Click **RUN** button
7. Wait for all statements to complete (green checkmarks)
8. Create **+ New Query** again
9. Copy entire contents of `scripts/02-seed-investment-plans.sql`
10. Paste and click **RUN**
11. Restart your development server: `pnpm dev`

#### Still not working?

1. Check Supabase → **Table Editor**
2. Verify these tables exist:
   - user_profiles
   - investment_plans
   - investments
   - transactions
   - daily_returns
   - withdrawal_requests
   - payment_webhooks
3. If any table is missing, run the schema migration again
4. Try signing up in an incognito/private window

---

### Error: "NEXT_PUBLIC_SUPABASE_URL is not set"

**You haven't added environment variables.**

#### Solution:

1. Create a `.env.local` file in the project root
2. Add these lines:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
3. Get values from: Supabase Dashboard → Settings → API
4. Save the file
5. Restart development server: `pnpm dev`

---

### Error: "Invalid API Key"

**Your Supabase credentials are wrong.**

#### Solution:

1. Go to Supabase Dashboard → Settings → API
2. Copy the correct **Project URL** and **Anon Key**
3. Update `.env.local` with correct values
4. Restart development server

---

### Signup page shows "Failed to create user profile"

**Either database tables don't exist or there's a database connection issue.**

#### Solution:

1. First, make sure tables exist (see "Could not find table" section above)
2. Check `.env.local` has correct SUPABASE_URL and ANON_KEY
3. Restart development server
4. Try signing up again
5. If still failing, check Supabase dashboard for any errors

---

### Can't see the signup form properly

**CSS might not be loading.**

#### Solution:

1. Hard refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache and restart dev server
3. Try in an incognito/private window

---

### Development server won't start

**Port might be in use or missing dependencies.**

#### Solution:

```bash
# Install dependencies
pnpm install

# Try different port
pnpm dev -- -p 3001

# Or kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Then restart:
pnpm dev
```

---

### Getting a blank page

**Next.js might still be building.**

#### Solution:

1. Wait 30 seconds for the build to complete
2. Check terminal for errors
3. Hard refresh: `Ctrl+Shift+R`
4. Check browser console for errors (F12)

---

### Dashboard loads but no data shows

**You might not be logged in or authenticated.**

#### Solution:

1. Sign out completely
2. Clear browser cookies for localhost
3. Sign in again with your account
4. Complete KYC verification

---

### Can't log in with email I just created

**The signup might not have completed successfully.**

#### Solution:

1. Check the error message during signup
2. If "Failed to create user profile" → database not initialized (see first section)
3. Try signing up with a different email address
4. Check Supabase → Authentication → Users to see if account was created

---

### M-Pesa payment not working

**API integration not configured.**

#### Solution:

The payment endpoints exist but require:

1. M-Pesa/Pesapal API keys
2. Add to `.env.local`:
```
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
```
3. Uncomment/enable payment logic in `/app/api/payments/webhook/route.ts`

---

## Checking Your Setup

Run this checklist to verify everything is working:

- [ ] Supabase account created
- [ ] `.env.local` file exists with correct credentials
- [ ] Database migrations run successfully
- [ ] All 7 tables exist in Supabase
- [ ] Development server running (`pnpm dev`)
- [ ] Can access http://localhost:3000
- [ ] Can see landing page
- [ ] Can click "Get Started" and see signup form
- [ ] Can sign up with valid email
- [ ] Redirected to KYC page after signup
- [ ] Can see dashboard after completing KYC

---

## Getting Help

1. Check `ENV_SETUP.md` for environment setup details
2. Check `README.md` for overview and features
3. Visit Supabase docs: https://supabase.com/docs
4. Check the `/setup` page in the app for visual step-by-step guide

---

## Still Having Issues?

Make sure:

1. **Database is initialized**: Check Supabase → Table Editor for all tables
2. **Environment variables are correct**: Verify in `.env.local`
3. **Development server is running**: `pnpm dev` should show "ready on http://localhost:3000"
4. **Browser is up to date**: Try a different browser or clear cache
5. **Service role key is correct**: For database operations (if using command line setup)

Most issues are resolved by:
1. Running the database migrations (scripts/01 and scripts/02)
2. Restarting the development server
3. Hard refreshing the browser
