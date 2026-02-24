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
  const res = await fetch(`${API_URL}/api/upload/video`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  })
  if (!res.ok) throw new Error('Failed to upload video')
  return res.json()
}

export async function uploadSheetMusic(formData: FormData, token: string) {
  const res = await fetch(`${API_URL}/api/upload/sheet-music`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  })
  if (!res.ok) throw new Error('Failed to upload sheet music')
  return res.json()
}

export async function uploadTechniqueDrill(formData: FormData, token: string) {
  const res = await fetch(`${API_URL}/api/upload/technique-drill`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  })
  if (!res.ok) throw new Error('Failed to upload technique drill')
  return res.json()
}

export async function uploadBeginnerPlan(data: any, token: string) {
  const res = await fetch(`${API_URL}/api/upload/beginner-plan`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to upload beginner plan')
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
