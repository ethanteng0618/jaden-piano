import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Count all saves on the server; never expose individual save records or users.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )
    const counts: Record<string, number> = {}
    const pageSize = 1000

    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabase
        .from('sheet_music')
        .select('id, saved_sheet_music(count)')
        .order('id')
        .range(offset, offset + pageSize - 1)

      if (error) throw error
      for (const sheet of data) {
        counts[sheet.id] = sheet.saved_sheet_music[0]?.count ?? 0
      }
      if (data.length < pageSize) break
    }

    return NextResponse.json(counts, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Failed to load sheet music save counts:', error)
    return NextResponse.json({ error: 'Failed to load save counts' }, { status: 500 })
  }
}
