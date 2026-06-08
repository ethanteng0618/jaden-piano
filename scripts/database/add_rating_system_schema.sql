-- Add new fields for difficulty rating system and learning time
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'beginner';
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS learning_time TEXT DEFAULT '10 mins';

ALTER TABLE public.sheet_music ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'beginner';
ALTER TABLE public.sheet_music ADD COLUMN IF NOT EXISTS learning_time TEXT DEFAULT '10 mins';

ALTER TABLE public.technique_drills ADD COLUMN IF NOT EXISTS learning_time TEXT DEFAULT '10 mins';

-- Note: beginner_plans already has 'level' which usually correlates to difficulty, but we can add learning_time
ALTER TABLE public.beginner_plans ADD COLUMN IF NOT EXISTS learning_time TEXT DEFAULT '1 week';

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_type TEXT NOT NULL, -- 'video', 'sheet_music', 'technique_drill', 'beginner_plan'
    item_id UUID NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Anyone can read comments" ON public.comments
    FOR SELECT USING (true);

-- Allow authenticated users to insert comments
CREATE POLICY "Authenticated users can insert comments" ON public.comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow owners to delete any comment
CREATE POLICY "Owners can delete any comment" ON public.comments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'owner'
        )
    );
