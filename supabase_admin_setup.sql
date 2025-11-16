-- ============================================
-- Supabase Admin Users Table Setup
-- ============================================
-- Run this in your Supabase SQL Editor to create the admin users table
-- and add the default admin account

-- Step 1: Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policy to allow public read (for login check)
-- Note: In production, you should hash passwords and use Supabase Auth instead!
CREATE POLICY "Allow public read for authentication" ON public.admin_users
  FOR SELECT
  USING (true);

-- Step 4: Create policy to allow authenticated users to insert (for creating new admins)
CREATE POLICY "Allow authenticated insert" ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Step 5: Insert default admin user
-- Username: admin
-- Password: admin123
-- ⚠️ WARNING: In production, passwords should be hashed!
INSERT INTO public.admin_users (username, password) 
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the admin user was created:
-- SELECT username FROM public.admin_users WHERE username = 'admin';

-- ============================================
-- Security Note
-- ============================================
-- ⚠️ IMPORTANT: This is a simple authentication system for demo purposes.
-- For production use, you should:
-- 1. Hash passwords using bcrypt or similar
-- 2. Use Supabase Auth instead of storing passwords in plain text
-- 3. Implement proper session management
-- 4. Add rate limiting to prevent brute force attacks
-- 5. Use HTTPS only
-- 6. Consider two-factor authentication

