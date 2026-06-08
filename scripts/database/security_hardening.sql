-- Enable RLS on all sensitive tables
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheet_music ENABLE ROW LEVEL SECURITY;
ALTER TABLE technique_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE beginner_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can read their own profile. Public can't read others (unless needed?).
-- Actually, admin needs to read all profiles? No, admin uses Service Role in backend.
-- Authenticated users need to read their own profile to check role.
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 2. Content Tables: Public Read Access (Anon key)
-- Everyone (anon and authenticated) can view content.
CREATE POLICY "Public videos access" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Public sheet_music access" ON sheet_music
  FOR SELECT USING (true);

CREATE POLICY "Public drills access" ON technique_drills
  FOR SELECT USING (true);

CREATE POLICY "Public plans access" ON beginner_plans
  FOR SELECT USING (true);

-- 3. Write Access: STRICTLY RESTRICTED
-- Since we use an Express backend with a Service Role Key for all uploads/deletes,
-- we do NOT need any INSERT/UPDATE/DELETE policies for the Anon/Authenticated roles.
-- By default in RLS, if no policy enables write, it is DENIED.
-- This effectively blocks any direct write attempts from the browser console.

-- Optional: If you want to allow the 'owner' role to write directly from Supabase Client (not recommended if using Backend API):
-- CREATE POLICY "Owners can modify videos" ON videos
--   FOR ALL
--   USING (
--     exists (
--       select 1 from profiles
--       where profiles.id = auth.uid() and profiles.role = 'owner'
--     )
--   );
-- For now, relying on Backend API is safer.
