'use client'

import { InspectionReport } from '@/types/inspection'

interface InspectionViewerProps {
  inspection: InspectionReport
  onClose: () => void
  canEdit?: boolean
  onEdit?: () => void
}

export default function InspectionViewer({ inspection, onClose, canEdit = false, onEdit }: InspectionViewerProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100'
    if (score >= 3) return 'text-yellow-600 bg-yellow-100'
    if (score >= 2) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800'
      case 'Good': return 'bg-blue-100 text-blue-800'
      case 'Fair': return 'bg-yellow-100 text-yellow-800'
      case 'Poor': return 'bg-orange-100 text-orange-800'
      case 'Needs Attention': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Reviewed': return 'bg-blue-100 text-blue-800'
      case 'Draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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

          {/* Overall Score and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h3>
              <div className="flex items-center space-x-4">
                <span className={`text-4xl font-bold px-4 py-2 rounded-lg ${getScoreColor(inspection.overallScore)}`}>
                  {inspection.overallScore}/5
                </span>
                <div>
                  <div className="text-sm text-gray-800">Based on {inspection.inspectionItems.length} inspection items</div>
                  <div className="text-sm text-gray-800">
                    Average: {(inspection.overallScore / 5 * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(inspection.status)}`}>
                {inspection.status}
              </span>
            </div>
          </div>

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
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="md:col-span-1">
                          <span className="text-sm font-medium text-gray-700">{item.item}</span>
                        </div>
                        
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                            {item.condition}
                          </span>
                        </div>

                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(item.score)}`}>
                            {item.score}/5
                          </span>
                        </div>

                        <div>
                          {item.notes && (
                            <span className="text-sm text-gray-800">{item.notes}</span>
                          )}
                        </div>
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
