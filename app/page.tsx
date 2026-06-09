'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { ContentCard } from '@/components/content-card'
import { DifficultyLegend } from '@/components/difficulty-legend'
import { HeroAurora } from '@/components/hero-aurora'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

import { useEffect, useState } from 'react'
import { fetchVideos, fetchSheetMusic, fetchTechniqueDrills, fetchBeginnerPlans } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export default function Home() {
  const [featuredContent, setFeaturedContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const startTour = () => {
    const tourDriver = driver({
      showProgress: true,
      steps: [
        { element: '#tour-nav', popover: { title: 'Welcome!', description: 'Let us take a quick tour of the features available to you.' } },
        { element: '#tour-sheet-music', popover: { title: 'Sheet Music', description: 'Download exclusive sheet music directly to your device.' } },
        { element: '#tour-drills', popover: { title: 'Technique Drills', description: 'Practice specialized drills designed to level up your technique.' } },
        { element: '#tour-videos', popover: { title: 'Video Tutorials', description: 'Watch detailed breakdowns of songs and exercises.' } },
        { element: '#tour-profile', popover: { title: 'My Profile', description: 'Access all your saved content and manage your account here.' } },
      ]
    });
    tourDriver.drive();
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user)
    })
  }, [])

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
        const normalizedVideos = videos.map((v: any) => ({ ...v, type: 'video', aspectRatio: 'video', downloadUrl: v.video_url }))
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
              <p className="text-muted-foreground mb-4">Start your practice with these popular resources</p>

              <DifficultyLegend />
            </div>
            <Link href="/video-tutorials">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-flow-dense mt-10">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground font-light">Loading featured content...</div>
            ) : (
              featuredContent.map((content, idx) => {
                let spanClass = "col-span-1 row-span-1";
                if (idx === 0) spanClass = "md:col-span-2 md:row-span-2";
                if (idx === 3 && featuredContent.length > 3) spanClass = "md:col-span-2 md:row-span-1";

                return (
                  <motion.div
                    key={content.id || content.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
                    className={`${spanClass} h-full`}
                  >
                    <ContentCard
                      {...content}
                      thumbnail={content.thumbnail_url}
                      isLoggedIn={isLoggedIn}
                    />
                  </motion.div>
                )
              })
            )}
            {!loading && featuredContent.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground font-light">Check back soon for new content!</div>
            )}
          </div>
        </section>

        <section className="container mx-auto px-4 py-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[3rem] bg-card/10 border border-border/20 shadow-[0_0_100px_-20px_rgba(var(--primary),0.15)] backdrop-blur-2xl"
          >
            <HeroAurora />
            <div className="relative z-10 px-8 py-24 md:py-40 text-center max-w-5xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter font-serif leading-tight">
                Ready to Level Up?
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground/80 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
                Join thousands of piano enthusiasts learning from TikTok's <span className="text-foreground font-medium">j8den.shia</span>.
                Get access to exclusive sheet music, structured lesson plans, and technique drills.
              </p>
              {isLoggedIn ? (
                <Button size="lg" onClick={startTour} className="rounded-full h-16 px-12 text-lg font-bold shadow-[0_0_40px_-10px_var(--primary)] hover:shadow-[0_0_60px_-10px_var(--primary)] hover:-translate-y-1 transition-all duration-300">
                  Quick Tutorial
                </Button>
              ) : (
                <Link href="/auth">
                  <Button size="lg" className="rounded-full h-16 px-12 text-lg font-bold shadow-[0_0_40px_-10px_var(--primary)] hover:shadow-[0_0_60px_-10px_var(--primary)] hover:-translate-y-1 transition-all duration-300">
                    Start Learning Today
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  )
}
