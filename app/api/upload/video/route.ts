import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
);

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const token = authHeader.replace('Bearer ', '');

        const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
        if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'owner' && user.email !== process.env.OWNER_EMAIL) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();

        // Auto-generate YouTube thumbnail if none provided
        let thumbnail_url = body.thumbnail_url || null;
        if (!thumbnail_url && body.video_url) {
            const ytMatch = body.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?/\s]+)/);
            if (ytMatch) {
                thumbnail_url = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
            }
        }

        const { data, error } = await supabase.from('videos').insert([{
            title: body.title,
            description: body.description || null,
            tags: body.tags || [],
            aspect_ratio: body.aspectRatio || 'video',
            difficulty: body.difficulty || 'beginner',
            learning_time: body.learningTime || '10 mins',
            video_url: body.video_url,
            thumbnail_url
        }]).select().single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
