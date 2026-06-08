'use client'

import { motion } from 'framer-motion'
import { PlayCircle, TrendingUp } from 'lucide-react'

// Theme: Video/Broadcast
export function VideoTutorialsBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Massive pulsating play button in the background */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -right-[10%] text-primary"
      >
        <PlayCircle className="w-[40vw] h-[40vw] blur-sm stroke-1" />
      </motion.div>
    </div>
  )
}

// Theme: Staff Lines (Sheet Music)
import { BookOpen } from 'lucide-react'

export function SheetMusicBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Massive pulsating book icon to represent the library, avoiding grid clash */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -top-[15%] -left-[10%] text-primary"
      >
        <BookOpen className="w-[45vw] h-[45vw] blur-sm stroke-1" />
      </motion.div>
    </div>
  )
}

// Theme: Metronome / Pendulum (Drills & Timing)
export function TechniqueDrillsBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-start justify-center opacity-40">
      {/* Faint swinging pendulum line - made much more subtle */}
      <motion.div
        animate={{ rotate: [-8, 8] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="h-[120%] w-[1px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent origin-top flex flex-col items-center"
      >
        <div className="w-3 h-3 rounded-full bg-primary/10 mt-auto mb-32 blur-[1px]" />
      </motion.div>
    </div>
  )
}

// Theme: Stepping up / Growth Path
export function BeginnerPlansBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -top-[10%] -left-[10%] text-primary"
      >
        <TrendingUp className="w-[40vw] h-[40vw] blur-sm stroke-1" />
      </motion.div>
    </div>
  )
}
