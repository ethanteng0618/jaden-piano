import { cp, mkdir } from 'node:fs/promises'

const source = new URL('../node_modules/pdfjs-dist/', import.meta.url)
const destination = new URL('../public/pdfjs/', import.meta.url)
await mkdir(destination, { recursive: true })
await cp(new URL('build/pdf.worker.min.mjs', source), new URL('pdf.worker.min.mjs', destination))
for (const directory of ['cmaps', 'standard_fonts', 'wasm']) {
  await cp(new URL(directory, source), new URL(directory, destination), { recursive: true })
}
