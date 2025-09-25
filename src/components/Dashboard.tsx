'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useInspection } from '@/contexts/InspectionContext'
import { InspectionReport } from '@/types/inspection'
import InspectionList from './InspectionList'
import InspectionForm from './InspectionForm'
import InspectionViewer from './InspectionViewer'
import FeedbackIcon from './FeedbackIcon'
import DashboardGraphs from './DashboardGraphs'
import UserMenu from './UserMenu'
import { useMobileDetection } from '@/utils/mobileDetection'
import { canCreateInspections, canEditInspections, getRoleColorClasses } from '@/utils/roleUtils'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { deleteInspection } = useInspection()
  const isMobile = useMobileDetection()
  
  const [currentView, setCurrentView] = useState<'inspections' | 'create-inspection' | 'edit-inspection' | 'view-inspection'>('inspections')
  const [selectedInspection, setSelectedInspection] = useState<InspectionReport | null>(null)

  if (!user) return null

  const canCreate = canCreateInspections(user.role)
  const canEdit = canEditInspections(user.role)


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


  const handleDeleteInspectionFromForm = () => {
    if (selectedInspection) {
      if (window.confirm('Are you sure you want to delete this inspection report?')) {
        deleteInspection(selectedInspection.id)
        setCurrentView('inspections')
      }
    }
  }

  const handleSaveInspection = () => {
    // If we were editing an existing inspection, go back to viewing it
    if (selectedInspection) {
      setCurrentView('view-inspection')
    } else {
      // If we were creating a new inspection, go back to the list
      setCurrentView('inspections')
      setSelectedInspection(null)
    }
  }

  const handleCancelInspection = () => {
    // If we were editing an existing inspection, go back to viewing it
    if (selectedInspection) {
      setCurrentView('view-inspection')
    } else {
      // If we were creating a new inspection, go back to the list
      setCurrentView('inspections')
      setSelectedInspection(null)
    }
  }

  const handleCloseViewer = () => {
    setCurrentView('inspections')
    setSelectedInspection(null)
  }


  return (
    <div className={`min-h-screen ${isMobile ? 'mobile-stabilized' : ''}`} style={{ backgroundColor: '#090909' }}>
      <FeedbackIcon />
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md shadow-sm border-b border-gray-700/50 ${isMobile ? 'mobile-stabilized' : ''}`} style={{ backgroundColor: '#1E1E1E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentView('inspections')}
                className="text-2xl font-bold text-white hover:text-gray-200 transition-colors cursor-pointer"
              >
                MPVI Scorecard
              </button>
              {canCreate && currentView !== 'create-inspection' && currentView !== 'edit-inspection' && (
                <button
                  onClick={handleCreateInspection}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium shadow-sm"
                  style={{ zIndex: 10 }}
                >
                  Create Report
                </button>
              )}
              {currentView !== 'inspections' && currentView !== 'create-inspection' && currentView !== 'edit-inspection' && (
                <button
                  onClick={() => setCurrentView('inspections')}
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                >
                  {user.role === 'Customer' ? 'My Reports' : 'Inspection Reports'}
                </button>
              )}
              {user.role === 'Admin' && (
                <>
                  <a
                    href="/admin/inspections"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                  >
                    Inspection Reports
                  </a>
                  <a
                    href="/admin/feedback"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                  >
                    Feedback Management
                  </a>
                  <a
                    href="/admin/users"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md hover:bg-white/20 transition-colors font-medium"
                  >
                    User Management
                  </a>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* Header Action Buttons */}
              {currentView === 'create-inspection' && (
                <div className="flex space-x-2">
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
                  <button
                    onClick={handleCancelInspection}
                    className="px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    style={{ backgroundColor: '#6D6D6D' }}
                    title="Cancel"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {currentView === 'edit-inspection' && (
                <div className="flex space-x-2">
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
                  <button
                    onClick={handleCancelInspection}
                    className="px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    style={{ backgroundColor: '#6D6D6D' }}
                    title="Cancel"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* User Profile Dropdown */}
              <UserMenu user={user} onLogout={logout} />
            </div>
          </div>
        </div>
        {/* Gradient line */}
        <div 
          className="h-0.5 w-full"
          style={{
            background: 'linear-gradient(to right, #388BFF 0%, #0956FF 33.33%, #0033BA 66.66%, #0956FF 100%)'
          }}
        ></div>
      </header>


      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isMobile ? 'mobile-stabilized' : ''}`}>
        {currentView === 'inspections' && (
          <div className="space-y-6">
            {user.role === 'Admin' && <DashboardGraphs />}
            {user.role !== 'Admin' && (
              <InspectionList
                onViewInspection={handleViewInspection}
              />
            )}
          </div>
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
                canEdit={canEdit}
                onEdit={() => handleEditInspection(selectedInspection)}
                onNavigateToDashboard={() => setCurrentView('inspections')}
              />
            )}

      </main>
    </div>
  )
}
