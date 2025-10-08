'use client'

import { useState } from 'react'
import { useInspection } from '@/contexts/InspectionContext'
import { useAuth } from '@/contexts/AuthContext'
import { InspectionReport } from '@/types/inspection'
import { formatNumberWithCommas, getHealthScoreColor } from '@/utils/numberFormatting'
import { calculateVehicleHealthScore } from '@/utils/weightingUtils'

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
  
  const calculateHealthScore = (inspection: InspectionReport) => {
    const inspectionItems = inspection.inspectionItems.map(item => ({
      section: item.category,
      item: item.item,
      condition: item.condition
    }))
    
    return calculateVehicleHealthScore(inspectionItems, inspection.vehicleInfo.isEV ? 'EV' : 'ICE')
  }
  
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

  const handlePrint = (inspection: InspectionReport) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      alert('Please allow popups for this site to enable printing.')
      return
    }

    // Generate the print content
    const printContent = generatePrintContent(inspection)
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // The print dialog will be triggered automatically by the script in the content
    // Close the window after a delay to allow printing
    setTimeout(() => {
      printWindow.close()
    }, 2000)
  }

  const generatePrintContent = (inspection: InspectionReport) => {
    const healthScore = calculateHealthScore(inspection)
    const healthScoreColor = getHealthScoreColor(healthScore)
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inspection Report - ${inspection.customerName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 10px;
              background: white;
              color: #333;
              font-size: 10px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 8px;
              margin-bottom: 10px;
            }
            .info-card {
              padding: 6px;
            }
            .info-card h3 {
              margin: 0 0 4px 0;
              font-size: 10px;
              color: #333;
              font-weight: bold;
              border-bottom: 1px solid #333;
              padding-bottom: 2px;
            }
            .info-item {
              font-size: 8px;
              margin-bottom: 2px;
              word-wrap: break-word;
              line-height: 1.2;
            }
            .health-score {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              color: ${healthScoreColor.includes('green') ? '#16a34a' : 
                      healthScoreColor.includes('yellow') ? '#eab308' : 
                      healthScoreColor.includes('orange') ? '#f97316' : '#ef4444'};
            }
            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              gap: 8px;
              margin-bottom: 10px;
            }
            .summary-item {
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .summary-item .icon {
              font-size: 12px;
            }
            .summary-item .icon.pass { color: #16a34a; }
            .summary-item .icon.attention { color: #eab308; }
            .summary-item .icon.failed { color: #dc2626; }
            .summary-item .icon.not-inspected { color: #6b7280; }
            .summary-item .label {
              font-size: 8px;
              color: #666;
              white-space: nowrap;
            }
            .summary-item .count {
              font-size: 8px;
              font-weight: 300;
              color: #333;
              margin-left: 4px;
            }
            .inspection-items {
              margin-bottom: 10px;
            }
            .inspection-items h3 {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 6px;
              color: #333;
            }
            .items-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
            }
            .category {
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 6px;
              background: #f9f9f9;
            }
            .category h4 {
              margin: 0 0 6px 0;
              font-size: 10px;
              font-weight: bold;
              color: #333;
              text-transform: uppercase;
              border-bottom: 1px solid #ccc;
              padding-bottom: 3px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 2px 0;
              border-bottom: 1px solid #eee;
              font-size: 9px;
              line-height: 1.2;
            }
            .item:last-child {
              border-bottom: none;
            }
            .item-name {
              flex: 1;
              margin-right: 6px;
            }
            .item-status {
              font-weight: bold;
              padding: 2px 4px;
              border-radius: 3px;
              font-size: 8px;
              white-space: nowrap;
            }
            .status-pass { background: #dcfce7; color: #166534; }
            .status-attention { background: #fef3c7; color: #92400e; }
            .status-failed { background: #fee2e2; color: #dc2626; }
            .status-not-inspected { background: #f3f4f6; color: #6b7280; }
            .notes-section {
              margin-top: 10px;
            }
            .notes-section h3 {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 6px;
              color: #333;
            }
            .notes-content {
              border: 1px solid #ddd;
              border-radius: 3px;
              padding: 6px;
              background: #f9f9f9;
              white-space: pre-wrap;
              font-size: 8px;
              line-height: 1.2;
            }
            .footer {
              margin-top: 10px;
              text-align: center;
              font-size: 8px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 6px;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 8px; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                font-size: 9px;
              }
              .info-grid { 
                grid-template-columns: repeat(3, 1fr); 
                gap: 4px;
                margin-bottom: 6px;
              }
              .summary-grid { 
                grid-template-columns: repeat(4, 1fr); 
                gap: 4px;
                margin-bottom: 6px;
              }
              .items-grid { 
                grid-template-columns: repeat(3, 1fr); 
                gap: 4px;
              }
              .page-break { page-break-before: always; }
              .no-break { page-break-inside: avoid; }
              .info-card { padding: 3px; }
              .info-card h3 { 
                font-size: 8px; 
                border-bottom: 1px solid #333;
                padding-bottom: 1px;
              }
              .info-item { font-size: 6px; }
              .health-score { font-size: 18px; }
              .summary-item { padding: 2px; }
              .summary-item .icon { font-size: 8px; }
              .summary-item .label { font-size: 6px; }
              .summary-item .count { font-size: 6px; font-weight: 300; }
              .category { padding: 4px; }
              .category h4 { font-size: 8px; }
              .item { font-size: 7px; padding: 1px 0; }
              .item-status { font-size: 6px; padding: 1px 3px; }
              .notes-section h3 { font-size: 10px; }
              .notes-content { font-size: 6px; padding: 3px; }
              .footer { font-size: 6px; margin-top: 6px; }
              * { 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="info-grid">
            <div class="info-card">
              <h3>Customer & Vehicle</h3>
              <div class="info-item"><strong>Name:</strong> ${inspection.customerName}</div>
              <div class="info-item"><strong>Email:</strong> ${inspection.customerEmail}</div>
              <div class="info-item"><strong>Vehicle:</strong> ${inspection.vehicleInfo.year} ${inspection.vehicleInfo.make} ${inspection.vehicleInfo.model}</div>
              ${inspection.vehicleInfo.vin ? `<div class="info-item"><strong>VIN:</strong> ${inspection.vehicleInfo.vin}</div>` : ''}
              ${inspection.vehicleInfo.mileage ? `<div class="info-item"><strong>Mileage:</strong> ${formatNumberWithCommas(inspection.vehicleInfo.mileage)} miles</div>` : ''}
            </div>

            <div class="info-card">
              <h3>Vehicle Health</h3>
              <div class="health-score">${healthScore.toFixed(0)}%</div>
            </div>

            <div class="info-card">
              <h3>Inspection Report</h3>
              <div class="info-item"><strong>Created:</strong> ${formatDate(inspection.createdAt)}</div>
              ${inspection.updatedAt !== inspection.createdAt ? `<div class="info-item"><strong>Updated:</strong> ${formatDate(inspection.updatedAt)}</div>` : ''}
              <div class="info-item"><strong>By:</strong> ${getUserName(inspection.createdBy)}</div>
              <div class="info-item"><strong>Items:</strong> ${inspection.inspectionItems.length}</div>
            </div>
          </div>

          <div class="summary-grid">
            ${generateSummaryItems(inspection)}
          </div>

          <div class="inspection-items">
            <div class="items-grid">
              ${generateInspectionItems(inspection)}
            </div>
          </div>

          ${inspection.notes ? `
            <div class="notes-section">
              <h3>Additional Notes</h3>
              <div class="notes-content">${inspection.notes}</div>
            </div>
          ` : ''}

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>MVPi Scorecard - Multi Point Vehicle Inspection System</p>
          </div>
          <script>
            // Auto-trigger print dialog when page loads
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `
  }

  const generateSummaryItems = (inspection: InspectionReport) => {
    const counts = inspection.inspectionItems.reduce((acc, item) => {
      switch (item.condition) {
        case 'Pass': acc.passed++; break
        case 'Attention Required': acc.attentionRequired++; break
        case 'Failed': acc.failed++; break
        case 'Not Inspected': acc.notInspected++; break
      }
      return acc
    }, { passed: 0, attentionRequired: 0, failed: 0, notInspected: 0 })

    return `
      <div class="summary-item">
        <div class="icon pass">✓</div>
        <div class="label">Checked and OK</div>
        <div class="count">${counts.passed}</div>
      </div>
      <div class="summary-item">
        <div class="icon attention">⚠</div>
        <div class="label">May Require Attention Soon</div>
        <div class="count">${counts.attentionRequired}</div>
      </div>
      <div class="summary-item">
        <div class="icon failed">✗</div>
        <div class="label">Requires Immediate Attention</div>
        <div class="count">${counts.failed}</div>
      </div>
      <div class="summary-item">
        <div class="icon not-inspected">○</div>
        <div class="label">Not Inspected</div>
        <div class="count">${counts.notInspected}</div>
      </div>
    `
  }

  const generateInspectionItems = (inspection: InspectionReport) => {
    const categories = Object.entries(
      inspection.inspectionItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
      }, {} as Record<string, typeof inspection.inspectionItems>)
    )

    return categories.map(([category, items]) => `
      <div class="category">
        <h4>${category}</h4>
        ${items.map(item => `
          <div class="item">
            <div class="item-name">${item.item}</div>
            <div class="item-status status-${item.condition.toLowerCase().replace(' ', '-')}">${item.condition}</div>
          </div>
        `).join('')}
      </div>
    `).join('')
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
      <div className="backdrop-blur-md p-4 rounded-xl shadow-sm " style={{ backgroundColor: '#1E1E1E' }}>
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
      <div className="backdrop-blur-md shadow-sm rounded-xl overflow-hidden " style={{ backgroundColor: '#1E1E1E' }}>
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
              <thead style={{ backgroundColor: '#1B1B1B' }}>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    
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
                          {formatNumberWithCommas(inspection.vehicleInfo.mileage)} miles
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-20 h-6">
                        <div className="w-20 h-6 rounded-lg overflow-hidden" style={{ 
                          backgroundColor: calculateHealthScore(inspection) < 60 ? '#3F0913' : 
                                          calculateHealthScore(inspection) >= 60 && calculateHealthScore(inspection) < 90 ? '#4D3C13' : 
                                          calculateHealthScore(inspection) >= 90 ? '#0F3E1E' : '#2A2A2A' 
                        }}>
                          <div 
                            className="h-full transition-all duration-500 ease-out"
                            style={{ 
                              width: `${Math.max(calculateHealthScore(inspection), 5)}%`,
                              backgroundColor: calculateHealthScore(inspection) < 60 ? '#A00C2B' :
                                             calculateHealthScore(inspection) >= 60 && calculateHealthScore(inspection) < 90 ? '#C09525' :
                                             getHealthScoreColor(calculateHealthScore(inspection)).includes('green') ? '#16a34a' :
                                             getHealthScoreColor(calculateHealthScore(inspection)).includes('yellow') ? '#e0a800' :
                                             getHealthScoreColor(calculateHealthScore(inspection)).includes('red') ? '#FF0011' : '#6b7280'
                            }}
                          >
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-normal text-white px-1">
                            {calculateHealthScore(inspection).toFixed(0)}%
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
                          handlePrint(inspection)
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm"
                        title="Print Report"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>
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
