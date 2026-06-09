'use client'

import { Piano, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { BlurText } from '@/components/blur-text'
import { ShinyText } from '@/components/shiny-text'
import { motion } from 'framer-motion'
import { HeroAurora } from '@/components/hero-aurora'
import { MusicThemeBg } from '@/components/music-theme-bg'

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] py-24 lg:py-40 flex items-center overflow-hidden">
      <HeroAurora />
      <MusicThemeBg />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 w-full max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-center justify-between">
          
          {/* Left: Text Content - Ultra Wide */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-7/12 space-y-10 text-left relative z-20"
          >
            {/* The 2-Line Iron Rule Header */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground font-serif leading-[1.05] max-w-3xl">
              <BlurText text="Master the Keys" animateBy="words" delay={100} /> <br />
              <span className="text-primary italic font-light tracking-normal">with Jaden.</span>
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed max-w-2xl text-muted-foreground/90 font-light">
              <ShinyText text="Unlock your potential with techniques straight from my studio to yours. Modern pieces, classic foundations, and everything in between." speed={4} />
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <Link href="/video-tutorials">
                <Button size="lg" className="rounded-full h-16 px-10 text-lg font-medium shadow-[0_0_30px_-5px_var(--primary)] hover:shadow-[0_0_50px_-5px_var(--primary)] hover:-translate-y-1 hover:scale-105 transition-all duration-500">
                  Start Learning
                </Button>
              </Link>
              <Link href="/video-tutorials">
                <Button variant="outline" size="lg" className="rounded-full h-16 px-10 text-lg font-medium border-border/50 bg-background/30 backdrop-blur-sm hover:bg-muted/50 hover:-translate-y-1 hover:scale-105 transition-all duration-500 hover:shadow-xl">
                  Browse Videos
                </Button>
              </Link>
            </div>
            
            {/* Join Count - Minimal */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex items-center gap-6 pt-12 opacity-50 hover:opacity-100 transition-opacity duration-500"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 w-12 rounded-full border border-border/40 bg-card/80 backdrop-blur-md" />
                ))}
              </div>
              <p className="text-sm font-medium tracking-wide uppercase">120,000+ Followers</p>
            </motion.div>
          </motion.div>

          {/* Right: Floating Visuals - Artistic Asymmetry */}
          <div className="w-full lg:w-5/12 relative min-h-[400px] flex justify-end items-center">
            {/* Deep glow backdrop */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-70 pointer-events-none" />

            <div className="relative w-full max-w-md ml-auto">
              {/* Floating Card 1 */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative z-20 mb-8 -ml-12"
              >
                <Card className="bg-background/40 backdrop-blur-2xl border border-border/30 shadow-2xl overflow-hidden rounded-[2rem]">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                        <Piano className="h-8 w-8 text-primary" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-3 tracking-tight">Technique &<br />Expression</h3>
                    <p className="text-muted-foreground/80 mb-8 font-light text-lg">Master dynamics in modern pop.</p>
                    <div className="h-1 w-full bg-border/40 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "66%" }}
                        transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="absolute -bottom-16 -right-8 w-3/4 z-30"
              >
                <Card className="bg-card/90 backdrop-blur-xl border border-border/20 shadow-2xl rounded-3xl overflow-hidden">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_15px_var(--primary)]">
                      <Music className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">Daily Plans</h3>
                      <p className="text-sm text-muted-foreground font-light">Structured practice</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
