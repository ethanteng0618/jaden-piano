-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table with role-based access
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'owner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  aspect_ratio TEXT DEFAULT 'video' CHECK (aspect_ratio IN ('video', 'vertical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sheet music table
CREATE TABLE IF NOT EXISTS sheet_music (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Technique drills table
CREATE TABLE IF NOT EXISTS technique_drills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  pdf_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beginner plans table
CREATE TABLE IF NOT EXISTS beginner_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  level TEXT NOT NULL,
  description TEXT,
  lessons TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheet_music ENABLE ROW LEVEL SECURITY;
ALTER TABLE technique_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE beginner_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for all content
CREATE POLICY "Public can view videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Public can view sheet_music" ON sheet_music FOR SELECT USING (true);
CREATE POLICY "Public can view technique_drills" ON technique_drills FOR SELECT USING (true);
CREATE POLICY "Public can view beginner_plans" ON beginner_plans FOR SELECT USING (true);

-- Owner-only write access
CREATE POLICY "Owner can insert videos" ON videos FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Owner can update videos" ON videos FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Owner can delete videos" ON videos FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'owner'
    )
  );

-- Similar policies for other tables
CREATE POLICY "Owner can insert sheet_music" ON sheet_music FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Owner can update sheet_music" ON sheet_music FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Owner can delete sheet_music" ON sheet_music FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'owner'
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.email = current_setting('app.owner_email', true) THEN 'owner'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Track saves
CREATE TABLE IF NOT EXISTS saved_videos (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS saved_sheet_music (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sheet_music_id UUID REFERENCES sheet_music(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, sheet_music_id)
);

CREATE TABLE IF NOT EXISTS saved_technique_drills (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  drill_id UUID REFERENCES technique_drills(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, drill_id)
);

-- RLS for saved items
ALTER TABLE saved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_sheet_music ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_technique_drills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own saved videos" ON saved_videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved videos" ON saved_videos FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own saved videos" ON saved_videos FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved sheet_music" ON saved_sheet_music FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved sheet_music" ON saved_sheet_music FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own saved sheet_music" ON saved_sheet_music FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved drills" ON saved_technique_drills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved drills" ON saved_technique_drills FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own saved drills" ON saved_technique_drills FOR SELECT USING (auth.uid() = user_id);

-- Add plays columns
ALTER TABLE videos ADD COLUMN IF NOT EXISTS plays INTEGER DEFAULT 0;
ALTER TABLE sheet_music ADD COLUMN IF NOT EXISTS plays INTEGER DEFAULT 0;
ALTER TABLE technique_drills ADD COLUMN IF NOT EXISTS plays INTEGER DEFAULT 0;

-- RPC functions
CREATE OR REPLACE FUNCTION increment_video_play(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET plays = plays + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_sheet_music_play(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE sheet_music SET plays = plays + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_technique_drill_play(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE technique_drills SET plays = plays + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
