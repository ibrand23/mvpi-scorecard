'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProfileForm from '@/components/ProfileForm'
import LoginForm from '@/components/LoginForm'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const { user, login, register, isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = useState(true)
  const [loginError, setLoginError] = useState('')

  const handleProfileSubmit = (profile: { name: string; email: string; password: string; role: any }) => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          MVPI Scorecard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Multi Point Vehicle Inspection System
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          {showLogin 
            ? 'Sign in to access your account and manage vehicle inspections.'
            : 'Create your profile to get started with our comprehensive vehicle inspection scoring system.'
          }
        </p>
      </div>
      
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
  );
}