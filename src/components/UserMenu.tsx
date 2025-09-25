'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth, User } from '@/contexts/AuthContext'
import { getRoleColorClasses, getRolePermissions } from '@/utils/roleUtils'

interface UserMenuProps {
  user: User
  onLogout: () => void
  className?: string
}

export default function UserMenu({ user, onLogout, className = '' }: UserMenuProps) {
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

  return (
    <div className={`relative ${className}`} ref={userMenuRef}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-3 text-right hover:bg-white/20 rounded-md px-3 py-2 transition-colors"
      >
        <div>
          <p className="text-sm font-medium text-white">{user.name}</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColorClasses(user.role)}`}>
            {user.role}
          </span>
        </div>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-2xl border border-gray-700/50 z-50" style={{ backgroundColor: '#505050', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
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
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColorClasses(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4" style={{ borderColor: '#CECECE' }}>
              <h4 className="text-sm font-semibold text-white mb-2">Role Permissions</h4>
              <div className="text-sm text-gray-300">
                <p>{getRolePermissions(user.role)}</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <div className="mt-6 pt-4" style={{ borderColor: '#CECECE' }}>
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  onLogout()
                }}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
                style={{ backgroundColor: '#373737' }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#4A4A4A'}
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
  )
}
