'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/spotlight-card'
import { Star, Download, Trash2, Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import { VideoModal, isYouTubeUrl } from '@/components/video-modal'

interface ContentCardProps {
  id?: string
  title: string
  thumbnail?: string
  tags: string[]
  type: 'video' | 'pdf'
  downloadUrl?: string
  aspectRatio?: 'video' | 'vertical'
  isOwner?: boolean
  onDelete?: () => void
  plays?: number
  saves?: number
  isSaved?: boolean
  onToggleSave?: () => void
  onPlay?: () => void
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  learningTime?: string
  learning_time?: string
}

export function ContentCard({
  id,
  title,
  thumbnail,
  tags,
  type,
  downloadUrl,
  aspectRatio = 'video',
  isOwner = false,
  onDelete,
  plays = 0,
  saves = 0,
  isSaved = false,
  onToggleSave,
  onPlay,
  difficulty,
  learningTime,
  learning_time
}: ContentCardProps) {
  const displayLearningTime = learningTime || learning_time
  const [isDeleting, setIsDeleting] = useState(false)
  // Optimistic UI for saves
  const [currentSaved, setCurrentSaved] = useState(isSaved)
  const [currentSavesCount, setCurrentSavesCount] = useState(saves)

  // Sync state if props change
  useEffect(() => {
    setCurrentSaved(isSaved)
    setCurrentSavesCount(saves)
  }, [isSaved, saves])

  async function handleDelete() {
    if (!onDelete || !confirm('Are you sure you want to delete this?')) return

    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleToggleSave(e: React.MouseEvent) {
    e.preventDefault()
    if (!onToggleSave) return

    // Optimistic update
    const newSaved = !currentSaved
    setCurrentSaved(newSaved)
    setCurrentSavesCount(prev => newSaved ? prev + 1 : prev - 1)

    try {
      await onToggleSave()
    } catch (err) {
      // Revert if failed
      setCurrentSaved(!newSaved)
      setCurrentSavesCount(prev => !newSaved ? prev + 1 : prev - 1)
    }
  }

  const borderColors: Record<string, string> = {
    beginner: 'border-green-500',
    intermediate: 'border-yellow-500',
    advanced: 'border-red-500',
  }
  const difficultyBorder = difficulty ? `border-2 ${borderColors[difficulty]}` : 'border-0'

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  return (
    <>
      <SpotlightCard className="h-full group hover:-translate-y-1" spotlightColor="rgba(120, 160, 255, 0.15)">
        <Card className={`h-full overflow-hidden shadow-sm transition-all duration-300 rounded-2xl bg-card/60 backdrop-blur-sm ${difficultyBorder}`}>
          <div className={`relative bg-muted overflow-hidden ${aspectRatio === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'}`}>
            {thumbnail ? (
              <img
                src={thumbnail || "/placeholder.svg"}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
                {type === 'video' ? (
                  <Play className="h-12 w-12 text-muted-foreground/50 fill-muted-foreground/20" />
                ) : (
                  <Download className="h-12 w-12 text-muted-foreground/50" />
                )}
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 content-end pb-4 px-4" />

            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              {/* Stats badges */}
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 py-1 text-xs text-white">
                <Play className="h-3 w-3 fill-white" />
                <span>{plays}</span>
              </div>

              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
                onClick={handleToggleSave}
              >
                <Star className={`h-4 w-4 ${currentSaved ? 'fill-primary text-primary' : 'text-foreground'}`} />
              </Button>

              {isOwner && onDelete && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete()
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <CardContent className="p-5">
            <h3 className="font-sans font-bold text-lg mb-3 line-clamp-2 leading-tight tracking-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium px-2.5 py-0.5 bg-secondary/50 border-0">
                  {tag}
                </Badge>
              ))}
            </div>
            {displayLearningTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {displayLearningTime}
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Play className="h-3 w-3" /> {plays} plays
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {currentSavesCount} saves
              </span>
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0">
            {downloadUrl ? (
              <Button
                className="w-full rounded-full font-medium shadow-none hover:shadow-md transition-all"
                variant="outline"
                onClick={() => {
                  if (onPlay) onPlay()
                  if (type === 'video') {
                    setIsVideoModalOpen(true)
                  } else {
                    window.open(downloadUrl, '_blank')
                  }
                }}
              >
                {type === 'video' ? (
                  <>
                    <Play className="h-4 w-4 mr-2" /> Watch Now
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </>
                )}
              </Button>
            ) : (
              <Button className="w-full rounded-full" variant="outline" disabled>
                Not Available
              </Button>
            )}
          </CardFooter>
        </Card>
      </SpotlightCard>

      {type === 'video' && downloadUrl && (
        <VideoModal
          videoUrl={downloadUrl}
          title={title}
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}
    </>
  )
}
