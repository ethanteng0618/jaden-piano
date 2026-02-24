'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface VideoModalProps {
    videoUrl: string
    title: string
    isOpen: boolean
    onClose: () => void
}

function getYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&?/\s]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    return null
}

export function isYouTubeUrl(url: string): boolean {
    return /(?:youtube\.com|youtu\.be)/.test(url) || getYouTubeId(url) !== null
}

export function VideoModal({ videoUrl, title, isOpen, onClose }: VideoModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    if (!isOpen) return null

    const youtubeId = getYouTubeId(videoUrl)

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/40">
                    <h3 className="font-sans font-semibold text-lg truncate pr-4">{title}</h3>
                    <button
                        onClick={onClose}
                        className="shrink-0 h-8 w-8 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Video */}
                <div className="aspect-video w-full bg-black">
                    {youtubeId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                            title={title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            className="w-full h-full"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
