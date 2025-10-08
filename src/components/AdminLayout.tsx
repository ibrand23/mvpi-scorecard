'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useMobileDetection } from '@/utils/mobileDetection'
import UserMenu from './UserMenu'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const isMobile = useMobileDetection()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)



  if (!user || user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#090909' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isMobile ? 'mobile-stabilized' : ''}`} style={{ backgroundColor: '#090909' }}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md shadow-sm border-b border-gray-700/50 ${isMobile ? 'mobile-stabilized' : ''}`} style={{ backgroundColor: '#1E1E1E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-2xl font-bold text-white hover:text-gray-200 transition-colors cursor-pointer"
              >
                MPVI Scorecard
              </Link>
              <nav className="hidden md:flex space-x-4">
                <a
                  href="/admin/inspections"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                >
                  Inspection Reports
                </a>
                <a
                  href="/admin/feedback"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                >
                  Feedback Management
                </a>
                <a
                  href="/admin/users"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                >
                  User Management
                </a>
                <a
                  href="/admin/weighting"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                >
                  Weighting
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white hover:text-gray-200 p-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* User Profile Dropdown */}
              <UserMenu user={user} onLogout={logout} />
            </div>
          </div>
        </div>
        {/* Gradient line */}
        <div 
          className="h-0.5 w-full"
          style={{
            background: 'linear-gradient(to right, #388BFF 0%, #0956FF 33.33%, #0033BA 66.66%, #0956FF 100%)'
          }}
        ></div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-600" style={{ backgroundColor: 'rgba(30, 30, 30, 0.95)' }}>
            <div className="px-4 py-2 space-y-1">
              <a
                href="/admin/inspections"
                className="block text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inspection Reports
              </a>
              <a
                href="/admin/feedback"
                className="block text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Feedback Management
              </a>
              <a
                href="/admin/users"
                className="block text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                User Management
              </a>
              <a
                href="/admin/weighting"
                className="block text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Weighting
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isMobile ? 'mobile-stabilized' : ''}`}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-gray-300 mt-2">{subtitle}</p>
          )}
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  )
}
