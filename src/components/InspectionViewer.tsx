'use client'

import { InspectionReport } from '@/types/inspection'
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
  const getScoreColor = (score: number) => {
    if (score === 5) return 'text-green-600 bg-green-100' // Pass
    if (score === 3) return 'text-yellow-600 bg-yellow-100' // Attention Required
    if (score === 2) return 'text-gray-600 bg-gray-100' // Not Inspected
    return 'text-red-600 bg-red-100' // Failed
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
        return 'bg-green-50 border border-green-200 text-gray-900'
      case 'Failed':
        return 'bg-red-50 border border-red-200 text-gray-900'
      case 'Attention Required':
        return 'bg-yellow-50 border border-yellow-200 text-gray-900'
      case 'Not Inspected':
        return 'bg-gray-50 border border-gray-200 text-gray-900'
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inspection Report</h2>
            <p className="text-sm text-gray-800 mt-1">
              Created on {formatDate(inspection.createdAt)}
              {inspection.updatedAt !== inspection.createdAt && (
                <span> • Updated on {formatDate(inspection.updatedAt)}</span>
              )}
            </p>
          </div>
          <div className="flex space-x-2">
            {canEdit && onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Report
              </button>
            )}
            {canEdit && onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Report
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-8">
          {/* Customer & Vehicle Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">{inspection.customerName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{inspection.customerEmail}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Vehicle:</span>
                  <span className="ml-2 text-gray-900">
                    {inspection.vehicleInfo.year} {inspection.vehicleInfo.make} {inspection.vehicleInfo.model}
                  </span>
                </div>
                {inspection.vehicleInfo.vin && (
                  <div>
                    <span className="font-medium text-gray-700">VIN:</span>
                    <span className="ml-2 text-gray-900 font-mono text-sm">{inspection.vehicleInfo.vin}</span>
                  </div>
                )}
                {inspection.vehicleInfo.mileage && (
                  <div>
                    <span className="font-medium text-gray-700">Mileage:</span>
                    <span className="ml-2 text-gray-900">{inspection.vehicleInfo.mileage} miles</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Health and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Vehicle Health</h3>
              <div className="flex items-center space-x-4">
                <span className={`text-4xl font-bold px-4 py-2 rounded-lg ${getHealthScoreColor(calculateVehicleHealthScore())}`}>
                  {calculateVehicleHealthScore().toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Inspection Summary</h3>
              <InspectionOverview inspectionItems={inspection.inspectionItems} />
            </div>

          </div>

          {/* Inspection Issues */}
          <InspectionIssues inspectionItems={inspection.inspectionItems} />

              {/* Inspection Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspection Details</h3>
            <div className="space-y-6">
              {Object.entries(
                inspection.inspectionItems.reduce((acc, item) => {
                  if (!acc[item.category]) {
                    acc[item.category] = []
                  }
                  acc[item.category].push(item)
                  return acc
                }, {} as Record<string, typeof inspection.inspectionItems>)
              ).map(([category, items]) => (
                <div key={category} className="border-2 border-gray-300 rounded-lg p-6 bg-white">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 uppercase tracking-wide">{category}</h4>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${getItemContainerClasses(item.condition)}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div>
                            {getIcon(item.condition)}
                          </div>
                          <span className="text-sm font-medium">{item.item}</span>
                        </div>
                        {item.notes && (
                          <span className="text-sm text-gray-800 ml-4">{item.notes}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          {inspection.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{inspection.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
