'use client'

import { useState } from 'react'
import { useInspection } from '@/contexts/InspectionContext'
import { useAuth } from '@/contexts/AuthContext'
import { InspectionReport } from '@/types/inspection'

interface InspectionListProps {
  onViewInspection: (inspection: InspectionReport) => void
}

export default function InspectionList({ onViewInspection }: InspectionListProps) {
  const { getInspectionsByRole } = useInspection()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  if (!user) return null

  const inspections = getInspectionsByRole(user.role, user.email)
  
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.vehicleInfo.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.vehicleInfo.model.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  // Get user name by ID
  const getUserName = (userId: string): string => {
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('mpvi-users') || '[]')
      const foundUser = users.find((u: { id: string; name: string }) => u.id === userId)
      return foundUser ? foundUser.name : 'Unknown User'
    }
    return 'Unknown User'
  }

  // Sort inspections
  const sortedInspections = [...filteredInspections].sort((a, b) => {
    let aValue: string | number, bValue: string | number
    
    switch (sortField) {
      case 'customerName':
        aValue = a.customerName.toLowerCase()
        bValue = b.customerName.toLowerCase()
        break
      case 'vehicle':
        aValue = `${a.vehicleInfo.make} ${a.vehicleInfo.model}`.toLowerCase()
        bValue = `${b.vehicleInfo.make} ${b.vehicleInfo.model}`.toLowerCase()
        break
      case 'health':
        aValue = calculateVehicleHealthScore(a)
        bValue = calculateVehicleHealthScore(b)
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
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const calculateVehicleHealthScore = (inspection: InspectionReport) => {
    // Start with the base score converted to percentage
    let healthScore = (inspection.overallScore / 5) * 100

    // Apply penalties
    inspection.inspectionItems.forEach(item => {
      if (item.condition === 'Attention Required') {
        healthScore -= 7
      } else if (item.condition === 'Failed') {
        healthScore -= 25
      }
    })

    // Ensure score doesn't go below 0
    return Math.max(0, healthScore)
  }

  const getHealthScoreColor = (healthScore: number) => {
    if (healthScore >= 90) return 'text-green-600 bg-green-100' // Excellent
    if (healthScore >= 70) return 'text-yellow-600 bg-yellow-100' // Good
    if (healthScore >= 50) return 'text-orange-600 bg-orange-100' // Fair
    return 'text-white' // Poor
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Inspection Reports</h2>
          <p className="mt-1 text-sm text-gray-300">
            {filteredInspections.length} report{filteredInspections.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="backdrop-blur-md p-4 rounded-xl shadow-sm " style={{ backgroundColor: 'rgba(55, 55, 55, 0.6)' }}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, or vehicle..."
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Inspection Reports List */}
      <div className="backdrop-blur-md shadow-sm rounded-xl overflow-hidden " style={{ backgroundColor: 'rgba(55, 55, 55, 0.6)' }}>
        {filteredInspections.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-600">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-white">No inspection reports</h3>
            <p className="mt-1 text-sm text-gray-300">
              {searchTerm 
                ? 'No reports match your search.'
                : 'Get started by creating a new inspection report.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: 'rgba(75, 75, 75, 0.8)' }}>
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/20"
                    onClick={() => handleSort('customerName')}
                  >
                    Customer {sortField === 'customerName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/20"
                    onClick={() => handleSort('vehicle')}
                  >
                    Vehicle {sortField === 'vehicle' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/20"
                    onClick={() => handleSort('health')}
                  >
                    Health {sortField === 'health' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/20"
                    onClick={() => handleSort('createdBy')}
                  >
                    Created By {sortField === 'createdBy' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/20"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {sortedInspections.map((inspection) => (
                  <tr 
                    key={inspection.id} 
                    className="hover:bg-white/10 cursor-pointer"
                    onClick={() => onViewInspection(inspection)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {inspection.customerName}
                        </div>
                        <div className="text-sm text-gray-300">
                          {inspection.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {inspection.vehicleInfo.year} {inspection.vehicleInfo.make} {inspection.vehicleInfo.model}
                      </div>
                      {inspection.vehicleInfo.mileage && (
                        <div className="text-sm text-gray-300">
                          {inspection.vehicleInfo.mileage} miles
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal ${getHealthScoreColor(calculateVehicleHealthScore(inspection))}`}>
                        {calculateVehicleHealthScore(inspection).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {getUserName(inspection.createdBy)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(inspection.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
