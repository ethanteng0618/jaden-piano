import { Piano, ArrowRight, Music, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { BlurText } from '@/components/blur-text'
import { ShinyText } from '@/components/shiny-text'
import { Magnet } from '@/components/magnet'
import { motion } from 'framer-motion'
import { HeroAurora } from '@/components/hero-aurora'

export function HeroSection() {
  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden">
      <HeroAurora />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left: Text Content */}
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Elevate your playing</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground font-serif leading-[1.1]">
              <BlurText text="Master the Keys" animateBy="words" delay={100} /> <br />
              <span className="text-primary italic">with Jaden.</span>
            </h1>

            <p className="text-xl leading-relaxed max-w-lg">
              <ShinyText text="Unlock your potential with techniques straight from my studio to yours. Modern pieces, classic foundations, and everything in between." speed={4} />
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/video-tutorials">
                <Magnet padding={50} magnetStrength={3}>
                  <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                    Start Learning
                  </Button>
                </Magnet>
              </Link>
              <Link href="/video-tutorials">
                <Magnet padding={50} magnetStrength={3}>
                  <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-base border-2 hover:bg-muted/50">
                    Browse Videos
                  </Button>
                </Magnet>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted" />
                ))}
              </div>
              <p className="text-sm font-medium">Join 80,000+ followers</p>
            </div>
          </div>

          {/* Right: Visual Composition */}
          <div className="relative">
            {/* Decorative blob behind */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-60" />

            <div className="relative grid gap-6">
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [2, 0, 2] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Card className="bg-background/80 backdrop-blur-md border-0 shadow-xl ring-1 ring-border/50 transition-transform duration-500">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Music className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Daily Practice Plans</h3>
                      <p className="text-sm text-muted-foreground">Structured for consistency</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], rotate: [-1, 1, -1] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="z-10 translate-x-8"
              >
                <Card className="bg-background/90 backdrop-blur-md border-0 shadow-2xl ring-1 ring-border/50 transition-transform duration-500 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <Piano className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-2">Technique &<br />Expression</h3>
                    <p className="text-muted-foreground mb-6">Mastering dynamics in modern pop songs.</p>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-primary rounded-full" />
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
