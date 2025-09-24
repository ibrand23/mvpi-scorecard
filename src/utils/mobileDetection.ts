'use client'

/**
 * Detects if the app is running on a mobile browser
 * @returns boolean indicating if the device is mobile
 */
export function isMobileBrowser(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  // Check for mobile device indicators
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  const isMobileUserAgent = mobileRegex.test(userAgent)
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Check screen size (additional check for tablets in desktop mode)
  const isSmallScreen = window.innerWidth <= 768
  
  return isMobileUserAgent || (isTouchDevice && isSmallScreen)
}

/**
 * Hook to detect mobile browser with state updates
 * @returns boolean indicating if the device is mobile
 */
export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileBrowser())
    }
    
    // Initial check
    checkMobile()
    
    // Listen for resize events to handle orientation changes
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  return isMobile
}

// Import React hooks
import { useState, useEffect } from 'react'
