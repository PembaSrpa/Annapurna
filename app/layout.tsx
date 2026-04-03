import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Annapurna Mobile Care',
  description: 'Mobile accessories, repairs, and printing services in Dharan-16 Annapurna Chowk',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
