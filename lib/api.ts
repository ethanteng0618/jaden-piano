import { supabase } from './supabase'

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

// Helper: upload a file to Supabase Storage via signed URL
// Step 1: Get a signed upload URL from server (uses service role key, bypasses RLS)
// Step 2: Upload file directly from browser to Supabase Storage (no Vercel size limit)
async function uploadFileToStorage(file: File, folder: string, token: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // Get signed URL from our API
  const urlRes = await fetch('/api/upload/signed-url', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ path })
  })
  if (!urlRes.ok) throw new Error('Failed to get upload URL')
  const { signedUrl } = await urlRes.json()

  // Upload file directly to Supabase Storage using signed URL
  const uploadRes = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  })
  if (!uploadRes.ok) throw new Error('Failed to upload file')

  // Return the public URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${supabaseUrl}/storage/v1/object/public/content/${path}`
}

export async function uploadVideo(formData: FormData, token: string) {
  const videoFile = formData.get('video') as File | null
  const thumbnailFile = formData.get('thumbnail') as File | null
  const youtubeUrl = formData.get('youtubeUrl') as string | null

  let video_url = ''
  let thumbnail_url = null

  // If YouTube URL is provided, use it directly (no file upload needed)
  if (youtubeUrl) {
    video_url = youtubeUrl
  } else if (videoFile) {
    video_url = await uploadFileToStorage(videoFile, 'videos', token)
  }

  if (thumbnailFile) {
    thumbnail_url = await uploadFileToStorage(thumbnailFile, 'thumbnails', token)
  }

  // Send only metadata to the API route (tiny JSON payload)
  const res = await fetch('/api/upload/video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: formData.get('title'),
      description: formData.get('description') || null,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      aspectRatio: formData.get('aspectRatio') || 'video',
      difficulty: formData.get('difficulty') || 'beginner',
      learningTime: formData.get('learningTime') || '10 mins',
      video_url,
      thumbnail_url
    })
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function uploadSheetMusic(formData: FormData, token: string) {
  const pdfFile = formData.get('pdf') as File
  let pdf_url = ''

  if (pdfFile) {
    pdf_url = await uploadFileToStorage(pdfFile, 'sheet-music', token)
  }

  const res = await fetch('/api/upload/sheet-music', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: formData.get('title'),
      description: formData.get('description') || null,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      difficulty: formData.get('difficulty') || 'beginner',
      learningTime: formData.get('learningTime') || '10 mins',
      pdf_url
    })
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function uploadTechniqueDrill(formData: FormData, token: string) {
  const pdfFile = formData.get('pdf') as File
  const thumbnailFile = formData.get('thumbnail') as File | null

  let pdf_url = ''
  let thumbnail_url = null

  if (pdfFile) {
    pdf_url = await uploadFileToStorage(pdfFile, 'drills', token)
  }
  if (thumbnailFile) {
    thumbnail_url = await uploadFileToStorage(thumbnailFile, 'thumbnails', token)
  }

  const res = await fetch('/api/upload/technique-drill', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: formData.get('title'),
      description: formData.get('description') || null,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      difficulty: formData.get('difficulty') || 'intermediate',
      learningTime: formData.get('learningTime') || '10 mins',
      pdf_url,
      thumbnail_url
    })
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function uploadBeginnerPlan(planData: any, token: string) {
  const res = await fetch('/api/upload/beginner-plan', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(planData)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
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
