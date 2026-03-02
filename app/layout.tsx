import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { TestModeProvider } from '@/hooks/use-test-mode'

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'InvestHub - Premium Digital Banking',
  description: 'Your premium digital banking and investment partner.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased selection:bg-primary/30 min-h-screen bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TestModeProvider>
            {children}
            <Analytics />
          </TestModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
