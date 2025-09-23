'use client'

import { InspectionItem } from '@/types/inspection'

interface InspectionOverviewProps {
  inspectionItems: InspectionItem[]
}

export default function InspectionOverview({ inspectionItems }: InspectionOverviewProps) {
  // Calculate counts for each category
  const counts = inspectionItems.reduce((acc, item) => {
    switch (item.condition) {
      case 'Pass':
        acc.passed++
        break
      case 'Attention Required':
        acc.attentionRequired++
        break
      case 'Failed':
        acc.failed++
        break
      case 'Not Inspected':
        acc.notInspected++
        break
    }
    return acc
  }, {
    passed: 0,
    attentionRequired: 0,
    failed: 0,
    notInspected: 0
  })

  const categories = [
    {
      condition: 'Pass',
      label: 'Checked and OK',
      count: counts.passed,
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      textColor: 'text-white',
      countBgColor: '',
      countTextColor: counts.passed > 0 ? 'text-green-600' : 'text-white'
    },
    {
      condition: 'Attention Required',
      label: 'May Require Attention Soon',
      count: counts.attentionRequired,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#e0a800' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
      textColor: 'text-white',
      countBgColor: '',
      countTextColor: counts.attentionRequired > 0 ? '' : 'text-white'
    },
    {
      condition: 'Failed',
      label: 'Requires Immediate Attention',
      count: counts.failed,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#FF0011' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      textColor: 'text-white',
      countBgColor: '',
      countTextColor: counts.failed > 0 ? '' : 'text-white'
    },
    {
      condition: 'Not Inspected',
      label: 'Not Inspected',
      count: counts.notInspected,
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
        </svg>
      ),
      textColor: 'text-white',
      countBgColor: '',
      countTextColor: counts.notInspected > 0 ? 'text-gray-600' : 'text-white'
    }
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
        {categories.map((category, index) => (
          <div key={category.condition} className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-5 h-5 -mt-0.5">
              {category.icon}
            </div>
            <span className={`text-sm font-medium leading-none ${category.textColor}`}>
              {category.label}
            </span>
            <span 
              className={`px-2 py-1 rounded text-base font-semibold leading-none flex items-center justify-center min-w-[24px] ${category.countBgColor} ${category.countTextColor}`}
              style={category.count === 0 ? { backgroundColor: '#3e3e3e', color: '#8E8E8E' } : 
                     category.condition === 'Attention Required' && category.count > 0 ? { backgroundColor: '#4F4F4F', color: '#e0a800' } : 
                     category.condition === 'Failed' && category.count > 0 ? { backgroundColor: '#4F4F4F', color: '#FF0011' } :
                     category.count > 0 ? { backgroundColor: '#4F4F4F' } : {}}
            >
              {category.count}
            </span>
            {index < categories.length - 1 && (
              <div className="w-px h-6 bg-gray-500 mx-2"></div>
            )}
          </div>
        ))}
    </div>
  )
}
