'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ContentCard } from '@/components/content-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSavedContent() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      try {
        // Fetch saved videos
        const { data: savedVids } = await supabase
          .from('saved_videos')
          .select('video_id, videos(*)')
          .eq('user_id', session.user.id)

        // Fetch saved sheet music
        const { data: savedSheets } = await supabase
          .from('saved_sheet_music')
          .select('sheet_music_id, sheet_music(*)')
          .eq('user_id', session.user.id)

        const normalizedVideos = (savedVids || []).map((v: any) => ({ ...v.videos, type: 'video', aspectRatio: 'video', downloadUrl: v.videos?.video_url }))
        const normalizedSheets = (savedSheets || []).map((s: any) => ({ ...s.sheet_music, type: 'pdf', downloadUrl: s.sheet_music.pdf_url }))

        // Combine
        const combined = [...normalizedVideos, ...normalizedSheets].filter(item => item && item.id).sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        setContent(combined)
      } catch (error) {
        console.error('Failed to load saved content', error)
      } finally {
        setLoading(false)
      }
    }

    loadSavedContent()
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">JS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">Jaden Shia</h1>
                <p className="text-muted-foreground mb-4 text-lg">Piano Creator</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-1 lg:col-span-2 space-y-8">
              <h2 className="text-3xl font-serif font-bold tracking-tight">Saved Content</h2>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading your saves...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.length > 0 ? (
                    content.map((item) => (
                      <ContentCard
                        key={item.id || item.title}
                        {...item}
                        thumbnail={item.thumbnail_url}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                      You haven't saved any content yet!
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>FAQ & Navigation</CardTitle>
                  <CardDescription>How to use the website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground">Video Tutorials</h4>
                    <p>Watch step-by-step video lessons sorted by difficulty.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Sheet Music</h4>
                    <p>Download and print PDF sheet music for your practice.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Technique Drills</h4>
                    <p>Focused exercises to improve your piano technique.</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-2 hover:bg-destructive hover:text-white hover:border-destructive transition-colors" onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.href = '/'
                  }}>
                    Log Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
