import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'David\'s Website',
  description: 'Created with the help of v0',
  generator: 'David & v0.dev',
  icons: {
    icon: '/rocket.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
