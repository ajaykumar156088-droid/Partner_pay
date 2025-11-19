import type { Metadata } from 'next'
import './globals.css'

// Force dynamic rendering for the app to avoid static prerendering errors
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Partner Pay Platform',
  description: 'Partner Pay Platform - Admin and User Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  )
}


