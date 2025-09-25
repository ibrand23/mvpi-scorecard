'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useMobileDetection } from '@/utils/mobileDetection'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const isMobile = useMobileDetection()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'text-white'
      case 'Advisor':
        return 'bg-purple-100 text-purple-800'
      case 'Tech':
        return 'bg-green-100 text-green-800'
      case 'Customer':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Profile Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-right hover:bg-white/20 rounded-md px-3 py-2 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg border border-gray-700/50 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(75, 75, 75, 0.9)' }}>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                      <div className="space-y-3 mb-6">
                        <div>
                          <span className="text-sm font-medium text-gray-300">Name:</span>
                          <span className="ml-2 text-white">{user.name}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-300">Email:</span>
                          <span className="ml-2 text-white">{user.email}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-300">Role:</span>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        </div>
                        
                        <div className="border-t pt-4" style={{ borderColor: '#CECECE' }}>
                          <h4 className="text-sm font-semibold text-white mb-2">Role Permissions</h4>
                        <div className="text-sm text-gray-300">
                          <p>Full system access and management capabilities</p>
                        </div>
                        </div>
                        
                        {/* Logout Button */}
                        <div className="border-t pt-4" style={{ borderColor: '#CECECE' }}>
                        <button
                          onClick={logout}
                          className="w-full flex items-center justify-center px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors hover:opacity-90"
                          style={{ backgroundColor: '#373737' }}
                          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2A2A2A'}
                          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#373737'}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
