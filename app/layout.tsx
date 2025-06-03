import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'David\'s Website',
  description: 'Welcome to my website!',
  generator: 'David & v0.dev',
  icons: {
    icon: '/rocket_launch.svg',
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
