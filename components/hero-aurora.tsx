'use client'

import { motion } from 'framer-motion'

export function HeroAurora() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/30 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, -60, 0],
                    y: [0, 40, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, 30, 0],
                    y: [0, 50, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-secondary/40 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
            />
        </div>
    )
}
