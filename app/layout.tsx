import React from "react"
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GridBackground } from '@/components/grid-background'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthHandler } from '@/components/auth-handler'
import './globals.css'

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const fontSerif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: 'j8den.shia',
  description: 'Master the keys with TikTok creator j8den.shia.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg?v=3',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontSerif.variable} font-sans antialiased text-foreground selection:bg-primary/30 selection:text-primary-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthHandler />
          <GridBackground />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
