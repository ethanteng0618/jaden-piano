'use client'

import { Music, Music2, Music3, Music4 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function MusicThemeBg() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate random configurations for floating notes
  const notes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 30 + 30, // 30px to 60px
    left: Math.random() * 100, // 0 to 100%
    duration: Math.random() * 20 + 20, // 20s to 40s (slow, elegant float)
    delay: Math.random() * -30, // Start randomly throughout the animation cycle
    Icon: i % 2 === 0 ? Music : (i % 3 === 0 ? Music3 : Music2) // Mix up the icons
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Dynamic Soundwave / EQ Visualizer at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] flex items-end justify-center opacity-20 dark:opacity-10 mix-blend-plus-lighter">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <div className="flex items-end justify-between w-[110%] h-full ml-[-5%]">
          {Array.from({ length: 48 }).map((_, i) => (
            <motion.div
              key={`bar-${i}`}
              animate={{ 
                height: [`${Math.random() * 20 + 10}%`, `${Math.random() * 70 + 30}%`, `${Math.random() * 20 + 10}%`] 
              }}
              transition={{ 
                duration: Math.random() * 2 + 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: Math.random() * -2
              }}
              className="w-full mx-[1px] md:mx-[2px] bg-primary rounded-t-full origin-bottom"
            />
          ))}
        </div>
      </div>

      {/* Elegant Floating Music Notes */}
      {notes.map((note) => (
        <motion.div
          key={`note-${note.id}`}
          initial={{ 
            y: "110vh", 
            x: "-50%",
            opacity: 0,
            rotate: -20
          }}
          animate={{ 
            y: "-10vh",
            x: "50%",
            opacity: [0, 0.5, 0.5, 0],
            rotate: 20
          }}
          transition={{ 
            duration: note.duration,
            delay: note.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute text-primary/30 dark:text-primary/20 blur-[1px]"
          style={{ 
            left: `${note.left}%`,
            width: note.size, 
            height: note.size 
          }}
        >
          <note.Icon className="w-full h-full" strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  )
}
