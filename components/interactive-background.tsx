'use client'

import { useEffect, useRef } from 'react'

export function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        let mouse = { x: -1000, y: -1000 }

        // Configuration
        const spacing = 30 // Space between dots
        const radius = 1.5 // Dot radius
        const repulsionRadius = 150 // Mouse influence area
        const repulsionStrength = 5 // How hard it pushes

        class Particle {
            x: number
            y: number
            originX: number
            originY: number
            vx: number
            vy: number

            constructor(x: number, y: number) {
                this.x = x
                this.y = y
                this.originX = x
                this.originY = y
                this.vx = 0
                this.vy = 0
            }

            update() {
                const dx = mouse.x - this.x
                const dy = mouse.y - this.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                const forceDirectionX = dx / distance
                const forceDirectionY = dy / distance

                let force = 0
                if (distance < repulsionRadius) {
                    force = (repulsionRadius - distance) / repulsionRadius
                }

                if (force > 0) {
                    const directionX = forceDirectionX * force * repulsionStrength
                    const directionY = forceDirectionY * force * repulsionStrength
                    this.vx -= directionX
                    this.vy -= directionY
                } else {
                    // Return to origin
                    if (this.x !== this.originX) {
                        this.vx += (this.originX - this.x) * 0.05 // Spring factor
                    }
                    if (this.y !== this.originY) {
                        this.vy += (this.originY - this.y) * 0.05
                    }
                }

                // Friction
                this.vx *= 0.9
                this.vy *= 0.9

                this.x += this.vx
                this.y += this.vy
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(100, 100, 100, 0.15)' // Subtle gray/primary
                ctx.fill()
            }
        }

        const init = () => {
            particles = []
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            for (let x = 0; x < canvas.width; x += spacing) {
                for (let y = 0; y < canvas.height; y += spacing) {
                    particles.push(new Particle(x, y))
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach(particle => {
                particle.update()
                particle.draw()
            })
            animationFrameId = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            init()
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('mousemove', handleMouseMove)

        init()
        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none bg-background"
        />
    )
}
