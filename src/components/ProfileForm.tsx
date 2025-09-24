'use client'

import { useState } from 'react'
import { UserRole } from '@/contexts/AuthContext'

interface ProfileFormProps {
  onSubmit: (profile: { name: string; email: string; password: string; role: UserRole }) => void
  onSwitchToLogin: () => void
}

export default function ProfileForm({ onSubmit, onSwitchToLogin }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Customer' as UserRole
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.password) {
      onSubmit(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-md w-full mx-4 " style={{ backgroundColor: '#1E1E1E' }}>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Create Your Profile
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800/50 placeholder-gray-400"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800/50 placeholder-gray-400"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <input
            type="text"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800/50 placeholder-gray-400"
            placeholder="Create a password"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
            Role
          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-lg focus:outline-none text-white bg-gray-800/50 appearance-none"
              style={{ backgroundImage: 'none' }}
            >
              <option value="Customer">Customer</option>
              <option value="Tech">Tech</option>
              <option value="Advisor">Advisor</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Create Profile
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={onSwitchToLogin}
          className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}
