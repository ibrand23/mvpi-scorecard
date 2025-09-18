import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { InspectionProvider } from '@/contexts/InspectionContext'
import { FeedbackProvider } from '@/contexts/FeedbackContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MVPI Scorecard',
  description: 'Multi Point Vehicle Inspection Scorecard System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <InspectionProvider>
            <FeedbackProvider>
              {children}
            </FeedbackProvider>
          </InspectionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}