import type { Metadata } from 'next'
import '@fontsource/overpass'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { InspectionProvider } from '@/contexts/InspectionContext'
import { FeedbackProvider } from '@/contexts/FeedbackContext'

export const metadata: Metadata = {
  title: 'MPVI Scorecard',
  description: 'Multi Point Vehicle Inspection Scorecard System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
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