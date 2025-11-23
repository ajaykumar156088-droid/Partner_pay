-- Disable RLS on users table to allow public access (for now)
-- Alternatively, you can create a policy:
-- CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers DISABLE ROW LEVEL SECURITY;
ALTER TABLE special_logins DISABLE ROW LEVEL SECURITY;
ALTER TABLE special_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
