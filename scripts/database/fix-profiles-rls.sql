CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING ( auth.uid() = id );
