'use client'

import { InspectionItem } from '@/types/inspection'

interface InspectionIssuesProps {
  inspectionItems: InspectionItem[]
}

export default function InspectionIssues({ inspectionItems }: InspectionIssuesProps) {
  // Filter items that are not passed OR have notes
  const issueItems = inspectionItems.filter(item => item.condition !== 'Pass' || item.notes)

  if (issueItems.length === 0) {
    return null
  }

  // Sort items by priority: Failed, Attention Required, Passed, Not Inspected
  const sortedItems = issueItems.sort((a, b) => {
    const priorityOrder = {
      'Failed': 1,
      'Attention Required': 2,
      'Pass': 3,
      'Not Inspected': 4
    }
    
    const aPriority = priorityOrder[a.condition as keyof typeof priorityOrder] || 5
    const bPriority = priorityOrder[b.condition as keyof typeof priorityOrder] || 5
    
    return aPriority - bPriority
  })

  const getIcon = (condition: string) => {
    const base = 'w-5 h-5'
    switch (condition) {
      case 'Failed':
        return (
          <svg className={`${base} text-red-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'Attention Required':
        return (
          <svg className={`${base} text-orange-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        )
      case 'Not Inspected':
        return (
          <svg className={`${base} text-gray-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
          </svg>
        )
      case 'Pass':
        return (
          <svg className={`${base} text-green-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      default:
        return null
    }
  }

  const getItemContainerClasses = (condition: string) => {
    switch (condition) {
      case 'Failed':
        return 'bg-transparent text-white'
      case 'Attention Required':
        return 'bg-transparent text-white'
      case 'Not Inspected':
        return 'bg-transparent text-white'
      case 'Pass':
        return 'bg-transparent text-white'
      default:
        return 'bg-transparent text-white'
    }
  }

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'Failed':
        return 'Requires Immediate Attention'
      case 'Attention Required':
        return 'May Require Attention Soon'
      case 'Not Inspected':
        return 'Not Inspected'
      case 'Pass':
        return 'Passed with Notes'
      default:
        return condition
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-200 pb-2">
        Items Requiring Attention
      </h3>
      <div className="space-y-3">
        {sortedItems.map((item) => (
          <div
            key={`issue-${item.id}`}
            className={`flex items-start justify-between p-4 rounded-lg ${getItemContainerClasses(item.condition)}`}
          >
            <div className="flex items-start space-x-3 flex-1">
              <div className="mt-0.5">
                {getIcon(item.condition)}
              </div>
              <div className="flex-1">
                <div className="text-sm mb-1" style={{ color: '#8E8E8E' }}>
                  {item.category}
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-white">{item.item}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.condition === 'Failed' ? 'bg-red-100 text-red-800' :
                    item.condition === 'Attention Required' ? 'bg-yellow-100 text-yellow-800' :
                    item.condition === 'Pass' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getConditionLabel(item.condition)}
                  </span>
                </div>
                {item.notes && (
                  <div className="text-sm text-white mt-2 p-2 bg-transparent rounded border-l-2 border-gray-500">
                    <span className="font-medium">Notes:</span> {item.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
