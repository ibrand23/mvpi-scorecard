'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()

  if (!user) return null

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">MVPI Scorecard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {user.name}!</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Information</h3>
              <div className="space-y-2">
                <p className="text-gray-900"><span className="font-medium">Name:</span> {user.name}</p>
                <p className="text-gray-900"><span className="font-medium">Email:</span> {user.email}</p>
                <p className="text-gray-900"><span className="font-medium">Role:</span> {user.role}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Permissions</h3>
              <div className="space-y-2">
                {user.role === 'Admin' && (
                  <p className="text-sm text-gray-600">Full system access and management capabilities</p>
                )}
                {user.role === 'Advisor' && (
                  <p className="text-sm text-gray-600">Can view and manage inspection reports</p>
                )}
                {user.role === 'Tech' && (
                  <p className="text-sm text-gray-600">Can create and update inspection reports</p>
                )}
                {user.role === 'Customer' && (
                  <p className="text-sm text-gray-600">Can view your inspection reports</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              This is your personalized dashboard. More features will be added based on your role.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
