'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ContentCard } from '@/components/content-card'
import { DifficultyLegend } from '@/components/difficulty-legend'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { fetchTechniqueDrills, incrementTechniqueDrillPlay } from '@/lib/api'
import { supabase } from '@/lib/supabase'

export default function TechniqueDrillsPage() {
  const [drills, setDrills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [token, setToken] = useState('')
  const [user, setUser] = useState<any>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    checkOwnerAndUser()
    loadDrills()
  }, [])

  async function checkOwnerAndUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setUser(session.user)
    setToken(session.access_token)

    // Check saves
    const { data: savedData } = await supabase
      .from('saved_technique_drills')
      .select('drill_id')
      .eq('user_id', session.user.id)

    if (savedData) {
      setSavedIds(new Set(savedData.map((d: any) => d.drill_id)))
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

  async function loadDrills() {
    try {
      const data = await fetchTechniqueDrills()
      setDrills(data)
    } catch (error) {
      console.error('Failed to load drills:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/technique-drills/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Failed to delete')

      setDrills(drills.filter(d => d.id !== id))
    } catch (error) {
      alert('Error deleting drill')
      console.error(error)
    }
  }

  async function handleToggleSave(item: any) {
    if (!user) {
      alert('Please log in to save drills')
      return
    }

    const isSaved = savedIds.has(item.id)
    const newSavedIds = new Set(savedIds)

    if (isSaved) {
      newSavedIds.delete(item.id)
      setSavedIds(newSavedIds)

      setDrills(drills.map(d => d.id === item.id ? { ...d, saves_count: Math.max(0, (d.saves_count || 0) - 1) } : d))

      const { error } = await supabase
        .from('saved_technique_drills')
        .delete()
        .eq('user_id', user.id)
        .eq('drill_id', item.id)

      if (error) {
        setSavedIds(savedIds)
        loadDrills()
        console.error(error)
      }
    } else {
      newSavedIds.add(item.id)
      setSavedIds(newSavedIds)

      setDrills(drills.map(d => d.id === item.id ? { ...d, saves_count: (d.saves_count || 0) + 1 } : d))

      const { error } = await supabase
        .from('saved_technique_drills')
        .insert({ user_id: user.id, drill_id: item.id })

      if (error) {
        setSavedIds(savedIds)
        loadDrills()
        console.error(error)
      }
    }
  }

  async function handlePlay(id: string) {
    setDrills(drills.map(d => d.id === id ? { ...d, plays: (d.plays || 0) + 1 } : d))
    await incrementTechniqueDrillPlay(id)
  }

  const categorizedDrills = {
    fingerDexterity: drills.filter(d =>
      d.tags?.some((tag: string) => tag.toLowerCase().includes('dexterity') || tag.toLowerCase().includes('finger'))
    ),
    octaveJumps: drills.filter(d =>
      d.tags?.some((tag: string) => tag.toLowerCase().includes('octave') || tag.toLowerCase().includes('jump'))
    ),
    scales: drills.filter(d =>
      d.tags?.some((tag: string) => tag.toLowerCase().includes('scale'))
    ),
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-balance">Technique Drills</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Build your technical foundation with structured practice exercises
            </p>
            <DifficultyLegend />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">Loading drills...</div>
          ) : (
            <Tabs defaultValue="fingerDexterity" className="w-full">
              <TabsList className="mb-8 w-full justify-start h-auto p-1 bg-muted/80 backdrop-blur-sm rounded-lg border shadow-sm">
                <TabsTrigger
                  value="fingerDexterity"
                  className="rounded-md px-4 py-2"
                >
                  Finger Dexterity
                </TabsTrigger>
                <TabsTrigger
                  value="octaveJumps"
                  className="rounded-md px-4 py-2"
                >
                  Octave Jumps
                </TabsTrigger>
                <TabsTrigger
                  value="scales"
                  className="rounded-md px-4 py-2"
                >
                  Scales
                </TabsTrigger>
              </TabsList>

              <TabsContent value="fingerDexterity" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizedDrills.fingerDexterity.map((drill) => (
                    <ContentCard
                      key={drill.id}
                      id={drill.id}
                      title={drill.title}
                      tags={drill.tags || []}
                      type="pdf"
                      downloadUrl={drill.pdf_url}
                      thumbnail={drill.thumbnail_url}
                      isOwner={isOwner}
                      onDelete={() => handleDelete(drill.id)}
                      plays={drill.plays}
                      saves={drill.saves_count}
                      isSaved={savedIds.has(drill.id)}
                      difficulty={drill.difficulty}
                      learningTime={drill.learning_time}
                      onToggleSave={() => handleToggleSave(drill)}
                      onPlay={() => handlePlay(drill.id)}
                    />
                  ))}
                  {categorizedDrills.fingerDexterity.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                      No finger dexterity drills available yet
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="octaveJumps" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizedDrills.octaveJumps.map((drill) => (
                    <ContentCard
                      key={drill.id}
                      id={drill.id}
                      title={drill.title}
                      tags={drill.tags || []}
                      type="pdf"
                      downloadUrl={drill.pdf_url}
                      thumbnail={drill.thumbnail_url}
                      isOwner={isOwner}
                      onDelete={() => handleDelete(drill.id)}
                      plays={drill.plays}
                      saves={drill.saves_count}
                      isSaved={savedIds.has(drill.id)}
                      difficulty={drill.difficulty}
                      learningTime={drill.learning_time}
                      onToggleSave={() => handleToggleSave(drill)}
                      onPlay={() => handlePlay(drill.id)}
                    />
                  ))}
                  {categorizedDrills.octaveJumps.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                      No octave jump drills available yet
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="scales" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizedDrills.scales.map((drill) => (
                    <ContentCard
                      key={drill.id}
                      id={drill.id}
                      title={drill.title}
                      tags={drill.tags || []}
                      type="pdf"
                      downloadUrl={drill.pdf_url}
                      thumbnail={drill.thumbnail_url}
                      isOwner={isOwner}
                      onDelete={() => handleDelete(drill.id)}
                      plays={drill.plays}
                      saves={drill.saves_count}
                      isSaved={savedIds.has(drill.id)}
                      difficulty={drill.difficulty}
                      learningTime={drill.learning_time}
                      onToggleSave={() => handleToggleSave(drill)}
                      onPlay={() => handlePlay(drill.id)}
                    />
                  ))}
                  {categorizedDrills.scales.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                      No scale drills available yet
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
