'use client'

import { useState, useEffect, useRef } from 'react'
import { InspectionReport } from '@/types/inspection'
import { useAuth } from '@/contexts/AuthContext'
import { useInspection } from '@/contexts/InspectionContext'
import InspectionOverview from './InspectionOverview'
import InspectionIssues from './InspectionIssues'

interface InspectionViewerProps {
  inspection: InspectionReport
  onClose: () => void
  canEdit?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function InspectionViewer({ inspection, onClose, canEdit = false, onEdit, onDelete }: InspectionViewerProps) {
  const { user, logout } = useAuth()
  const { getInspectionById } = useInspection()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  // Get the latest inspection data from context
  const currentInspection = getInspectionById(inspection.id) || inspection

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


  const getHealthScoreColor = (healthScore: number) => {
    if (healthScore >= 90) return 'text-green-600 bg-green-100' // Excellent
    if (healthScore >= 70) return 'text-yellow-600 bg-yellow-100' // Good
    if (healthScore >= 50) return 'text-orange-600 bg-orange-100' // Fair
    return 'text-red-600 bg-red-100' // Poor
  }

  const getItemContainerClasses = (condition: string) => {
    switch (condition) {
      case 'Pass':
        return 'bg-transparent text-white'
      case 'Failed':
        return 'bg-red-50 border border-red-200 text-gray-900'
      case 'Attention Required':
        return 'bg-yellow-50 border border-yellow-200 text-gray-900'
      case 'Not Inspected':
        return 'text-white'
      default:
        return 'bg-gray-50 border border-gray-200 text-gray-900'
    }
  }

  const getIcon = (condition: string) => {
    const base = 'w-5 h-5'
    switch (condition) {
      case 'Pass':
        return (
          <svg className={`${base} text-green-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'Failed':
        return (
          <svg className={`${base} text-red-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'Attention Required':
        return (
          <svg className={`${base} text-yellow-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        )
      case 'Not Inspected':
        return (
          <svg className={`${base} text-gray-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
          </svg>
        )
      default:
        return null
    }
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateVehicleHealthScore = () => {
    // Start with the base score converted to percentage
    let healthScore = (currentInspection.overallScore / 5) * 100

    // Apply penalties
    currentInspection.inspectionItems.forEach(item => {
      if (item.condition === 'Attention Required') {
        healthScore -= 7
      } else if (item.condition === 'Failed') {
        healthScore -= 25
      }
    })

    // Ensure score doesn't go below 0
    return Math.max(0, healthScore)
  }

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete()
    }
    setShowDeleteConfirm(false)
  }

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full z-50" style={{ backgroundColor: '#22211f' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md shadow-sm border-b border-gray-700/50" style={{ backgroundColor: 'rgba(55, 55, 55, 0.6)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-white">Inspection Report</h1>
              <p className="text-sm text-gray-300">
                Created on {formatDate(currentInspection.createdAt)}
                {currentInspection.updatedAt !== currentInspection.createdAt && (
                  <span> • Updated on {formatDate(currentInspection.updatedAt)}</span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {canEdit && onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  title="Edit Report"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={onClose}
                className="text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                style={{ backgroundColor: '#6D6D6D' }}
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* User Profile Dropdown */}
              {user && (
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
                    <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg border border-gray-700/50 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(120, 120, 120, 0.9)' }}>
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
                            {user.role === 'Admin' && (
                              <p>Full system access and management capabilities</p>
                            )}
                            {user.role === 'Advisor' && (
                              <p>Can view and manage inspection reports</p>
                            )}
                            {user.role === 'Tech' && (
                              <p>Can create and update inspection reports</p>
                            )}
                            {user.role === 'Customer' && (
                              <p>Can view your inspection reports</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Logout Button */}
                        <div className="border-t pt-4" style={{ borderColor: '#CECECE' }}>
                          <button
                            onClick={logout}
                            className="w-full flex items-center justify-center px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                            style={{ backgroundColor: '#6D6D6D' }}
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
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative mx-auto p-5  w-11/12 max-w-6xl shadow-lg rounded-2xl backdrop-blur-md mt-4" style={{ backgroundColor: 'rgba(55, 55, 55, 0.6)' }}>


        <div className="mt-6 space-y-8">
          {/* 2x2 Grid: Customer, Vehicle, Health, More */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="backdrop-blur-md rounded-xl p-4 " style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-300">Name:</span>
                  <span className="ml-2 text-white">{currentInspection.customerName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Email:</span>
                  <span className="ml-2 text-white">{currentInspection.customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="backdrop-blur-md rounded-xl p-4 " style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              <h3 className="text-lg font-semibold text-white mb-3">Vehicle Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-300">Vehicle:</span>
                  <span className="ml-2 text-white">
                    {currentInspection.vehicleInfo.year} {currentInspection.vehicleInfo.make} {currentInspection.vehicleInfo.model}
                  </span>
                </div>
                {currentInspection.vehicleInfo.vin && (
                  <div>
                    <span className="font-medium text-gray-300">VIN:</span>
                    <span className="ml-2 text-white font-mono text-sm">{currentInspection.vehicleInfo.vin}</span>
                  </div>
                )}
                {currentInspection.vehicleInfo.mileage && (
                  <div>
                    <span className="font-medium text-gray-300">Mileage:</span>
                    <span className="ml-2 text-white">{currentInspection.vehicleInfo.mileage} miles</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Health */}
            <div className="backdrop-blur-md rounded-xl p-4 " style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              <h3 className="text-lg font-semibold text-white mb-2">Vehicle Health</h3>
              <div className="flex items-center space-x-4">
                <span className={`text-4xl font-medium px-4 py-2 rounded-lg ${getHealthScoreColor(calculateVehicleHealthScore())}`}>
                  {calculateVehicleHealthScore().toFixed(0)}%
                </span>
              </div>
            </div>

            {/* More */}
            <div className="backdrop-blur-md rounded-xl p-4 " style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              <h3 className="text-lg font-semibold text-white mb-3">More</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-300">Inspection Date:</span>
                  <span className="ml-2 text-white">
                    {new Date(currentInspection.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Created By:</span>
                  <span className="ml-2 text-white">{currentInspection.createdBy}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Total Items:</span>
                  <span className="ml-2 text-white">{currentInspection.inspectionItems.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Summary */}
          <div className="backdrop-blur-md rounded-lg p-4" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
            <InspectionOverview inspectionItems={currentInspection.inspectionItems} />
          </div>

              {/* Inspection Items */}
          <div>
            <div className="columns-1 lg:columns-3 gap-4 space-y-4" style={{ columnFill: 'auto' }}>
              {(() => {
                const categories = Object.entries(
                  currentInspection.inspectionItems.reduce((acc, item) => {
                    if (!acc[item.category]) {
                      acc[item.category] = []
                    }
                    acc[item.category].push(item)
                    return acc
                  }, {} as Record<string, typeof currentInspection.inspectionItems>)
                ).filter(([category]) => category !== 'Visible Under Hood Components')

                // Define the specific order for categories
                const categoryOrder = [
                  'OnStar Diagnostics',
                  'Engine',
                  'Lighting',
                  'Wipers & Windshield',
                  'Battery',
                  'Under Hood Fluid Levels/Systems',
                  'Tires',
                  'Brakes',
                  'Visible Under Hood Components'
                ]
                
                // Sort categories according to the specified order
                const sortedCategories = categoryOrder
                  .map(categoryName => categories.find(([category]) => category === categoryName))
                  .filter(Boolean) as [string, typeof currentInspection.inspectionItems][]
                
                // Render first 3 categories for top alignment
                const topCategories = sortedCategories.slice(0, 3)
                const remainingCategories = sortedCategories.slice(3)

                return (
                  <>
                    {topCategories.map(([category, items]) => (
                      <div key={category} className="rounded-xl p-4 backdrop-blur-md break-inside-avoid mb-2" style={{ backgroundColor: 'transparent' }}>
                        <h4 className="text-sm font-bold text-white mb-3 pb-2 uppercase tracking-wide" style={{ borderBottom: '1px solid #505050' }}>{category}</h4>
                        <div className="space-y-2">
                          {items.map((item) => {
                            const getDeductionPercentage = (condition: string) => {
                              if (condition === 'Failed') return '-25%'
                              if (condition === 'Attention Required') return '-7%'
                              return null
                            }
                            
                            const deduction = getDeductionPercentage(item.condition)
                            
                            return (
                              <div
                                key={item.id}
                                className={`flex items-center justify-between p-2 rounded ${getItemContainerClasses(item.condition)}`}
                                style={item.condition === 'Not Inspected' ? { backgroundColor: '#505050' } : {}}
                              >
                                <div className="flex items-center space-x-2">
                                  <div>
                                    {getIcon(item.condition)}
                                  </div>
                                  <span className="text-xs font-medium">{item.item}</span>
                                </div>
                                {deduction && (
                                  <span className="text-xs font-bold text-red-600">
                                    {deduction}
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                    
                    {/* Render remaining categories */}
                    {remainingCategories.map(([category, items]) => (
                      <div key={category} className="rounded-xl p-4 backdrop-blur-md break-inside-avoid mb-2" style={{ backgroundColor: 'transparent' }}>
                        <h4 className="text-sm font-bold text-white mb-3 pb-2 uppercase tracking-wide" style={{ borderBottom: '1px solid #505050' }}>{category}</h4>
                        <div className="space-y-2">
                          {items.map((item) => {
                            const getDeductionPercentage = (condition: string) => {
                              if (condition === 'Failed') return '-25%'
                              if (condition === 'Attention Required') return '-7%'
                              return null
                            }
                            
                            const deduction = getDeductionPercentage(item.condition)
                            
                            return (
                              <div
                                key={item.id}
                                className={`flex items-center justify-between p-2 rounded ${getItemContainerClasses(item.condition)}`}
                                style={item.condition === 'Not Inspected' ? { backgroundColor: '#505050' } : {}}
                              >
                                <div className="flex items-center space-x-2">
                                  <div>
                                    {getIcon(item.condition)}
                                  </div>
                                  <span className="text-xs font-medium">{item.item}</span>
                                </div>
                                {deduction && (
                                  <span className="text-xs font-bold text-red-600">
                                    {deduction}
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                    
                    {/* Render Visible Under Hood Components last */}
                    {(() => {
                      const hoodItems = currentInspection.inspectionItems.filter(item => item.category === 'Visible Under Hood Components')
                      if (hoodItems.length === 0) return null
                      
                      return (
                        <div className="rounded-xl p-4 backdrop-blur-md break-inside-avoid mb-2" style={{ backgroundColor: 'transparent' }}>
                          <h4 className="text-sm font-bold text-white mb-3 pb-2 uppercase tracking-wide" style={{ borderBottom: '1px solid #505050' }}>Visible Under Hood Components</h4>
                          <div className="space-y-2">
                            {hoodItems.map((item) => {
                              const getDeductionPercentage = (condition: string) => {
                                if (condition === 'Failed') return '-25%'
                                if (condition === 'Attention Required') return '-7%'
                                return null
                              }
                              
                              const deduction = getDeductionPercentage(item.condition)
                              
                              return (
                                <div
                                  key={item.id}
                                  className={`flex items-center justify-between p-2 rounded ${getItemContainerClasses(item.condition)}`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <div>
                                      {getIcon(item.condition)}
                                    </div>
                                    <span className="text-xs font-medium">{item.item}</span>
                                  </div>
                                  {deduction && (
                                    <span className="text-xs font-bold text-red-600">
                                      {deduction}
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })()}
                  </>
                )
              })()}
            </div>
          </div>

          {/* Inspection Issues */}
          <InspectionIssues inspectionItems={currentInspection.inspectionItems} />

          {/* Additional Notes */}
          {currentInspection.notes && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Additional Notes</h3>
              <div className="backdrop-blur-md rounded-xl p-4 " style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
                <p className="text-gray-300 whitespace-pre-wrap">{currentInspection.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-70">
          <div className="backdrop-blur-md rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" style={{ backgroundColor: 'rgba(55, 55, 55, 0.6)' }}>
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-white">Delete Inspection Report</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-300">
                Are you sure you want to delete this inspection report? This action cannot be undone.
              </p>
              <p className="text-sm text-white mt-2 font-medium">
                Report: {currentInspection.customerName} - {currentInspection.vehicleInfo.year} {currentInspection.vehicleInfo.make} {currentInspection.vehicleInfo.model}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
