'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useInspection } from '@/contexts/InspectionContext'
import { InspectionReport } from '@/types/inspection'
import InspectionList from './InspectionList'
import InspectionForm from './InspectionForm'
import InspectionViewer from './InspectionViewer'
import FeedbackIcon from './FeedbackIcon'
import AdminFeedbackList from './AdminFeedbackList'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { deleteInspection } = useInspection()
  
  const [currentView, setCurrentView] = useState<'inspections' | 'create-inspection' | 'edit-inspection' | 'view-inspection' | 'feedback-management'>('inspections')
  const [selectedInspection, setSelectedInspection] = useState<InspectionReport | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showFeedbackManagement, setShowFeedbackManagement] = useState(false)
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

  if (!user) return null

  const canCreateInspections = user.role === 'Admin' || user.role === 'Tech' || user.role === 'Advisor'
  const canEditInspections = user.role === 'Admin' || user.role === 'Tech' || user.role === 'Advisor'
  const canManageFeedback = user.role === 'Admin'

  const handleCreateInspection = () => {
    setSelectedInspection(null)
    setCurrentView('create-inspection')
  }

  const handleEditInspection = (inspection: InspectionReport) => {
    setSelectedInspection(inspection)
    setCurrentView('edit-inspection')
  }

  const handleViewInspection = (inspection: InspectionReport) => {
    setSelectedInspection(inspection)
    setCurrentView('view-inspection')
  }

  const handleDeleteInspection = (inspectionId: string) => {
    if (window.confirm('Are you sure you want to delete this inspection report?')) {
      deleteInspection(inspectionId)
    }
  }

  const handleDeleteInspectionFromForm = () => {
    if (selectedInspection) {
      if (window.confirm('Are you sure you want to delete this inspection report?')) {
        deleteInspection(selectedInspection.id)
        setCurrentView('inspections')
      }
    }
  }

  const handleSaveInspection = () => {
    setCurrentView('inspections')
    setSelectedInspection(null)
  }

  const handleCancelInspection = () => {
    setCurrentView('inspections')
    setSelectedInspection(null)
  }

  const handleCloseViewer = () => {
    setCurrentView('inspections')
    setSelectedInspection(null)
  }

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
      <FeedbackIcon />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900">MVPI Scorecard</h1>
              {canCreateInspections && currentView !== 'create-inspection' && currentView !== 'edit-inspection' && (
                <button
                  onClick={handleCreateInspection}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium shadow-sm"
                >
                  Create Report
                </button>
              )}
              {currentView !== 'inspections' && (
                <button
                  onClick={() => setCurrentView('inspections')}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
                >
                  {user.role === 'Customer' ? 'My Reports' : 'Inspection Reports'}
                </button>
              )}
              {canManageFeedback && (
                <button
                  onClick={() => setShowFeedbackManagement(true)}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
                >
                  Feedback Management
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* Header Action Buttons */}
              {currentView === 'create-inspection' && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelInspection}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Trigger form submission - we'll need to access the form
                      const form = document.querySelector('form')
                      if (form) {
                        form.requestSubmit()
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create Report
                  </button>
                </div>
              )}
              {currentView === 'edit-inspection' && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelInspection}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Trigger form submission - we'll need to access the form
                      const form = document.querySelector('form')
                      if (form) {
                        form.requestSubmit()
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Update Report
                  </button>
                </div>
              )}
              
              {/* User Profile Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-right hover:bg-gray-50 rounded-md px-3 py-2 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                      <div className="space-y-3 mb-6">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Name:</span>
                          <span className="ml-2 text-gray-900">{user.name}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Email:</span>
                          <span className="ml-2 text-gray-900">{user.email}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Role:</span>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Role Permissions</h4>
                        <div className="text-sm text-gray-800">
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
                    </div>
                  </div>
                )}
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
        {currentView === 'inspections' && (
          <InspectionList
            onViewInspection={handleViewInspection}
          />
        )}

        {currentView === 'create-inspection' && (
          <InspectionForm
            onSave={handleSaveInspection}
            onCancel={handleCancelInspection}
          />
        )}

        {currentView === 'edit-inspection' && selectedInspection && (
          <InspectionForm
            inspectionId={selectedInspection.id}
            onSave={handleSaveInspection}
            onCancel={handleCancelInspection}
            onDelete={handleDeleteInspectionFromForm}
          />
        )}

        {currentView === 'view-inspection' && selectedInspection && (
          <InspectionViewer
            inspection={selectedInspection}
            onClose={handleCloseViewer}
            canEdit={canEditInspections}
            onEdit={() => handleEditInspection(selectedInspection)}
          />
        )}

        {showFeedbackManagement && (
          <AdminFeedbackList
            onClose={() => setShowFeedbackManagement(false)}
          />
        )}
      </main>
    </div>
  )
}
