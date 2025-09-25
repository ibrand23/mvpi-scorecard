'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'Customer' | 'Tech' | 'Advisor' | 'Admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  password: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  register: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user data on mount (client-side only)
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('mpvi-user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [])

  const register = (userData: User) => {
    // Store user data (in a real app, this would be sent to a server)
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('mpvi-users') || '[]')
      const userWithTimestamp = {
        ...userData,
        createdAt: userData.createdAt || new Date().toISOString()
      }
      users.push(userWithTimestamp)
      localStorage.setItem('mpvi-users', JSON.stringify(users))
      
      // Auto-login after registration
      setUser(userWithTimestamp)
      localStorage.setItem('mpvi-user', JSON.stringify(userWithTimestamp))
    }
  }

  const login = (email: string, password: string): boolean => {
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('mpvi-users') || '[]')
      const foundUser = users.find((u: User) => u.email === email && u.password === password)
      
      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem('mvpi-user', JSON.stringify(foundUser))
        return true
      }
    }
    return false
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mpvi-user')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
