require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.EXPRESS_PORT || 3001;

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// Ensure upload directories exist
const uploadDirs = ['public/uploads/videos', 'public/uploads/sheet-music', 'public/uploads/thumbnails'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'public/uploads/';
    if (file.fieldname === 'video') {
      uploadPath += 'videos/';
    } else if (file.fieldname === 'sheetMusic' || file.fieldname === 'pdf') {
      uploadPath += 'sheet-music/';
    } else if (file.fieldname === 'thumbnail') {
      uploadPath += 'thumbnails/';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

// Auth middleware - check if user is owner
async function isOwner(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is owner (by email or role)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'owner' && user.email !== process.env.OWNER_EMAIL) {
      return res.status(403).json({ error: 'Owner access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

// Public routes - Get content
app.get('/api/videos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, saved_videos(count)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to flatten count
    const activeData = data.map(item => ({
      ...item,
      saves_count: item.saved_videos?.[0]?.count || 0,
      saved_videos: undefined
    }));

    res.json(activeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sheet-music', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sheet_music')
      .select('*, saved_sheet_music(count)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const activeData = data.map(item => ({
      ...item,
      saves_count: item.saved_sheet_music?.[0]?.count || 0,
      saved_sheet_music: undefined
    }));

    res.json(activeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/technique-drills', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('technique_drills')
      .select('*, saved_technique_drills(count)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const activeData = data.map(item => ({
      ...item,
      saves_count: item.saved_technique_drills?.[0]?.count || 0,
      saved_technique_drills: undefined
    }));

    res.json(activeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/beginner-plans', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('beginner_plans')
      .select('*')
      .order('duration', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment play counts
app.post('/api/videos/:id/play', async (req, res) => {
  try {
    const { error } = await supabase
      .rpc('increment_video_play', { row_id: req.params.id });
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sheet-music/:id/play', async (req, res) => {
  try {
    const { error } = await supabase
      .rpc('increment_sheet_music_play', { row_id: req.params.id });
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/technique-drills/:id/play', async (req, res) => {
  try {
    const { error } = await supabase
      .rpc('increment_technique_drill_play', { row_id: req.params.id });
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Owner routes - Upload content
app.post('/api/upload/video', isOwner, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, tags, aspectRatio } = req.body;
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({ error: 'Video file required' });
    }

    const videoData = {
      title,
      description: description || null,
      tags: tags ? JSON.parse(tags) : [],
      video_url: `/uploads/videos/${videoFile.filename}`,
      thumbnail_url: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null,
      aspect_ratio: aspectRatio || 'video',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('videos')
      .insert([videoData])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload/sheet-music', isOwner, upload.single('pdf'), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const sheetMusicData = {
      title,
      description: description || null,
      tags: tags ? JSON.parse(tags) : [],
      pdf_url: `/uploads/sheet-music/${pdfFile.filename}`,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('sheet_music')
      .insert([sheetMusicData])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload/technique-drill', isOwner, upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, tags, difficulty } = req.body;
    const pdfFile = req.files?.pdf?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!pdfFile) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const drillData = {
      title,
      description: description || null,
      tags: tags ? JSON.parse(tags) : [],
      difficulty: difficulty || 'intermediate',
      pdf_url: `/uploads/sheet-music/${pdfFile.filename}`,
      thumbnail_url: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('technique_drills')
      .insert([drillData])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload/beginner-plan', isOwner, async (req, res) => {
  try {
    const { title, duration, level, description, lessons } = req.body;

    const planData = {
      title,
      duration,
      level,
      description,
      lessons: lessons ? JSON.parse(lessons) : [],
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('beginner_plans')
      .insert([planData])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete routes (owner only)
app.delete('/api/videos/:id', isOwner, async (req, res) => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/sheet-music/:id', isOwner, async (req, res) => {
  try {
    const { error } = await supabase
      .from('sheet_music')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/technique-drills/:id', isOwner, async (req, res) => {
  try {
    const { error } = await supabase
      .from('technique_drills')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/beginner-plans/:id', isOwner, async (req, res) => {
  try {
    const { error } = await supabase
      .from('beginner_plans')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
