'use client'

import { useState, useEffect } from 'react'
import { useInspection } from '@/contexts/InspectionContext'
import { useAuth } from '@/contexts/AuthContext'
import { InspectionReport, InspectionItem, INSPECTION_CATEGORIES, INSPECTION_ITEMS } from '@/types/inspection'

interface InspectionFormProps {
  inspectionId?: string
  onSave: () => void
  onCancel: () => void
}

export default function InspectionForm({ inspectionId, onSave, onCancel }: InspectionFormProps) {
  const { createInspection, updateInspection, getInspectionById } = useInspection()
  const { user } = useAuth()
  const [isEditing] = useState(!!inspectionId)

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    vehicleInfo: {
      make: '',
      model: '',
      year: '',
      vin: '',
      mileage: ''
    },
    inspectionItems: [] as InspectionItem[],
    notes: '',
    status: 'Draft' as 'Draft' | 'Completed' | 'Reviewed'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditing && inspectionId) {
      const inspection = getInspectionById(inspectionId)
      if (inspection) {
        setFormData({
          customerName: inspection.customerName,
          customerEmail: inspection.customerEmail,
          vehicleInfo: inspection.vehicleInfo,
          inspectionItems: inspection.inspectionItems,
          notes: inspection.notes,
          status: inspection.status
        })
      }
    } else {
      // Initialize inspection items for new inspection
      const initialItems: InspectionItem[] = []
      INSPECTION_CATEGORIES.forEach(category => {
        INSPECTION_ITEMS[category].forEach(item => {
          initialItems.push({
            id: `${category}-${item}`.replace(/\s+/g, '-').toLowerCase(),
            category,
            item,
            condition: 'Good',
            notes: '',
            score: 3
          })
        })
      })
      setFormData(prev => ({ ...prev, inspectionItems: initialItems }))
    }
  }, [isEditing, inspectionId, getInspectionById])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address'
    }
    if (!formData.vehicleInfo.make.trim()) {
      newErrors.make = 'Vehicle make is required'
    }
    if (!formData.vehicleInfo.model.trim()) {
      newErrors.model = 'Vehicle model is required'
    }
    if (!formData.vehicleInfo.year.trim()) {
      newErrors.year = 'Vehicle year is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const overallScore = formData.inspectionItems.length > 0 
      ? Math.round(formData.inspectionItems.reduce((sum, item) => sum + item.score, 0) / formData.inspectionItems.length)
      : 0

    const inspectionData = {
      ...formData,
      createdBy: user?.id || '',
      overallScore
    }

    if (isEditing && inspectionId) {
      updateInspection(inspectionId, inspectionData)
    } else {
      createInspection(inspectionData)
    }

    onSave()
  }

  const updateInspectionItem = (itemId: string, field: keyof InspectionItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      inspectionItems: prev.inspectionItems.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600'
    if (score >= 3) return 'text-yellow-600'
    if (score >= 2) return 'text-orange-600'
    return 'text-red-600'
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Inspection Report' : 'Create New Inspection Report'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Email *
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter customer email"
              />
              {errors.customerEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
              )}
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.make}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, make: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.make ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Toyota"
                />
                {errors.make && <p className="mt-1 text-sm text-red-600">{errors.make}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.model}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, model: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Camry"
                />
                {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.year}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, year: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.year ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 2020"
                />
                {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">VIN</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.vin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, vin: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Vehicle Identification Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.mileage}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, mileage: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50,000"
                />
              </div>
            </div>
          </div>

          {/* Inspection Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspection Items</h3>
            <div className="space-y-6">
              {INSPECTION_CATEGORIES.map(category => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                  <div className="space-y-3">
                    {INSPECTION_ITEMS[category].map(itemName => {
                      const item = formData.inspectionItems.find(i => i.item === itemName)
                      if (!item) return null

                      return (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="md:col-span-1">
                            <span className="text-sm font-medium text-gray-700">{itemName}</span>
                          </div>
                          
                          <div>
                            <select
                              value={item.condition}
                              onChange={(e) => updateInspectionItem(item.id, 'condition', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Excellent">Excellent</option>
                              <option value="Good">Good</option>
                              <option value="Fair">Fair</option>
                              <option value="Poor">Poor</option>
                              <option value="Needs Attention">Needs Attention</option>
                            </select>
                          </div>

                          <div>
                            <select
                              value={item.score}
                              onChange={(e) => updateInspectionItem(item.id, 'score', parseInt(e.target.value))}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getScoreColor(item.score)}`}
                            >
                              <option value={1}>1 - Poor</option>
                              <option value={2}>2 - Fair</option>
                              <option value={3}>3 - Good</option>
                              <option value={4}>4 - Very Good</option>
                              <option value={5}>5 - Excellent</option>
                            </select>
                          </div>

                          <div>
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => updateInspectionItem(item.id, 'notes', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Notes..."
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Score Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">Overall Score:</span>
              <span className={`text-2xl font-bold ${getScoreColor(formData.inspectionItems.length > 0 ? Math.round(formData.inspectionItems.reduce((sum, item) => sum + item.score, 0) / formData.inspectionItems.length) : 0)}`}>
                {formData.inspectionItems.length > 0 
                  ? Math.round(formData.inspectionItems.reduce((sum, item) => sum + item.score, 0) / formData.inspectionItems.length)
                  : 0
                }/5
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes or observations..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Draft' | 'Completed' | 'Reviewed' }))}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditing ? 'Update Report' : 'Create Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
