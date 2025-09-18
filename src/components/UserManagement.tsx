'use client'

import { useAuth } from '@/contexts/AuthContext'

type UserRole = 'Admin' | 'Tech' | 'Advisor' | 'Customer'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export default function UserManagement() {
  const { user: currentUser } = useAuth()

  // Get all users from localStorage
  const getAllUsers = (): User[] => {
    if (typeof window === 'undefined') return []
    
    const users: User[] = []
    
    // Get users from AuthContext storage
    const authData = localStorage.getItem('mvpi-auth')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        if (parsed.users) {
          users.push(...parsed.users)
        }
      } catch (error) {
        console.error('Error parsing auth data:', error)
      }
    }
    
    return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const users = getAllUsers()

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800'
      case 'Tech':
        return 'bg-blue-100 text-blue-800'
      case 'Advisor':
        return 'bg-green-100 text-green-800'
      case 'Customer':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <p className="text-sm text-gray-600 mt-1">Manage all users in the system</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {user.id === currentUser?.id && (
                            <span className="ml-2 text-xs text-blue-600 font-normal">(You)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {users.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Total users: {users.length}</span>
            <div className="flex space-x-4">
              <span>Admins: {users.filter(u => u.role === 'Admin').length}</span>
              <span>Techs: {users.filter(u => u.role === 'Tech').length}</span>
              <span>Advisors: {users.filter(u => u.role === 'Advisor').length}</span>
              <span>Customers: {users.filter(u => u.role === 'Customer').length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
