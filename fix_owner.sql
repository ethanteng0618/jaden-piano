-- Run this in the Supabase SQL Editor to make your user an owner
-- Replace 'tinen0618@gmail.com' with your exact login email if different

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"owner"'
)
WHERE email = 'jadenshia34@gmail.com';

-- Also update the profiles table if it exists and has items
UPDATE public.profiles
SET role = 'owner'
WHERE email = 'jadenshia34@gmail.com';
