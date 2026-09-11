'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SheetMusicBg } from '@/components/theme-accents'
import { ContentCard } from '@/components/content-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { fetchSheetMusic } from '@/lib/api'
import Loading from './loading'
import { supabase } from '@/lib/supabase'

export default function SheetMusicPage() {
  const [sheetMusic, setSheetMusic] = useState<any[]>([])
  const [filteredMusic, setFilteredMusic] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pendingSaves = useRef(new Set<string>())
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
      if (!isOwner) throw new Error('Not authorized')
      const { error } = await supabase.from('sheet_music').delete().eq('id', id)
      if (error) throw error

      const updated = sheetMusic.filter(s => s.id !== id)
      setSheetMusic(updated)
    } catch (error) {
      alert('Error deleting sheet music')
      console.error(error)
    }
  }

  async function handleDownload(id: string) {
    if (!user || savedIds.has(id) || pendingSaves.current.has(id)) return
    pendingSaves.current.add(id)

    try {
      const { data, error } = await supabase
        .from('saved_sheet_music')
        .upsert({ user_id: user.id, sheet_music_id: id }, {
          onConflict: 'user_id,sheet_music_id',
          ignoreDuplicates: true,
        })
        .select('sheet_music_id')

      if (error) throw error
      setSavedIds(previous => new Set(previous).add(id))
      if (data?.length) {
        setSheetMusic(previous => previous.map(sheet => sheet.id === id
          ? { ...sheet, saves_count: (sheet.saves_count || 0) + 1 }
          : sheet))
      }
    } catch (error) {
      console.error('Failed to save sheet music:', error)
      alert('The PDF opened, but saving failed. Please try downloading again.')
    } finally {
      pendingSaves.current.delete(id)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-12 md:py-16">
          <SheetMusicBg />
          <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-balance">Sheet Music Library</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Download professionally arranged sheet music for all skill levels
            </p>

            <div className="relative max-w-md mt-6">
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
                  pdfPreviewUrl={sheet.pdf_url}
                  isOwner={isOwner}
                  onDelete={() => handleDelete(sheet.id)}
                  savesOnly
                  saves={sheet.saves_count}
                  isSaved={savedIds.has(sheet.id)}
                  learningTime={sheet.learning_time}
                  onDownload={() => handleDownload(sheet.id)}
                  isLoggedIn={!!user}
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
