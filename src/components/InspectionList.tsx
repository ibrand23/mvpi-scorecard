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
    const users = JSON.parse(localStorage.getItem('mvpi-users') || '[]')
    const foundUser = users.find((u: { id: string; name: string }) => u.id === userId)
    return foundUser ? foundUser.name : 'Unknown User'
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
      case 'score':
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

  const getScoreColor = (score: number) => {
    if (score === 5) return 'text-green-600 bg-green-100' // Pass
    if (score === 3) return 'text-yellow-600 bg-yellow-100' // Attention Required
    if (score === 2) return 'text-gray-600 bg-gray-100' // Not Inspected
    return 'text-red-600 bg-red-100' // Failed
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
          <h2 className="text-2xl font-bold text-gray-900">Inspection Reports</h2>
          <p className="mt-1 text-sm text-gray-800">
            {filteredInspections.length} report{filteredInspections.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, or vehicle..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Inspection Reports List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {filteredInspections.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-600">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inspection reports</h3>
            <p className="mt-1 text-sm text-gray-700">
              {searchTerm 
                ? 'No reports match your search.'
                : 'Get started by creating a new inspection report.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('customerName')}
                  >
                    Customer {sortField === 'customerName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('vehicle')}
                  >
                    Vehicle {sortField === 'vehicle' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('score')}
                  >
                    Score {sortField === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdBy')}
                  >
                    Created By {sortField === 'createdBy' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedInspections.map((inspection) => (
                  <tr 
                    key={inspection.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onViewInspection(inspection)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {inspection.customerName}
                        </div>
                        <div className="text-sm text-gray-700">
                          {inspection.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {inspection.vehicleInfo.year} {inspection.vehicleInfo.make} {inspection.vehicleInfo.model}
                      </div>
                      {inspection.vehicleInfo.mileage && (
                        <div className="text-sm text-gray-700">
                          {inspection.vehicleInfo.mileage} miles
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(inspection.overallScore)}`}>
                        {inspection.overallScore}/5
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getUserName(inspection.createdBy)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
