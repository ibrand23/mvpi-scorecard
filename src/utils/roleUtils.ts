import { UserRole } from '@/contexts/AuthContext'

/**
 * Get the appropriate CSS classes for a user role
 * @param role - The user role
 * @returns CSS classes for styling the role badge
 */
export const getRoleColorClasses = (role: UserRole): string => {
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

/**
 * Get the appropriate text color for a user role in dark theme
 * @param role - The user role
 * @returns Text color class
 */
export const getRoleTextColor = (role: UserRole): string => {
  switch (role) {
    case 'Admin':
      return 'text-red-400'
    case 'Advisor':
      return 'text-purple-400'
    case 'Tech':
      return 'text-green-400'
    case 'Customer':
      return 'text-blue-400'
    default:
      return 'text-gray-400'
  }
}

/**
 * Check if a user role has admin privileges
 * @param role - The user role
 * @returns True if the role has admin privileges
 */
export const isAdmin = (role: UserRole): boolean => {
  return role === 'Admin'
}

/**
 * Check if a user role can create inspections
 * @param role - The user role
 * @returns True if the role can create inspections
 */
export const canCreateInspections = (role: UserRole): boolean => {
  return ['Tech', 'Advisor'].includes(role)
}

/**
 * Check if a user role can edit inspections
 * @param role - The user role
 * @returns True if the role can edit inspections
 */
export const canEditInspections = (role: UserRole): boolean => {
  return ['Admin', 'Tech', 'Advisor'].includes(role)
}

/**
 * Check if a user role can manage feedback
 * @param role - The user role
 * @returns True if the role can manage feedback
 */
export const canManageFeedback = (role: UserRole): boolean => {
  return role === 'Admin'
}

/**
 * Check if a user role can manage users
 * @param role - The user role
 * @returns True if the role can manage users
 */
export const canManageUsers = (role: UserRole): boolean => {
  return role === 'Admin'
}

/**
 * Get role permissions as a readable string
 * @param role - The user role
 * @returns Human-readable permission description
 */
export const getRolePermissions = (role: UserRole): string => {
  switch (role) {
    case 'Admin':
      return 'Full system access and management capabilities'
    case 'Advisor':
      return 'Can view and manage inspection reports'
    case 'Tech':
      return 'Can create, view, and manage inspection reports'
    case 'Customer':
      return 'Can view their own inspection reports'
    default:
      return 'Limited access'
  }
}
