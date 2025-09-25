'use client'

import { useState } from 'react'
import { useInspection } from '@/contexts/InspectionContext'
import { useAuth } from '@/contexts/AuthContext'
import { InspectionReport } from '@/types/inspection'
import AdminLayout from '@/components/AdminLayout'
import InspectionViewer from '@/components/InspectionViewer'
import { useMobileDetection } from '@/utils/mobileDetection'

export default function AdminInspectionsPage() {
  const { getInspectionsByRole } = useInspection()
  const { user } = useAuth()
  const isMobile = useMobileDetection()
  const [selectedInspection, setSelectedInspection] = useState<InspectionReport | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'createdAt' | 'customerName' | 'createdBy' | 'overallScore'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  if (!user) return null

  const inspections = getInspectionsByRole(user.role, user.email)

  // Filter inspections based on search term
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = 
      inspection.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.vehicleInfo.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.vehicleInfo.model.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  // Get user name by ID
  const getUserName = (userId: string): string => {
    if (typeof window !== 'undefined') {
      // Check if user ID contains "(removed)" indicating deleted user
      if (userId.includes('(removed)')) {
        return userId // Return the full string with "(removed)"
      }
      
      const users = JSON.parse(localStorage.getItem('mpvi-users') || '[]')
      const foundUser = users.find((u: { id: string; name: string }) => u.id === userId)
      return foundUser ? foundUser.name : 'Unknown User'
    }
    return 'Unknown User'
  }

  // Sort inspections
  const sortedInspections = [...filteredInspections].sort((a, b) => {
    let aValue: string | number, bValue: string | number

    switch (sortBy) {
      case 'customerName':
        aValue = a.customerName.toLowerCase()
        bValue = b.customerName.toLowerCase()
        break
      case 'overallScore':
        aValue = a.overallScore
        bValue = b.overallScore
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case 'createdBy':
        aValue = getUserName(a.createdBy).toLowerCase()
        bValue = getUserName(b.createdBy).toLowerCase()
        break
      default:
        return 0
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateVehicleHealthScore = (inspection: InspectionReport): number => {
    if (inspection.inspectionItems.length === 0) return 0
    
    const totalScore = inspection.inspectionItems.reduce((sum, item) => sum + item.score, 0)
    const maxScore = inspection.inspectionItems.length * 5
    return Math.round((totalScore / maxScore) * 100)
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    if (score >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  const handleViewInspection = (inspection: InspectionReport) => {
    setSelectedInspection(inspection)
  }

  const handleCloseViewer = () => {
    setSelectedInspection(null)
  }

  if (selectedInspection) {
    return (
      <AdminLayout title="Inspection Reports" subtitle="View and manage all inspection reports">
        <InspectionViewer
          inspection={selectedInspection}
          onClose={handleCloseViewer}
          canEdit={true}
          onEdit={() => {
            // Handle edit if needed
          }}
          onNavigateToDashboard={() => setSelectedInspection(null)}
        />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Inspection Reports" subtitle="View and manage all inspection reports in the system">
      <div className="backdrop-blur-md rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
        {/* Search and Filter Controls */}
        <div className="px-6 py-4 border-b border-gray-600">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by customer name, email, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white/10 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="customerName">Sort by Customer</option>
                <option value="createdBy">Sort by Creator</option>
                <option value="overallScore">Sort by Score</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-white/10 border border-gray-500 rounded-md text-white hover:bg-white/20 transition-colors"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Inspections Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: 'rgba(100, 100, 100, 0.8)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Customer & Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Health Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {sortedInspections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    {searchTerm ? 'No inspection reports found matching your search' : 'No inspection reports found'}
                  </td>
                </tr>
              ) : (
                sortedInspections.map((inspection) => (
                  <tr 
                    key={inspection.id} 
                    className="hover:bg-white/10 cursor-pointer"
                    onClick={() => handleViewInspection(inspection)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {inspection.customerName}
                        </div>
                        <div className="text-sm text-gray-300">
                          {inspection.customerEmail}
                        </div>
                        <div className="text-sm text-gray-400">
                          {inspection.vehicleInfo.year} {inspection.vehicleInfo.make} {inspection.vehicleInfo.model}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-20 h-6">
                        <div className="w-20 h-6 rounded-lg overflow-hidden" style={{ 
                          backgroundColor: calculateVehicleHealthScore(inspection) < 60 ? '#3F0913' : 
                                          calculateVehicleHealthScore(inspection) >= 60 && calculateVehicleHealthScore(inspection) < 90 ? '#4D3C13' : 
                                          calculateVehicleHealthScore(inspection) >= 90 ? '#0F3E1E' : '#2A2A2A' 
                        }}>
                          <div 
                            className="h-full transition-all duration-500 ease-out"
                            style={{ 
                              width: `${Math.max(calculateVehicleHealthScore(inspection), 5)}%`,
                              backgroundColor: calculateVehicleHealthScore(inspection) < 60 ? '#A00C2B' :
                                             calculateVehicleHealthScore(inspection) >= 60 && calculateVehicleHealthScore(inspection) < 90 ? '#C09525' :
                                             getHealthScoreColor(calculateVehicleHealthScore(inspection)).includes('green') ? '#16a34a' :
                                             getHealthScoreColor(calculateVehicleHealthScore(inspection)).includes('yellow') ? '#e0a800' :
                                             getHealthScoreColor(calculateVehicleHealthScore(inspection)).includes('red') ? '#FF0011' : '#6b7280'
                            }}
                          >
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-normal text-white px-1">
                            {calculateVehicleHealthScore(inspection).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {getUserName(inspection.createdBy)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(inspection.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewInspection(inspection)
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {sortedInspections.length > 0 && (
          <div className="px-6 py-3 backdrop-blur-md border-t border-gray-600" style={{ backgroundColor: 'rgba(100, 100, 100, 0.3)' }}>
            <div className="flex justify-between items-center text-sm text-gray-300">
              <span>Showing {sortedInspections.length} of {inspections.length} inspection reports</span>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
