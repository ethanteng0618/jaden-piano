const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

function loadRoute(pages) {
  let page = 0
  const queries = []
  const query = {
    select(columns) { assert.equal(columns, 'id, saved_sheet_music(count)'); return this },
    order(column) { assert.equal(column, 'id'); return this },
    async range(start, end) { queries.push([start, end]); return pages[page++] },
  }
  const source = fs.readFileSync('app/api/sheet-music/save-counts/route.ts', 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  })
  const exports = {}
  vm.runInNewContext(outputText, {
    exports,
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SECRET_KEY: 'server-secret' } },
    console: { error() {} },
    require(name) {
      if (name === 'next/server') return { NextResponse: { json: (body, options) => Response.json(body, options) } }
      assert.equal(name, '@supabase/supabase-js')
      return { createClient(url, key, options) {
        assert.equal(key, 'server-secret')
        assert.equal(options.auth.persistSession, false)
        return { from(table) { assert.equal(table, 'sheet_music'); return query } }
      } }
    },
  })
  return { GET: exports.GET, queries }
}

test('anonymous requests receive global totals without exposing save records', async () => {
  const { GET } = loadRoute([{ data: [
    { id: 'sheet-a', saved_sheet_music: [{ count: 3 }], user_id: 'must-not-leak' },
    { id: 'sheet-b', saved_sheet_music: [{ count: 0 }] },
  ], error: null }])
  const response = await GET()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await response.json(), { 'sheet-a': 3, 'sheet-b': 0 })
})

test('counts include sheets beyond the database page limit', async () => {
  const firstPage = Array.from({ length: 1000 }, (_, i) => ({ id: `sheet-${i}`, saved_sheet_music: [{ count: 1 }] }))
  const { GET, queries } = loadRoute([
    { data: firstPage, error: null },
    { data: [{ id: 'last-sheet', saved_sheet_music: [{ count: 2 }] }], error: null },
  ])
  const counts = await (await GET()).json()
  assert.equal(Object.keys(counts).length, 1001)
  assert.equal(counts['last-sheet'], 2)
  assert.deepEqual(queries, [[0, 999], [1000, 1999]])
})

test('database failures return an error instead of misleading zero counts', async () => {
  const { GET } = loadRoute([{ data: null, error: { message: 'private database error' } }])
  const response = await GET()
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: 'Failed to load save counts' })
})
