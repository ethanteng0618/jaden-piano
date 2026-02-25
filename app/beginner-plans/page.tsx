'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Trash2, LogIn } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchBeginnerPlans } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function BeginnerPlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [token, setToken] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkOwner()
    loadPlans()
  }, [])

  async function checkOwner() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setIsLoggedIn(true)
    setToken(session.access_token)

    const isEnvOwner = session.user.email === process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim().toLowerCase()

    if (isEnvOwner) {
      setIsOwner(true)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    setIsOwner(profile?.role === 'owner')
  }

  async function loadPlans() {
    try {
      const data = await fetchBeginnerPlans()
      setPlans(data)
    } catch (error) {
      console.error('Failed to load plans:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      if (!isOwner) throw new Error('Not authorized')
      const { error } = await supabase.from('beginner_plans').delete().eq('id', id)
      if (error) throw error

      setPlans(plans.filter(p => p.id !== id))
    } catch (error) {
      alert('Error deleting plan')
      console.error(error)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Beginner Plans</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Structured learning paths designed to take you from zero to confident pianist
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className="flex flex-col hover:shadow-lg transition-shadow border-0 shadow-md rounded-2xl relative group bg-card">
                  {isOwner && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-4 right-4 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="px-2.5 py-0.5 rounded-full">{plan.level}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{plan.duration}</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold mb-3 text-foreground/80">What you&apos;ll learn:</p>
                      {plan.lessons?.map((lesson: string, lessonIndex: number) => (
                        <div key={lessonIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-muted-foreground">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pb-6">
                    {isLoggedIn ? (
                      <Button className="w-full rounded-full h-11 text-base shadow-sm">
                        Start This Plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full rounded-full h-11 text-base shadow-sm"
                        variant="outline"
                        onClick={() => router.push('/auth')}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In to Start
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
              {plans.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No beginner plans available yet
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
