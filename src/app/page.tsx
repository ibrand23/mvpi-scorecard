'use client'

import { useState } from 'react'
import { useAuth, UserRole } from '@/contexts/AuthContext'
import ProfileForm from '@/components/ProfileForm'
import LoginForm from '@/components/LoginForm'
import Dashboard from '@/components/Dashboard'
import FeedbackIcon from '@/components/FeedbackIcon'
import { useMobileDetection } from '@/utils/mobileDetection'

export default function Home() {
  const { login, register, isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = useState(true)
  const [loginError, setLoginError] = useState('')
  const isMobile = useMobileDetection()

  const handleProfileSubmit = (profile: { name: string; email: string; password: string; role: UserRole }) => {
    const userData = {
      id: Date.now().toString(), // Simple ID generation
      name: profile.name,
      email: profile.email,
      password: profile.password,
      role: profile.role
    }
    register(userData)
  }

  const handleLogin = (email: string, password: string) => {
    const success = login(email, password)
    if (!success) {
      setLoginError('Invalid email or password')
    } else {
      setLoginError('')
    }
  }

  if (isAuthenticated) {
    return <Dashboard />
  }

  return (
    <div className={`min-h-screen ${isMobile ? 'mobile-stabilized' : ''}`} style={{ backgroundColor: '#090909' }}>
      <FeedbackIcon />
      <div className={`flex flex-col items-center justify-center min-h-screen py-8 ${isMobile ? 'mobile-stabilized' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            MPVI Scorecard
          </h1>
          <p className="text-xl text-white mb-8">
            Multi Point Vehicle Inspection System
          </p>
          <p className="text-lg text-white max-w-2xl mx-auto">
            {showLogin 
              ? 'Sign in to access your account and manage vehicle inspections.'
              : 'Create your profile to get started with our comprehensive vehicle inspection scoring system.'
            }
          </p>
        </div>
        
        <div className="w-full max-w-md">
          {showLogin ? (
            <LoginForm 
              onSubmit={handleLogin} 
              onSwitchToRegister={() => setShowLogin(false)}
              error={loginError}
            />
          ) : (
            <ProfileForm 
              onSubmit={handleProfileSubmit} 
              onSwitchToLogin={() => setShowLogin(true)}
            />
          )}
        </div>

        {/* Test Users Section */}
        <div className="mt-12 w-full max-w-4xl">
          <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: '#1E1E1E' }}>
            <h2 className="text-2xl font-bold text-white mb-4 text-center font-sans">Test Users</h2>
            <p className="text-gray-300 text-center mb-6 font-sans">
              Use these test accounts to explore different user roles and permissions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Admin User */}
              <div className="border rounded-lg p-4" style={{ backgroundColor: 'rgba(255, 0, 17, 0.1)', borderColor: '#FF0011' }}>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#FF0011' }}></div>
                  <h3 className="font-semibold font-sans" style={{ color: '#FF0011' }}>Admin</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-white font-mono">Admin1@test.com</div>
                  <div className="text-white font-mono">P@55word</div>
                  <div className="text-xs text-gray-300 mt-2 font-sans">
                    Full system access and management capabilities
                  </div>
                </div>
              </div>

              {/* Customer User */}
              <div className="border rounded-lg p-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6' }}>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-blue-400 font-sans">Customer</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-white font-mono">Customer1@test.com</div>
                  <div className="text-white font-mono">P@55word</div>
                  <div className="text-xs text-gray-300 mt-2 font-sans">
                    Can view their own inspection reports
                  </div>
                </div>
              </div>

              {/* Tech User */}
              <div className="border rounded-lg p-4" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22C55E' }}>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-green-400 font-sans">Tech</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-white font-mono">Tech1@test.com</div>
                  <div className="text-white font-mono">P@55word</div>
                  <div className="text-xs text-gray-300 mt-2 font-sans">
                    Can create and update inspection reports
                  </div>
                </div>
              </div>

              {/* Advisor User */}
              <div className="border rounded-lg p-4" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: '#A855F7' }}>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-purple-400 font-sans">Advisor</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-white font-mono">Advisor1@test.com</div>
                  <div className="text-white font-mono">P@55word</div>
                  <div className="text-xs text-gray-300 mt-2 font-sans">
                    Can view and manage inspection reports
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}