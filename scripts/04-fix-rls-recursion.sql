-- Fix for infinite recursion in RLS policies

-- 1. Create the helper function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION check_is_admin(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles WHERE id = uid AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all investments" ON investments;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all returns" ON daily_returns;
DROP POLICY IF EXISTS "Admins can view all withdrawal requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Admins can update withdrawal requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Admins can manage investment plans" ON investment_plans;

-- 3. Recreate them using the function
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can view all investments" ON investments FOR SELECT USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can view all returns" ON daily_returns FOR SELECT USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can view all withdrawal requests" ON withdrawal_requests FOR SELECT USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can update withdrawal requests" ON withdrawal_requests FOR UPDATE USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can manage investment plans" ON investment_plans FOR ALL USING (check_is_admin(auth.uid()));

-- 4. Add missing INSERT policies for common tables
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert their own investments" ON investments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Add UPDATE policies for service role to modify status fields
CREATE POLICY "Service can update withdrawal status" ON withdrawal_requests
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service can update transaction status" ON transactions
  FOR UPDATE USING (auth.role() = 'service_role');
