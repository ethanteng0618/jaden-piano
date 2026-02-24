'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { uploadVideo, uploadSheetMusic, uploadTechniqueDrill, uploadBeginnerPlan } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string>('')
  const [activeTab, setActiveTab] = useState('video')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth')
        return
      }

      // Check if user is owner via env var
      const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim().toLowerCase()
      const userEmail = session.user.email?.trim().toLowerCase()

      console.log('Admin Auth Debug:', {
        userEmail,
        ownerEmail,
        match: userEmail === ownerEmail
      })

      if (userEmail && ownerEmail && userEmail === ownerEmail) {
        setUser(session.user)
        setToken(session.access_token)
        return
      }

      // Check if user is owner via database role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role === 'owner') {
        setUser(session.user)
        setToken(session.access_token)
      } else {
        router.push('/') // Redirect non-owners to home
      }
    }

    checkAuth()
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    )
  }

  const menuItems = [
    { id: 'video', label: 'Upload Video', description: 'Add new video tutorials' },
    { id: 'sheet-music', label: 'Upload Sheet Music', description: 'Add PDF scores' },
    { id: 'drill', label: 'Upload Drill', description: 'Add technique exercises' },
    { id: 'plan', label: 'Create Plan', description: 'Build structured courses' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0 space-y-2">
            <h1 className="text-2xl font-bold mb-6 px-4">Dashboard</h1>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <div className="relative z-10">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs mt-0.5 opacity-80 ${activeTab === item.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </aside>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden lg:block w-px bg-border/50 self-stretch mx-4" />

          {/* Main Content Area */}
          <section className="flex-1 max-w-3xl">
            <div className={`transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}>
              {activeTab === 'video' && <UploadVideoForm token={token} />}
              {activeTab === 'sheet-music' && <UploadSheetMusicForm token={token} />}
              {activeTab === 'drill' && <UploadDrillForm token={token} />}
              {activeTab === 'plan' && <CreatePlanForm token={token} />}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

function UploadVideoForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    aspectRatio: 'video' as 'video' | 'vertical',
    difficulty: 'beginner',
    learningTime: '10 mins'
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!videoFile) return

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('video', videoFile)
      if (thumbnailFile) fd.append('thumbnail', thumbnailFile)
      fd.append('title', formData.title)
      fd.append('description', formData.description)
      fd.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())))
      fd.append('aspectRatio', formData.aspectRatio)
      fd.append('difficulty', formData.difficulty)
      fd.append('learningTime', formData.learningTime)

      await uploadVideo(fd, token)
      alert('Video uploaded successfully!')
      setFormData({ title: '', description: '', tags: '', aspectRatio: 'video', difficulty: 'beginner', learningTime: '10 mins' })
      setVideoFile(null)
      setThumbnailFile(null)
    } catch (error: any) {
      alert('Upload failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
        <CardDescription>Upload a new video tutorial</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Video File *</Label>
            <Input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} required />
          </div>
          <div>
            <Label>Thumbnail (optional)</Label>
            <Input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Label>Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div>
            <Label>Tags (comma-separated)</Label>
            <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Beginner, Pop, Tutorial" />
          </div>
          <div>
            <Label>Difficulty</Label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <Label>Learning Time (e.g. 10 mins)</Label>
            <Input value={formData.learningTime} onChange={(e) => setFormData({ ...formData, learningTime: e.target.value })} />
          </div>

          <Button type="submit" disabled={loading}>Upload Video</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function UploadSheetMusicForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', tags: '', difficulty: 'beginner', learningTime: '10 mins' })
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pdfFile) return

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('pdf', pdfFile)
      fd.append('title', formData.title)
      fd.append('description', formData.description)
      fd.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())))
      fd.append('difficulty', formData.difficulty)
      fd.append('learningTime', formData.learningTime)

      await uploadSheetMusic(fd, token)
      alert('Sheet music uploaded successfully!')
      setFormData({ title: '', description: '', tags: '', difficulty: 'beginner', learningTime: '10 mins' })
      setPdfFile(null)
    } catch (error: any) {
      alert('Upload failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Sheet Music</CardTitle>
        <CardDescription>Upload a PDF sheet music file</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>PDF File *</Label>
            <Input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} required />
          </div>
          <div>
            <Label>Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div>
            <Label>Tags (comma-separated)</Label>
            <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Intermediate, Classical, Beethoven" />
          </div>
          <div>
            <Label>Difficulty</Label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <Label>Learning Time (e.g. 10 mins)</Label>
            <Input value={formData.learningTime} onChange={(e) => setFormData({ ...formData, learningTime: e.target.value })} />
          </div>
          <Button type="submit" disabled={loading}>Upload Sheet Music</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function UploadDrillForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', tags: '', difficulty: 'intermediate', learningTime: '10 mins' })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pdfFile) return

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('pdf', pdfFile)
      if (thumbnailFile) fd.append('thumbnail', thumbnailFile)
      fd.append('title', formData.title)
      fd.append('description', formData.description)
      fd.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())))
      fd.append('difficulty', formData.difficulty)
      fd.append('learningTime', formData.learningTime)

      await uploadTechniqueDrill(fd, token)
      alert('Technique drill uploaded successfully!')
      setFormData({ title: '', description: '', tags: '', difficulty: 'intermediate', learningTime: '10 mins' })
      setPdfFile(null)
      setThumbnailFile(null)
    } catch (error: any) {
      alert('Upload failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Technique Drill</CardTitle>
        <CardDescription>Upload a technique drill PDF</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>PDF File *</Label>
            <Input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} required />
          </div>
          <div>
            <Label>Thumbnail (optional)</Label>
            <Input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Label>Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div>
            <Label>Tags (comma-separated)</Label>
            <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="All Levels, Scales, Major" />
          </div>
          <div>
            <Label>Difficulty</Label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <Label>Learning Time (e.g. 10 mins)</Label>
            <Input value={formData.learningTime} onChange={(e) => setFormData({ ...formData, learningTime: e.target.value })} />
          </div>
          <Button type="submit" disabled={loading}>Upload Drill</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function CreatePlanForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    level: '',
    description: '',
    lessons: '',
    learningTime: '1 week'
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const lessons = formData.lessons.split('\n').filter(l => l.trim())
      await uploadBeginnerPlan({
        ...formData,
        lessons
      }, token)
      alert('Beginner plan created successfully!')
      setFormData({ title: '', duration: '', level: '', description: '', lessons: '', learningTime: '1 week' })
    } catch (error: any) {
      alert('Creation failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Beginner Plan</CardTitle>
        <CardDescription>Create a new structured learning plan</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label>Duration *</Label>
            <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="1 week" required />
          </div>
          <div>
            <Label>Level *</Label>
            <Input value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} placeholder="Absolute Beginner" required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div>
            <Label>Lessons (one per line) *</Label>
            <Textarea
              value={formData.lessons}
              onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
              placeholder="Introduction to the keyboard&#10;Proper posture and hand position"
              rows={8}
              required
            />
          </div>
          <div>
            <Label>Learning Time / Duration Meta (e.g. 1 week)</Label>
            <Input value={formData.learningTime} onChange={(e) => setFormData({ ...formData, learningTime: e.target.value })} />
          </div>
          <Button type="submit" disabled={loading}>Create Plan</Button>
        </form>
      </CardContent>
    </Card>
  )
}
