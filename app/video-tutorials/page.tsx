'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ContentCard } from '@/components/content-card'
import { DifficultyLegend } from '@/components/difficulty-legend'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { fetchVideos, incrementVideoPlay } from '@/lib/api'
import { supabase } from '@/lib/supabase'

export default function VideoTutorialsPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [token, setToken] = useState('')
  const [user, setUser] = useState<any>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    checkOwnerAndUser()
    loadVideos()
  }, [])

  async function checkOwnerAndUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setUser(session.user)
    setToken(session.access_token)

    // Check user saves
    const { data: savedData } = await supabase
      .from('saved_videos')
      .select('video_id')
      .eq('user_id', session.user.id)

    if (savedData) {
      setSavedIds(new Set(savedData.map((d: any) => d.video_id)))
    }

    const isEnvOwner = session.user.email === process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim().toLowerCase()

    if (isEnvOwner) {
      setIsOwner(true)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    setIsOwner(profile?.role === 'owner')
  }

  async function loadVideos() {
    try {
      const data = await fetchVideos()
      setVideos(data)
    } catch (error) {
      console.error('Failed to load videos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      if (!isOwner) throw new Error('Not authorized')
      const { error } = await supabase.from('videos').delete().eq('id', id)
      if (error) throw error

      setVideos(videos.filter(v => v.id !== id))
    } catch (error) {
      alert('Error deleting video')
      console.error(error)
    }
  }

  async function handleToggleSave(video: any) {
    if (!user) {
      alert('Please log in to save videos')
      return
    }

    const isSaved = savedIds.has(video.id)
    const newSavedIds = new Set(savedIds)

    // Update local state immediately (optimistic)
    if (isSaved) {
      newSavedIds.delete(video.id)
      setSavedIds(newSavedIds)

      // Update videos count optimistically
      setVideos(videos.map(v => v.id === video.id ? { ...v, saves_count: Math.max(0, (v.saves_count || 0) - 1) } : v))

      const { error } = await supabase
        .from('saved_videos')
        .delete()
        .eq('user_id', user.id)
        .eq('video_id', video.id)

      if (error) {
        // Revert
        setSavedIds(savedIds)
        loadVideos()
        console.error(error)
      }
    } else {
      newSavedIds.add(video.id)
      setSavedIds(newSavedIds)

      setVideos(videos.map(v => v.id === video.id ? { ...v, saves_count: (v.saves_count || 0) + 1 } : v))

      const { error } = await supabase
        .from('saved_videos')
        .insert({ user_id: user.id, video_id: video.id })

      if (error) {
        setSavedIds(savedIds)
        loadVideos()
        console.error(error)
      }
    }
  }

  async function handlePlay(id: string) {
    // Increment local play count optimistically
    setVideos(videos.map(v => v.id === id ? { ...v, plays: (v.plays || 0) + 1 } : v))
    await incrementVideoPlay(id)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-balance">Video Tutorials</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Learn from j8den&apos;s comprehensive video lessons and TikTok-style quick tips
            </p>
            <DifficultyLegend />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">Loading videos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <ContentCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  tags={video.tags || []}
                  type="video"
                  aspectRatio="video"
                  thumbnail={video.thumbnail_url}
                  downloadUrl={video.video_url}
                  isOwner={isOwner}
                  onDelete={() => handleDelete(video.id)}
                  plays={video.plays}
                  saves={video.saves_count}
                  isSaved={savedIds.has(video.id)}
                  difficulty={video.difficulty}
                  learningTime={video.learning_time}
                  onToggleSave={() => handleToggleSave(video)}
                  onPlay={() => handlePlay(video.id)}
                />
              ))}
              {videos.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No videos available yet
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
