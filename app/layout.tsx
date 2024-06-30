import './globals.css'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Trending GitHub Repositories',
    template: '%s | Trending GitHub Repositories',
  },
  description:
    'Discover trending GitHub repositories by star differences on trendingrepos.com. Explore daily, weekly, and monthly trends, and filter by programming language.',
  generator: 'Next.js',
  creator: 'Phuc Tran',
  publisher: 'Phuc Tran',
  keywords: [
    'Trending GitHub Repositories',
    'Popular GitHub Repositories',
    'Top GitHub Repositories',
    'GitHub Repo Trends',
    'Trending GitHub Projects',
    'Popular Repos on GitHub',
    'Trending Repos',
    'Trending Repositories',
    'GitHub Repositories by Stars',
    'Daily Trending GitHub Repos',
    'Weekly Trending GitHub Repos',
    'Monthly Trending GitHub Repos',
    'GitHub Trend',
    'GitHub Trending',
  ],
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.png" type="image/png+xml" />
      </head>

      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />

          <div className="container">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Maintenance</AlertTitle>
              <AlertDescription>
                This project is heavily under construction and not really production ready. The database is currently in
                maintenance mode and data is incomplete.
              </AlertDescription>
            </Alert>
          </div>

          {children}
        </ThemeProvider>
      </body>

      <Script
        defer
        src="https://umami.coolify.glup3.dev/script.js"
        data-website-id="1a75fdb3-b8fb-4f16-a9e1-602f65918b2f"
      />
    </html>
  )
}
