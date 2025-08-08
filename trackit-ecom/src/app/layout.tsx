import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrackIt Ecom - Automated Expense & Profit Tracking',
  description: 'An automated expense and profit tracking app for e-commerce business owners. Integrates with Facebook, Instagram, and WhatsApp to simplify financial management.',
  keywords: ['e-commerce', 'expense tracking', 'profit tracking', 'automation', 'facebook ads', 'instagram', 'whatsapp'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}