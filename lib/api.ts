import { supabase } from './supabase'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function fetchVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*, saved_videos(count)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map((item: any) => ({
    ...item,
    saves_count: item.saved_videos?.[0]?.count || 0,
    saved_videos: undefined
  }))
}

export async function fetchSheetMusic() {
  const { data, error } = await supabase
    .from('sheet_music')
    .select('*, saved_sheet_music(count)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map((item: any) => ({
    ...item,
    saves_count: item.saved_sheet_music?.[0]?.count || 0,
    saved_sheet_music: undefined
  }))
}

export async function fetchTechniqueDrills() {
  const { data, error } = await supabase
    .from('technique_drills')
    .select('*, saved_technique_drills(count)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map((item: any) => ({
    ...item,
    saves_count: item.saved_technique_drills?.[0]?.count || 0,
    saved_technique_drills: undefined
  }))
}

export async function fetchBeginnerPlans() {
  const { data, error } = await supabase
    .from('beginner_plans')
    .select('*')
    .order('duration', { ascending: true })

  if (error) throw error
  return data
}

export async function uploadVideo(formData: FormData, token: string) {
  const videoFile = formData.get('video') as File;
  const thumbnailFile = formData.get('thumbnail') as File;

  let video_url = '';
  let thumbnail_url = null;

  if (videoFile) {
    const ext = videoFile.name.split('.').pop();
    const { data: vData, error: vErr } = await supabase.storage.from('content').upload(`videos/${Date.now()}-${Math.random()}.${ext}`, videoFile);
    if (vErr) throw vErr;
    video_url = supabase.storage.from('content').getPublicUrl(vData.path).data.publicUrl;
  }

  if (thumbnailFile) {
    const ext = thumbnailFile.name.split('.').pop();
    const { data: tData, error: tErr } = await supabase.storage.from('content').upload(`thumbnails/${Date.now()}-${Math.random()}.${ext}`, thumbnailFile);
    if (tErr) throw tErr;
    thumbnail_url = supabase.storage.from('content').getPublicUrl(tData.path).data.publicUrl;
  }

  const { data, error } = await supabase.from('videos').insert([{
    title: formData.get('title'),
    description: formData.get('description') || null,
    tags: JSON.parse(formData.get('tags') as string || '[]'),
    aspect_ratio: formData.get('aspectRatio') || 'video',
    difficulty: formData.get('difficulty') || 'beginner',
    learning_time: formData.get('learningTime') || '10 mins',
    video_url,
    thumbnail_url
  }]);

  if (error) throw error;
  return data;
}

export async function uploadSheetMusic(formData: FormData, token: string) {
  const pdfFile = formData.get('pdf') as File;
  let pdf_url = '';

  if (pdfFile) {
    const ext = pdfFile.name.split('.').pop();
    const { data: pData, error: pErr } = await supabase.storage.from('content').upload(`sheet-music/${Date.now()}-${Math.random()}.${ext}`, pdfFile);
    if (pErr) throw pErr;
    pdf_url = supabase.storage.from('content').getPublicUrl(pData.path).data.publicUrl;
  }

  const { data, error } = await supabase.from('sheet_music').insert([{
    title: formData.get('title'),
    description: formData.get('description') || null,
    tags: JSON.parse(formData.get('tags') as string || '[]'),
    difficulty: formData.get('difficulty') || 'beginner',
    learning_time: formData.get('learningTime') || '10 mins',
    pdf_url
  }]);

  if (error) throw error;
  return data;
}

export async function uploadTechniqueDrill(formData: FormData, token: string) {
  const pdfFile = formData.get('pdf') as File;
  const thumbnailFile = formData.get('thumbnail') as File;

  let pdf_url = '';
  let thumbnail_url = null;

  if (pdfFile) {
    const ext = pdfFile.name.split('.').pop();
    const { data: pData, error: pErr } = await supabase.storage.from('content').upload(`drills/${Date.now()}-${Math.random()}.${ext}`, pdfFile);
    if (pErr) throw pErr;
    pdf_url = supabase.storage.from('content').getPublicUrl(pData.path).data.publicUrl;
  }

  if (thumbnailFile) {
    const ext = thumbnailFile.name.split('.').pop();
    const { data: tData, error: tErr } = await supabase.storage.from('content').upload(`thumbnails/${Date.now()}-${Math.random()}.${ext}`, thumbnailFile);
    if (tErr) throw tErr;
    thumbnail_url = supabase.storage.from('content').getPublicUrl(tData.path).data.publicUrl;
  }

  const { data, error } = await supabase.from('technique_drills').insert([{
    title: formData.get('title'),
    description: formData.get('description') || null,
    tags: JSON.parse(formData.get('tags') as string || '[]'),
    difficulty: formData.get('difficulty') || 'intermediate',
    learning_time: formData.get('learningTime') || '10 mins',
    pdf_url,
    thumbnail_url
  }]);

  if (error) throw error;
  return data;
}

export async function uploadBeginnerPlan(planData: any, token: string) {
  const { data, error } = await supabase.from('beginner_plans').insert([{
    title: planData.title,
    duration: planData.duration,
    level: planData.level,
    description: planData.description || null,
    lessons: planData.lessons || [],
    learning_time: planData.learningTime || '1 week'
  }]);

  if (error) throw error;
  return data;
}

export async function incrementVideoPlay(id: string) {
  try {
    const { error } = await supabase.rpc('increment_video_play', { row_id: id })
    if (error) console.error('Failed to increment play count')
  } catch (e) { console.error(e) }
}

export async function incrementSheetMusicPlay(id: string) {
  try {
    const { error } = await supabase.rpc('increment_sheet_music_play', { row_id: id })
    if (error) console.error('Failed to increment play count')
  } catch (e) { console.error(e) }
}

export async function incrementTechniqueDrillPlay(id: string) {
  try {
    const { error } = await supabase.rpc('increment_technique_drill_play', { row_id: id })
    if (error) console.error('Failed to increment play count')
  } catch (e) { console.error(e) }
}
