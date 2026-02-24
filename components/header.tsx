'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { Piano, Settings, Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkOwnerRole(session.user)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkOwnerRole(session.user)
      } else {
        setIsOwner(false)
      }
    })
  }, [])

  async function checkOwnerRole(user: any) {
    if (user.email === process.env.NEXT_PUBLIC_OWNER_EMAIL) {
      setIsOwner(true)
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    setIsOwner(data?.role === 'owner')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Piano className="h-6 w-6 text-primary" />
          <span className="text-foreground">j8den.shia</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/sheet-music" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Sheet Music
          </Link>
          <Link href="/technique-drills" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Technique Drills
          </Link>
          <Link href="/beginner-plans" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Beginner Plans
          </Link>
          <Link href="/video-tutorials" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Video Tutorials
          </Link>
          {isOwner && (
            <Link href="/admin" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Admin
            </Link>
          )}
          <Link href="/profile" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            My Profile
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {isOwner && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Avatar className="h-9 w-9 cursor-pointer" onClick={() => router.push('/profile')}>
                  <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button onClick={handleSignOut} size="sm" variant="ghost" className="rounded-full">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => router.push('/auth')} size="sm" className="rounded-full">
                Sign In
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border/40 shadow-lg p-4 flex flex-col gap-4 z-50 animate-in slide-in-from-top-4">
          <Link href="/sheet-music" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Sheet Music</Link>
          <Link href="/technique-drills" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Technique Drills</Link>
          <Link href="/beginner-plans" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Beginner Plans</Link>
          <Link href="/video-tutorials" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Video Tutorials</Link>
          {isOwner && (
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">Admin</Link>
          )}

          <div className="h-px bg-border/40 my-2" />

          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">My Profile</Link>
              </div>
              <Button onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} variant="secondary" className="w-full">
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={() => { setIsMobileMenuOpen(false); router.push('/auth'); }} className="w-full">
              Sign In
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
