import Link from 'next/link'
import { Instagram, Mail, Music, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-6">
            <Link
              href="https://www.tiktok.com/@j8den.shia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors"
            >
              <Music className="h-5 w-5" />
              <span className="sr-only">TikTok</span>
            </Link>
            <Link
              href="https://instagram.com/j8den.shia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/jaden-shia-41b704358/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="mailto:jadenshia34@gmail.com"
              className="text-foreground/60 hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            © 2026 j8den.shia
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Made by <a href="https://www.linkedin.com/in/ethan-teng-952149235/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline underline-offset-4">Ethan Teng</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
