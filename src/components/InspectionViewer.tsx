'use client'

import { useState, useEffect, useRef } from 'react'
import { InspectionReport } from '@/types/inspection'
import { useAuth } from '@/contexts/AuthContext'
import { useInspection } from '@/contexts/InspectionContext'
import InspectionOverview from './InspectionOverview'
import InspectionIssues from './InspectionIssues'
import FeedbackIcon from './FeedbackIcon'

interface InspectionViewerProps {
  inspection: InspectionReport
  onClose: () => void
  canEdit?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onNavigateToDashboard?: () => void
}

export default function InspectionViewer({ inspection, onClose, canEdit = false, onEdit, onDelete, onNavigateToDashboard }: InspectionViewerProps) {
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
        return 'text-white'
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

  // Get user name by ID
  const getUserName = (userId: string): string => {
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('mpvi-users') || '[]')
      const foundUser = users.find((u: { id: string; name: string }) => u.id === userId)
      return foundUser ? foundUser.name : 'Unknown User'
    }
    return 'Unknown User'
  }

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      alert('Please allow popups for this site to enable printing.')
      return
    }

    // Generate the print content
    const printContent = generatePrintContent()
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // The print dialog will be triggered automatically by the script in the content
    // Close the window after a delay to allow printing
    setTimeout(() => {
      printWindow.close()
    }, 2000)
  }

  const handleDownload = () => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    // Generate the print content
    const printContent = generatePrintContent()
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // Wait for content to load, then trigger download
    printWindow.onload = () => {
      // Generate filename with customer name and date
      const date = new Date().toISOString().split('T')[0]
      const customerName = currentInspection.customerName.replace(/[^a-zA-Z0-9]/g, '_')
      const filename = `Inspection_Report_${customerName}_${date}.pdf`
      
      // Focus the window and trigger print dialog with PDF option
      printWindow.focus()
      
      // Add a small delay to ensure content is fully loaded
      setTimeout(() => {
        printWindow.print()
        
        // Close the window after a short delay to allow print dialog to open
        setTimeout(() => {
          printWindow.close()
        }, 1000)
      }, 500)
    }
  }

  const generatePrintContent = () => {
    const healthScore = calculateVehicleHealthScore()
    const healthScoreColor = getHealthScoreColor(healthScore)
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inspection Report - ${currentInspection.customerName}</title>
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
              <div class="info-item"><strong>Name:</strong> ${currentInspection.customerName}</div>
              <div class="info-item"><strong>Email:</strong> ${currentInspection.customerEmail}</div>
              <div class="info-item"><strong>Vehicle:</strong> ${currentInspection.vehicleInfo.year} ${currentInspection.vehicleInfo.make} ${currentInspection.vehicleInfo.model}</div>
              ${currentInspection.vehicleInfo.vin ? `<div class="info-item"><strong>VIN:</strong> ${currentInspection.vehicleInfo.vin}</div>` : ''}
              ${currentInspection.vehicleInfo.mileage ? `<div class="info-item"><strong>Mileage:</strong> ${currentInspection.vehicleInfo.mileage} miles</div>` : ''}
            </div>

            <div class="info-card">
              <h3>Vehicle Health</h3>
              <div class="health-score">${healthScore.toFixed(0)}%</div>
            </div>

            <div class="info-card">
              <h3>Inspection Report</h3>
              <div class="info-item"><strong>Created:</strong> ${formatDate(currentInspection.createdAt)}</div>
              ${currentInspection.updatedAt !== currentInspection.createdAt ? `<div class="info-item"><strong>Updated:</strong> ${formatDate(currentInspection.updatedAt)}</div>` : ''}
              <div class="info-item"><strong>By:</strong> ${getUserName(currentInspection.createdBy)}</div>
              <div class="info-item"><strong>Items:</strong> ${currentInspection.inspectionItems.length}</div>
            </div>
          </div>

          <div class="summary-grid">
            ${generateSummaryItems()}
          </div>

          <div class="inspection-items">
            <div class="items-grid">
              ${generateInspectionItems()}
            </div>
          </div>

          ${currentInspection.notes ? `
            <div class="notes-section">
              <h3>Additional Notes</h3>
              <div class="notes-content">${currentInspection.notes}</div>
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

  const generateSummaryItems = () => {
    const counts = currentInspection.inspectionItems.reduce((acc, item) => {
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

  const generateInspectionItems = () => {
    const categories = Object.entries(
      currentInspection.inspectionItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
      }, {} as Record<string, typeof currentInspection.inspectionItems>)
    )

    return categories.map(([category, items]) => `
      <div class="category">
        <h4>${category}</h4>
        ${items.map(item => `
          <div class="item">
            <span class="item-name">${item.item}</span>
            <span class="item-status status-${item.condition.toLowerCase().replace(' ', '-')}">${item.condition}</span>
          </div>
        `).join('')}
      </div>
    `).join('')
  }


  const getHealthScoreColor = (healthScore: number) => {
    if (healthScore >= 90) return 'text-green-600 bg-green-100' // Excellent
    if (healthScore >= 70) return 'text-yellow-600 bg-yellow-100' // Good
    if (healthScore >= 50) return 'text-orange-600 bg-orange-100' // Fair
    return 'text-white' // Poor
  }

  const getItemContainerClasses = (condition: string) => {
    switch (condition) {
      case 'Pass':
        return 'bg-transparent text-white'
      case 'Failed':
        return 'bg-transparent text-gray-900'
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
          <svg className={`${base}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ff000e' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'Attention Required':
        return (
          <svg className={`${base}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#e0a800' }}>
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
      <FeedbackIcon />
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md shadow-sm border-b border-gray-700/50" style={{ backgroundColor: 'rgba(55, 55, 55, 0.6)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <button
                onClick={onNavigateToDashboard}
                className="text-2xl font-bold text-white hover:text-gray-200 transition-colors cursor-pointer"
              >
                MPVI Scorecard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                title="Download PDF"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                title="Print Report"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
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
        {/* Gradient line */}
        <div 
          className="h-0.5 w-full"
          style={{
            background: 'linear-gradient(to right, #388BFF 0%, #0956FF 33.33%, #0033BA 66.66%, #0956FF 100%)'
          }}
        ></div>
      </header>

      <div className="relative mx-auto p-5  w-11/12 max-w-6xl shadow-lg rounded-2xl backdrop-blur-md mt-4" style={{ backgroundColor: 'rgba(55, 55, 55, 0.6)' }}>


        <div className="mt-4 space-y-4">
          {/* 4 Column Grid: Placeholder, Customer/Vehicle, Health, More */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Placeholder */}
            <div className="backdrop-blur-md rounded-lg p-2" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              <h3 className="text-sm font-semibold text-white mb-1">Placeholder</h3>
              <div className="space-y-1">
                <div className="text-gray-300 text-xs">
                  Content coming soon
                </div>
              </div>
            </div>

            {/* Customer & Vehicle Information */}
            <div className="backdrop-blur-md rounded-lg p-2" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              <div className="space-y-1">
                <div className="text-white text-xs truncate" title={currentInspection.customerName}>
                  {currentInspection.customerName}
                </div>
                <div className="text-gray-300 text-xs truncate" title={currentInspection.customerEmail}>
                  {currentInspection.customerEmail}
                </div>
                <div className="text-white text-xs truncate" title={`${currentInspection.vehicleInfo.year} ${currentInspection.vehicleInfo.make} ${currentInspection.vehicleInfo.model}`}>
                  {currentInspection.vehicleInfo.year} {currentInspection.vehicleInfo.make} {currentInspection.vehicleInfo.model}
                </div>
                {currentInspection.vehicleInfo.vin && (
                  <div className="text-gray-300 font-mono text-xs truncate" title={currentInspection.vehicleInfo.vin}>
                    VIN: {currentInspection.vehicleInfo.vin}
                  </div>
                )}
                {currentInspection.vehicleInfo.mileage && (
                  <div className="text-gray-300 text-xs">
                    {currentInspection.vehicleInfo.mileage} miles
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Health */}
            <div className="backdrop-blur-md rounded-lg p-2 flex items-center" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              <div className="mr-3">
                <div className="text-sm font-semibold text-white">Vehicle</div>
                <div className="text-sm font-semibold text-white">Health</div>
              </div>
              <div className="flex items-center justify-center">
                <span className={`text-5xl font-normal px-2 py-1 rounded ${getHealthScoreColor(calculateVehicleHealthScore())}`}>
                  {calculateVehicleHealthScore().toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Inspection Report */}
            <div className="backdrop-blur-md rounded-lg p-2" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              <div className="space-y-1">
                <div className="text-white text-xs truncate" title={formatDate(currentInspection.createdAt)}>
                  {formatDate(currentInspection.createdAt)}
                </div>
                {currentInspection.updatedAt !== currentInspection.createdAt && (
                  <div className="text-gray-300 text-xs truncate" title={formatDate(currentInspection.updatedAt)}>
                    Updated: {formatDate(currentInspection.updatedAt)}
                  </div>
                )}
                <div className="text-gray-300 text-xs truncate" title={getUserName(currentInspection.createdBy)}>
                  By: {getUserName(currentInspection.createdBy)}
                </div>
                <div className="text-gray-300 text-xs">
                  {currentInspection.inspectionItems.length} items
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
                                style={item.condition === 'Not Inspected' ? { backgroundColor: '#505050' } : 
                                       item.condition === 'Failed' ? { backgroundColor: '#FAE1DE' } : {}}
                              >
                                <div className="flex items-center space-x-2">
                                  <div>
                                    {getIcon(item.condition)}
                                  </div>
                                  <span className="text-xs font-medium">{item.item}</span>
                                </div>
                                {deduction && (
                                  <span className="text-sm font-normal" style={{ color: '#FF0011' }}>
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
                                style={item.condition === 'Not Inspected' ? { backgroundColor: '#505050' } : 
                                       item.condition === 'Failed' ? { backgroundColor: '#FAE1DE' } : {}}
                              >
                                <div className="flex items-center space-x-2">
                                  <div>
                                    {getIcon(item.condition)}
                                  </div>
                                  <span className="text-xs font-medium">{item.item}</span>
                                </div>
                                {deduction && (
                                  <span className="text-sm font-normal" style={{ color: '#FF0011' }}>
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
                                  style={item.condition === 'Not Inspected' ? { backgroundColor: '#505050' } : 
                                         item.condition === 'Failed' ? { backgroundColor: '#FAE1DE' } : {}}
                                >
                                  <div className="flex items-center space-x-2">
                                    <div>
                                      {getIcon(item.condition)}
                                    </div>
                                    <span className="text-xs font-medium">{item.item}</span>
                                  </div>
                                  {deduction && (
                                    <span className="text-sm font-normal" style={{ color: '#FF0011' }}>
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
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#FF0011' }}>
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
                className="px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#FF0011' }}
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
