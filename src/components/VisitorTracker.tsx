'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { visitorTracker } from '@/utils/visitorTracking'

export default function VisitorTracker() {
  const { user } = useAuth()

  useEffect(() => {
    // Track the visit when the component mounts
    visitorTracker.trackVisit(user?.id)
  }, [user?.id])

  // This component doesn't render anything
  return null
}
