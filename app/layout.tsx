import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BookFlow - Share, Exchange, Discover Books',
  description: 'A modern platform for book lovers to exchange, borrow, and share their favorite reads with the community.',
  generator: 'v0.app',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'BookFlow - Book Exchange Platform',
    description: 'Discover, exchange, and share books with fellow readers',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
