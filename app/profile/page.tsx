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
import { fetchVideos, fetchSheetMusic } from '@/lib/api'

export default function ProfilePage() {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContent() {
      try {
        const [videos, sheetMusic] = await Promise.all([
          fetchVideos(),
          fetchSheetMusic()
        ])

        const normalizedVideos = videos.map((v: any) => ({ ...v, type: 'video', aspectRatio: 'video' }))
        const normalizedSheets = sheetMusic.map((s: any) => ({ ...s, type: 'pdf', downloadUrl: s.pdf_url }))

        // Combine and show most recent
        const combined = [...normalizedVideos, ...normalizedSheets].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        setContent(combined)
      } catch (error) {
        console.error('Failed to load profile content', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
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
                <p className="text-muted-foreground mb-4 text-lg">Piano Student</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="uploads" className="w-full">
            <TabsList className="mb-8 w-full justify-start h-auto p-1 bg-muted/80 backdrop-blur-sm rounded-lg border shadow-sm">
              <TabsTrigger
                value="uploads"
                className="rounded-md px-4 py-2"
              >
                Recent Uploads
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="rounded-md px-4 py-2"
              >
                My Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uploads" className="mt-8">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading recent uploads...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {content.map((item) => (
                    <ContentCard
                      key={item.id || item.title}
                      {...item}
                      thumbnail={item.thumbnail_url}
                    />
                  ))}
                  {content.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                      No recent uploads found.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="progress" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>30-Day Foundation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">45%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[45%] rounded-full" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You&apos;re on Day 14 of 30. Keep up the great work!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Practice Stats</CardTitle>
                    <CardDescription>This month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-3xl font-bold tracking-tight">12 hours</p>
                        <p className="text-sm text-muted-foreground">Total practice time</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold tracking-tight">18 days</p>
                        <p className="text-sm text-muted-foreground">Practice streak</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </>
  )
}
