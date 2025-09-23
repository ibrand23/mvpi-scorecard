'use client'

import { useState, useEffect } from 'react'
import { useInspection } from '@/contexts/InspectionContext'
import { useAuth } from '@/contexts/AuthContext'
import { InspectionItem, InspectionReport, INSPECTION_CATEGORIES, INSPECTION_ITEMS } from '@/types/inspection'

interface InspectionFormProps {
  inspectionId?: string
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
}

export default function InspectionForm({ inspectionId, onSave, onCancel, onDelete }: InspectionFormProps) {
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
    notes: ''
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
          notes: inspection.notes
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
            condition: 'Pass',
            notes: '',
            score: 5
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

    // Validate notes for Attention Required or Failed items
    formData.inspectionItems.forEach((item) => {
      if ((item.condition === 'Attention Required' || item.condition === 'Failed') && !item.notes.trim()) {
        newErrors[`notes-${item.id}`] = 'Notes are required for items that need attention or have failed'
      }
    })

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

  const updateInspectionItem = (itemId: string, field: keyof InspectionItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      inspectionItems: prev.inspectionItems.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }))
  }



  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="backdrop-blur-md rounded-2xl shadow-lg " style={{ backgroundColor: 'rgba(55, 55, 55, 0.6)' }}>
        <div className="px-6 py-4 -b">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Inspection Report' : 'Create New Inspection Report'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400 ${
                  errors.customerName ? 'border-gray-600' : 'border-gray-600'
                }`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm" style={{ color: '#FF0011' }}>{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Customer Email *
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400 ${
                  errors.customerEmail ? 'border-gray-600' : 'border-gray-600'
                }`}
                placeholder="Enter customer email"
              />
              {errors.customerEmail && (
                <p className="mt-1 text-sm" style={{ color: '#FF0011' }}>{errors.customerEmail}</p>
              )}
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Make *</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.make}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, make: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400 ${
                    errors.make ? 'border-gray-600' : 'border-gray-600'
                  }`}
                  placeholder="e.g., Toyota"
                />
                {errors.make && <p className="mt-1 text-sm" style={{ color: '#FF0011' }}>{errors.make}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Model *</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.model}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, model: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400 ${
                    errors.model ? 'border-gray-600' : 'border-gray-600'
                  }`}
                  placeholder="e.g., Camry"
                />
                {errors.model && <p className="mt-1 text-sm" style={{ color: '#FF0011' }}>{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Year *</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.year}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, year: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400 ${
                    errors.year ? 'border-gray-600' : 'border-gray-600'
                  }`}
                  placeholder="e.g., 2020"
                />
                {errors.year && <p className="mt-1 text-sm" style={{ color: '#FF0011' }}>{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">VIN</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.vin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, vin: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400"
                  placeholder="Vehicle Identification Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Mileage</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.mileage}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo, mileage: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400"
                  placeholder="e.g., 50,000"
                />
              </div>
            </div>
          </div>

          {/* Inspection Items */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Inspection Items</h3>
            <div className="space-y-8">
              {INSPECTION_CATEGORIES.map(category => (
                <div key={category} className="-2 rounded-xl p-6 backdrop-blur-md" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
                  <h4 className="text-xl font-bold text-white mb-4 -b-2 pb-2">{category}</h4>
                  <div className="space-y-3">
                    {INSPECTION_ITEMS[category].map(itemName => {
                      const item = formData.inspectionItems.find(i => i.item === itemName)
                      if (!item) return null

                      return (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-3 border-b border-gray-200 last:border-b-0">
                          <div className="md:col-span-1">
                            <span className="text-sm font-medium text-white">{itemName}</span>
                          </div>
                          
                          <div className="relative">
                            <select
                              value={item.condition}
                              onChange={(e) => {
                                const newCondition = e.target.value as 'Pass' | 'Attention Required' | 'Failed' | 'Not Inspected'
                                updateInspectionItem(item.id, 'condition', newCondition)
                                // Update score based on condition
                                const newScore = newCondition === 'Pass' ? 5 : 
                                               newCondition === 'Attention Required' ? 3 : 
                                               newCondition === 'Not Inspected' ? 2 : 1
                                updateInspectionItem(item.id, 'score', newScore)
                              }}
                              className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none text-white font-medium bg-gray-800/50 appearance-none ${
                                item.condition === 'Pass' ? 'border-green-500' :
                                item.condition === 'Attention Required' ? 'border-yellow-500' :
                                item.condition === 'Not Inspected' ? 'border-gray-500' :
                                'border-gray-600'
                              }`}
                              style={{ backgroundImage: 'none' }}
                            >
                              <option value="Pass">Pass</option>
                              <option value="Attention Required">Attention Required</option>
                              <option value="Failed">Failed</option>
                              <option value="Not Inspected">Not Inspected</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

                          <div>
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => updateInspectionItem(item.id, 'notes', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400 ${
                                errors[`notes-${item.id}`] ? 'border-gray-600 ring-2' : 
                                (item.condition === 'Attention Required' || item.condition === 'Failed') && !item.notes.trim() ? 
                                'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-600'
                              }`}
                              placeholder={
                                (item.condition === 'Attention Required' || item.condition === 'Failed') && !item.notes.trim() ? 
                                'Notes required for this item...' : 'Notes...'
                              }
                            />
                            {errors[`notes-${item.id}`] && (
                              <p className="mt-1 text-sm font-medium" style={{ color: '#FF0011' }}>{errors[`notes-${item.id}`]}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800/50 placeholder-gray-400"
              placeholder="Enter any additional notes or observations..."
            />
          </div>


          {/* Form Actions */}
          <div className="flex justify-between pt-6 -b">
            <div>
              {isEditing && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#FF0011' }}
                >
                  Delete Report
                </button>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isEditing ? 'Update Report' : 'Create Report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
