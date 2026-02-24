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

        const formData = await req.formData();
        const pdfFile = formData.get('pdf') as File;
        const thumbnailFile = formData.get('thumbnail') as File;

        let pdf_url = '';
        let thumbnail_url = null;

        if (pdfFile) {
            const ext = pdfFile.name.split('.').pop();
            const { data, error } = await supabase.storage.from('content').upload(`drills/${Date.now()}-${Math.random()}.${ext}`, pdfFile);
            if (error) throw error;
            pdf_url = supabase.storage.from('content').getPublicUrl(data.path).data.publicUrl;
        }

        if (thumbnailFile) {
            const ext = thumbnailFile.name.split('.').pop();
            const { data, error } = await supabase.storage.from('content').upload(`thumbnails/${Date.now()}-${Math.random()}.${ext}`, thumbnailFile);
            if (error) throw error;
            thumbnail_url = supabase.storage.from('content').getPublicUrl(data.path).data.publicUrl;
        }

        const { data, error } = await supabase.from('technique_drills').insert([{
            title: formData.get('title'),
            description: formData.get('description') || null,
            tags: JSON.parse(formData.get('tags') as string || '[]'),
            difficulty: formData.get('difficulty') || 'intermediate',
            learning_time: formData.get('learningTime') || '10 mins',
            pdf_url,
            thumbnail_url
        }]).select().single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
