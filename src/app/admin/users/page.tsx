'use client'

import { useState, useEffect } from 'react'
import { useAuth, User, UserRole } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Load users from localStorage
  useEffect(() => {
    const loadUsers = () => {
      if (typeof window !== 'undefined') {
        const usersData = localStorage.getItem('mpvi-users')
        if (usersData) {
          try {
            const parsedUsers = JSON.parse(usersData)
            setUsers(parsedUsers.sort((a: User, b: User) => {
              // Sort by creation date if available, otherwise by name
              if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              }
              return a.name.localeCompare(b.name)
            }))
          } catch (error) {
            console.error('Error parsing users data:', error)
          }
        }
      }
    }
    loadUsers()
  }, [])

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'All' || user.role === filterRole
    return matchesSearch && matchesRole
  })

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account!')
      return
    }

    // Check if user has created any inspection reports
    const userInspections = getInspectionsByUser(userId)
    if (userInspections.length > 0) {
      const confirmMessage = `This user has created ${userInspections.length} inspection report(s). Deleting them will mark their name as "(removed)" on those reports. Are you sure you want to continue?`
      if (!window.confirm(confirmMessage)) {
        return
      }
    }

    // Delete user from localStorage
    const updatedUsers = users.filter(user => user.id !== userId)
    setUsers(updatedUsers)
    if (typeof window !== 'undefined') {
      localStorage.setItem('mpvi-users', JSON.stringify(updatedUsers))
    }

    // Update inspection reports to mark createdBy as removed
    updateInspectionReportsForDeletedUser(userId)

    setShowDeleteConfirm(null)
  }

  const getInspectionsByUser = (userId: string) => {
    if (typeof window === 'undefined') return []
    const inspectionsData = localStorage.getItem('mpvi-inspections')
    if (inspectionsData) {
      try {
        const inspections = JSON.parse(inspectionsData)
        return inspections.filter((inspection: any) => inspection.createdBy === userId)
      } catch (error) {
        console.error('Error parsing inspections data:', error)
      }
    }
    return []
  }

  const updateInspectionReportsForDeletedUser = (deletedUserId: string) => {
    if (typeof window === 'undefined') return
    
    const inspectionsData = localStorage.getItem('mpvi-inspections')
    if (inspectionsData) {
      try {
        const inspections = JSON.parse(inspectionsData)
        const updatedInspections = inspections.map((inspection: any) => {
          if (inspection.createdBy === deletedUserId) {
            return {
              ...inspection,
              createdBy: `${deletedUserId} (removed)`
            }
          }
          return inspection
        })
        localStorage.setItem('mpvi-inspections', JSON.stringify(updatedInspections))
      } catch (error) {
        console.error('Error updating inspection reports:', error)
      }
    }
  }

  const handleUserUpdate = (updatedUser: User) => {
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    )
    setUsers(updatedUsers)
    if (typeof window !== 'undefined') {
      localStorage.setItem('mpvi-users', JSON.stringify(updatedUsers))
    }
    setShowEditModal(false)
    setSelectedUser(null)
  }

  return (
    <AdminLayout title="User Management" subtitle="Manage all users in the system">
      <div className="backdrop-blur-md rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
        {/* Search and Filter Controls */}
        <div className="px-6 py-4 border-b border-gray-600">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserRole | 'All')}
                className="px-3 py-2 bg-white/10 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Tech">Tech</option>
                <option value="Advisor">Advisor</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: 'rgba(100, 100, 100, 0.8)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    {searchTerm || filterRole !== 'All' ? 'No users found matching your criteria' : 'No users found'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/10">
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
                          <div className="text-sm font-medium text-white">
                            {user.name}
                            {user.id === currentUser?.id && (
                              <span className="ml-2 text-xs text-blue-400 font-normal">(You)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-300">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Edit
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => setShowDeleteConfirm(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-3 backdrop-blur-md border-t border-gray-600" style={{ backgroundColor: 'rgba(100, 100, 100, 0.3)' }}>
            <div className="flex justify-between items-center text-sm text-gray-300">
              <span>Showing {filteredUsers.length} of {users.length} users</span>
              <div className="flex space-x-4">
                <span>Admins: {users.filter(u => u.role === 'Admin').length}</span>
                <span>Techs: {users.filter(u => u.role === 'Tech').length}</span>
                <span>Advisors: {users.filter(u => u.role === 'Advisor').length}</span>
                <span>Customers: {users.filter(u => u.role === 'Customer').length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="backdrop-blur-md rounded-lg shadow-xl max-w-md w-full mx-4" style={{ backgroundColor: 'rgba(75, 75, 75, 0.9)' }}>
              <div className="px-6 py-4 border-b border-gray-600">
                <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-300">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-600 flex justify-end space-x-3" style={{ backgroundColor: 'rgba(100, 100, 100, 0.3)' }}>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <UserEditModal
            user={selectedUser}
            onSave={handleUserUpdate}
            onCancel={() => {
              setShowEditModal(false)
              setSelectedUser(null)
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}

// User Edit Modal Component
interface UserEditModalProps {
  user: User
  onSave: (user: User) => void
  onCancel: () => void
}

function UserEditModal({ user, onSave, onCancel }: UserEditModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password || user.password // Keep existing password if not changed
    }
    
    onSave(updatedUser)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="backdrop-blur-md rounded-lg shadow-xl max-w-md w-full mx-4" style={{ backgroundColor: 'rgba(75, 75, 75, 0.9)' }}>
        <div className="px-6 py-4 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Edit User</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/10 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Customer">Customer</option>
                <option value="Tech">Tech</option>
                <option value="Advisor">Advisor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/10 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </form>
        
        <div className="px-6 py-4 border-t border-gray-600 flex justify-end space-x-3" style={{ backgroundColor: 'rgba(100, 100, 100, 0.3)' }}>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
