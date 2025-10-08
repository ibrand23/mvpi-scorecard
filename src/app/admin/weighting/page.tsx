'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { INSPECTION_CATEGORIES_ICE, INSPECTION_CATEGORIES_EV, INSPECTION_ITEMS_ICE, INSPECTION_ITEMS_EV } from '@/types/inspection'

interface WeightingItem {
  id: string
  section: string
  vehicleType: 'ICE' | 'EV'
  inspectionItem: string
  failedWeight: number
  attentionRequiredWeight: number
}

type SortField = 'section' | 'vehicleType' | 'inspectionItem' | 'failedWeight' | 'attentionRequiredWeight'
type SortDirection = 'asc' | 'desc'

export default function ScorecardWeightingPage() {
  const [weightingItems, setWeightingItems] = useState<WeightingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>('section')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Load weighting configuration from localStorage
  useEffect(() => {
    const loadWeightingConfig = () => {
      if (typeof window !== 'undefined') {
        const savedConfig = localStorage.getItem('mpvi-weighting-config')
        if (savedConfig) {
          try {
            setWeightingItems(JSON.parse(savedConfig))
          } catch {
            // Error parsing, use defaults
            generateDefaultWeightingItems()
          }
        } else {
          generateDefaultWeightingItems()
        }
        setIsLoading(false)
      }
    }
    loadWeightingConfig()
  }, [])

  const generateDefaultWeightingItems = () => {
    const items: WeightingItem[] = []
    
    // ICE Vehicle Items
    INSPECTION_CATEGORIES_ICE.forEach(category => {
      INSPECTION_ITEMS_ICE[category].forEach(item => {
        items.push({
          id: `ice-${category}-${item}`.replace(/\s+/g, '-').toLowerCase(),
          section: category,
          vehicleType: 'ICE',
          inspectionItem: item,
          failedWeight: 25, // Default -25%
          attentionRequiredWeight: 7 // Default -7%
        })
      })
    })

    // EV Vehicle Items
    INSPECTION_CATEGORIES_EV.forEach(category => {
      INSPECTION_ITEMS_EV[category].forEach(item => {
        items.push({
          id: `ev-${category}-${item}`.replace(/\s+/g, '-').toLowerCase(),
          section: category,
          vehicleType: 'EV',
          inspectionItem: item,
          failedWeight: 25, // Default -25%
          attentionRequiredWeight: 7 // Default -7%
        })
      })
    })

    setWeightingItems(items)
  }

  const updateWeighting = (id: string, type: 'failed' | 'attentionRequired', value: number) => {
    const updatedItems = weightingItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [type === 'failed' ? 'failedWeight' : 'attentionRequiredWeight']: value
        }
      }
      return item
    })
    setWeightingItems(updatedItems)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mpvi-weighting-config', JSON.stringify(updatedItems))
    }
  }

  const resetToDefaults = () => {
    generateDefaultWeightingItems()
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedItems = [...weightingItems].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case 'section':
        aValue = a.section
        bValue = b.section
        break
      case 'vehicleType':
        aValue = a.vehicleType
        bValue = b.vehicleType
        break
      case 'inspectionItem':
        aValue = a.inspectionItem
        bValue = b.inspectionItem
        break
      case 'failedWeight':
        aValue = a.failedWeight
        bValue = b.failedWeight
        break
      case 'attentionRequiredWeight':
        aValue = a.attentionRequiredWeight
        bValue = b.attentionRequiredWeight
        break
      default:
        return 0
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    )
  }

  if (isLoading) {
    return (
      <AdminLayout title="Scorecard Weighting" subtitle="Configure scoring weights for inspection items">
        <div className="backdrop-blur-md rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
          <div className="p-6 text-center">
            <div className="text-white">Loading weighting configuration...</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Scorecard Weighting" 
      subtitle="Configure scoring weights for inspection items"
    >
      <div className="backdrop-blur-md rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
        <div className="px-6 py-4 border-b border-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Inspection Item Weighting</h2>
              <p className="text-gray-300 mt-1">
                Adjust the percentage deductions for failed and attention-required items. Changes apply to all inspection reports.
              </p>
              {sortField && (
                <p className="text-sm text-gray-400 mt-1">
                  Sorted by: <span className="text-blue-400 capitalize">{sortField.replace(/([A-Z])/g, ' $1').trim()}</span> 
                  <span className="text-gray-500">({sortDirection === 'asc' ? 'ascending' : 'descending'})</span>
                </p>
              )}
            </div>
            <button
              onClick={resetToDefaults}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th 
                  className="text-left py-3 px-4 text-white font-semibold cursor-pointer hover:bg-gray-700/30 transition-colors select-none"
                  onClick={() => handleSort('section')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Section</span>
                    {getSortIcon('section')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 text-white font-semibold cursor-pointer hover:bg-gray-700/30 transition-colors select-none"
                  onClick={() => handleSort('vehicleType')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Vehicle Type</span>
                    {getSortIcon('vehicleType')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 text-white font-semibold cursor-pointer hover:bg-gray-700/30 transition-colors select-none"
                  onClick={() => handleSort('inspectionItem')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Inspection Item</span>
                    {getSortIcon('inspectionItem')}
                  </div>
                </th>
                <th 
                  className="text-center py-3 px-4 text-white font-semibold cursor-pointer hover:bg-gray-700/30 transition-colors select-none"
                  onClick={() => handleSort('failedWeight')}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Failed (%)</span>
                    {getSortIcon('failedWeight')}
                  </div>
                </th>
                <th 
                  className="text-center py-3 px-4 text-white font-semibold cursor-pointer hover:bg-gray-700/30 transition-colors select-none"
                  onClick={() => handleSort('attentionRequiredWeight')}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Attention Required (%)</span>
                    {getSortIcon('attentionRequiredWeight')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item, index) => (
                <tr key={item.id} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'}`}>
                  <td className="py-3 px-4 text-white">{item.section}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.vehicleType === 'EV' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.vehicleType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white">{item.inspectionItem}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.failedWeight}
                        onChange={(e) => updateWeighting(item.id, 'failed', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center text-white rounded-l focus:outline-none focus:ring-2"
                        style={{ backgroundColor: '#a00c2b', border: '1px solid #a00c2b', boxShadow: '0 0 0 2px transparent' }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(160, 12, 43, 0.5)'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 0 2px transparent'
                        }}
                      />
                      <span className="px-2 py-1 text-white border border-l-0 rounded-r text-sm" style={{ backgroundColor: '#a00c2b', borderColor: '#a00c2b' }}>%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.attentionRequiredWeight}
                        onChange={(e) => updateWeighting(item.id, 'attentionRequired', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center bg-yellow-700 text-white border border-yellow-600 rounded-l focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <span className="px-2 py-1 bg-yellow-600 text-white border border-l-0 border-yellow-600 rounded-r text-sm">%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-600 bg-gray-800/20">
          <div className="text-sm text-gray-300">
            <p><strong>Note:</strong> These percentages represent the deduction from the overall vehicle health score when an item fails or requires attention.</p>
            <p className="mt-1">Changes are automatically saved and will apply to all new and existing inspection reports.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
