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
