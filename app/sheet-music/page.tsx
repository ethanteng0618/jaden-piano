'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ContentCard } from '@/components/content-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchSheetMusic, incrementSheetMusicPlay } from '@/lib/api'
import Loading from './loading'
import { supabase } from '@/lib/supabase'

export default function SheetMusicPage() {
  const [sheetMusic, setSheetMusic] = useState<any[]>([])
  const [filteredMusic, setFilteredMusic] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [token, setToken] = useState('')
  const [user, setUser] = useState<any>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    checkOwnerAndUser()
    loadSheetMusic()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = sheetMusic.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredMusic(filtered)
    } else {
      setFilteredMusic(sheetMusic)
    }
  }, [searchQuery, sheetMusic])

  async function checkOwnerAndUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setUser(session.user)
    setToken(session.access_token)

    // Check saves
    const { data: savedData } = await supabase
      .from('saved_sheet_music')
      .select('sheet_music_id')
      .eq('user_id', session.user.id)

    if (savedData) {
      setSavedIds(new Set(savedData.map((d: any) => d.sheet_music_id)))
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

  async function loadSheetMusic() {
    try {
      const data = await fetchSheetMusic()
      setSheetMusic(data)
      setFilteredMusic(data)
    } catch (error) {
      console.error('Failed to load sheet music:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sheet-music/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Failed to delete')

      const updated = sheetMusic.filter(s => s.id !== id)
      setSheetMusic(updated)
    } catch (error) {
      alert('Error deleting sheet music')
      console.error(error)
    }
  }

  async function handleToggleSave(item: any) {
    if (!user) {
      alert('Please log in to save sheet music')
      return
    }

    const isSaved = savedIds.has(item.id)
    const newSavedIds = new Set(savedIds)

    if (isSaved) {
      newSavedIds.delete(item.id)
      setSavedIds(newSavedIds)

      setSheetMusic(sheetMusic.map(s => s.id === item.id ? { ...s, saves_count: Math.max(0, (s.saves_count || 0) - 1) } : s))

      const { error } = await supabase
        .from('saved_sheet_music')
        .delete()
        .eq('user_id', user.id)
        .eq('sheet_music_id', item.id)

      if (error) {
        setSavedIds(savedIds)
        loadSheetMusic()
        console.error(error)
      }
    } else {
      newSavedIds.add(item.id)
      setSavedIds(newSavedIds)

      setSheetMusic(sheetMusic.map(s => s.id === item.id ? { ...s, saves_count: (s.saves_count || 0) + 1 } : s))

      const { error } = await supabase
        .from('saved_sheet_music')
        .insert({ user_id: user.id, sheet_music_id: item.id })

      if (error) {
        setSavedIds(savedIds)
        loadSheetMusic()
        console.error(error)
      }
    }
  }

  async function handlePlay(id: string) {
    setSheetMusic(sheetMusic.map(s => s.id === id ? { ...s, plays: (s.plays || 0) + 1 } : s))
    await incrementSheetMusicPlay(id)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Sheet Music Library</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Download professionally arranged sheet music for all skill levels
            </p>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sheet music..."
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMusic.map((sheet) => (
                <ContentCard
                  key={sheet.id}
                  id={sheet.id}
                  title={sheet.title}
                  tags={sheet.tags || []}
                  type="pdf"
                  downloadUrl={sheet.pdf_url}
                  isOwner={isOwner}
                  onDelete={() => handleDelete(sheet.id)}
                  plays={sheet.plays}
                  saves={sheet.saves_count}
                  isSaved={savedIds.has(sheet.id)}
                  onToggleSave={() => handleToggleSave(sheet)}
                  onPlay={() => handlePlay(sheet.id)}
                />
              ))}
              {filteredMusic.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  {searchQuery ? 'No results found' : 'No sheet music available yet'}
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
