'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { ContentCard } from '@/components/content-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

import { useEffect, useState } from 'react'
import { fetchVideos, fetchSheetMusic, fetchTechniqueDrills, fetchBeginnerPlans } from '@/lib/api'

export default function Home() {
  const [featuredContent, setFeaturedContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContent() {
      try {
        const [videos, sheetMusic, drills, plans] = await Promise.all([
          fetchVideos(),
          fetchSheetMusic(),
          fetchTechniqueDrills(),
          fetchBeginnerPlans()
        ])

        // Normalize data for display
        const normalizedVideos = videos.map((v: any) => ({ ...v, type: 'video', aspectRatio: 'video' }))
        const normalizedSheets = sheetMusic.map((s: any) => ({ ...s, type: 'pdf', downloadUrl: s.pdf_url }))
        const normalizedDrills = drills.map((d: any) => ({ ...d, type: 'pdf', downloadUrl: d.pdf_url }))
        const normalizedPlans = plans.map((p: any) => ({ ...p, type: 'plan', description: p.description })) // Plans might need special card handling or just basic info

        // Combine and pick simplified set for homepage (e.g. 1 of each or just recent 4)
        // Since we don't have real dates easily sortable mixed effectively without parsing, let's just pick top 1 from each category to show variety

        const mixedContent = [
          ...normalizedVideos.slice(0, 2),
          ...normalizedSheets.slice(0, 1),
          ...normalizedDrills.slice(0, 1)
        ].slice(0, 4)

        setFeaturedContent(mixedContent)
      } catch (error) {
        console.error('Failed to load featured content', error)
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
        <HeroSection />

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Content</h2>
              <p className="text-muted-foreground">Start your practice with these popular resources</p>
            </div>
            <Link href="/video-tutorials">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading featured content...</div>
            ) : (
              featuredContent.map((content) => (
                <ContentCard
                  key={content.id || content.title}
                  {...content}
                  // Ensure correct props mapping if needed
                  thumbnail={content.thumbnail_url}
                />
              ))
            )}
            {!loading && featuredContent.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">Check back soon for new content!</div>
            )}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Level Up?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of piano enthusiasts learning from TikTok&apos;s j8den.shia.
              Get access to exclusive sheet music, structured lesson plans, and technique drills.
            </p>
            <Button size="lg" className="rounded-full">
              Start Learning Today
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
