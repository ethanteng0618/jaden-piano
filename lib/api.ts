const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function fetchVideos() {
  const res = await fetch(`${API_URL}/api/videos`)
  if (!res.ok) throw new Error('Failed to fetch videos')
  return res.json()
}

export async function fetchSheetMusic() {
  const res = await fetch(`${API_URL}/api/sheet-music`)
  if (!res.ok) throw new Error('Failed to fetch sheet music')
  return res.json()
}

export async function fetchTechniqueDrills() {
  const res = await fetch(`${API_URL}/api/technique-drills`)
  if (!res.ok) throw new Error('Failed to fetch technique drills')
  return res.json()
}

export async function fetchBeginnerPlans() {
  const res = await fetch(`${API_URL}/api/beginner-plans`)
  if (!res.ok) throw new Error('Failed to fetch beginner plans')
  return res.json()
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
    const res = await fetch(`${API_URL}/api/videos/${id}/play`, { method: 'POST' })
    if (!res.ok) console.error('Failed to increment play count')
  } catch (e) { console.error(e) }
}

export async function incrementSheetMusicPlay(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/sheet-music/${id}/play`, { method: 'POST' })
    if (!res.ok) console.error('Failed to increment play count')
  } catch (e) { console.error(e) }
}

export async function incrementTechniqueDrillPlay(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/technique-drills/${id}/play`, { method: 'POST' })
    if (!res.ok) console.error('Failed to increment play count')
  } catch (e) { console.error(e) }
}
