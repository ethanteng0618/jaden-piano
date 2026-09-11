'use client'

import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentLoadingTask } from 'pdfjs-dist'

export function PdfThumbnail({ url, title }: { url: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let cancelled = false
    let loadingTask: PDFDocumentLoadingTask | undefined
    setImage(null)
    setFailed(false)

    async function renderPreview() {
      try {
        const pdfjs = await import('pdfjs-dist')
        if (cancelled) return
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs'
        loadingTask = pdfjs.getDocument({
          url,
          cMapUrl: '/pdfjs/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: '/pdfjs/standard_fonts/',
          wasmUrl: '/pdfjs/wasm/',
          isEvalSupported: false,
        })
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)
        if (cancelled) return
        const original = page.getViewport({ scale: 1 })
        const viewport = page.getViewport({ scale: 800 / Math.max(original.width, original.height) })
        const canvas = document.createElement('canvas')
        canvas.width = Math.ceil(viewport.width)
        canvas.height = Math.ceil(viewport.height)
        await page.render({ canvas, viewport }).promise
        if (!cancelled) setImage(canvas.toDataURL('image/webp', 0.85))
      } catch {
        if (!cancelled) setFailed(true)
      } finally {
        await loadingTask?.destroy()
        loadingTask = undefined
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect()
        void renderPreview()
      }
    }, { rootMargin: '200px' })
    observer.observe(container)

    return () => {
      cancelled = true
      observer.disconnect()
      void loadingTask?.destroy()
    }
  }, [url])

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center bg-white">
      {image ? (
        <img src={image} alt={`First page of ${title}`} className="h-full w-full object-contain" />
      ) : (
        <span role="status" className="px-4 text-center text-sm text-gray-500">
          {failed ? 'Preview unavailable' : 'Loading sheet preview…'}
        </span>
      )}
    </div>
  )
}
