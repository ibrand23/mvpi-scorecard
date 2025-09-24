'use client'

import { useState } from 'react'
import { useFeedback } from '@/contexts/FeedbackContext'
import { Feedback } from '@/types/feedback'
import UserManagement from './UserManagement'
import FeedbackIcon from './FeedbackIcon'

interface AdminFeedbackListProps {
  onClose: () => void
}

export default function AdminFeedbackList({ onClose }: AdminFeedbackListProps) {
  const { feedbacks, updateFeedbackStatus } = useFeedback()
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed'>('all')
  const [activeTab, setActiveTab] = useState<'feedback' | 'users'>('feedback')

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (statusFilter === 'all') return true
    return feedback.status === statusFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    return status === 'reviewed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  const handleStatusChange = (feedbackId: string, newStatus: 'pending' | 'reviewed') => {
    updateFeedbackStatus(feedbackId, newStatus)
    if (selectedFeedback?.id === feedbackId) {
      setSelectedFeedback({ ...selectedFeedback, status: newStatus })
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <FeedbackIcon />
      <div className="relative top-10 mx-auto p-5 w-11/12 max-w-7xl shadow-lg rounded-md backdrop-blur-md" style={{ backgroundColor: '#1E1E1E' }}>
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-600">
          <h2 className="text-2xl font-bold text-white">Admin Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-gray-500"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('feedback')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'feedback'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Feedback Management
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Management
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'feedback' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feedback List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">All Feedback</h3>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'reviewed')}
                      className="px-3 py-1 pr-8 border border-gray-600 rounded-md text-sm focus:outline-none text-white bg-gray-800/50 appearance-none"
                      style={{ backgroundImage: 'none' }}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Feedback
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Areas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredFeedbacks.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                              No feedback found
                            </td>
                          </tr>
                        ) : (
                          filteredFeedbacks
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((feedback) => (
                              <tr 
                                key={feedback.id} 
                                onClick={() => setSelectedFeedback(feedback)}
                                className="hover:bg-gray-50 cursor-pointer"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8">
                                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-xs font-medium text-gray-700">
                                          {(feedback.userName || 'U').charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-gray-900">
                                        {feedback.userName || 'Unknown User'}
                                      </div>
                                      <div className="text-sm text-gray-500">{feedback.userEmail || 'No email'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900 max-w-xs truncate">
                                    {feedback.text}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {feedback.areas.slice(0, 2).map((area) => (
                                      <span key={area} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                        {area}
                                      </span>
                                    ))}
                                    {feedback.areas.length > 2 && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                        +{feedback.areas.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                                    {feedback.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(feedback.createdAt)}
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Feedback Detail */}
              <div>
                {selectedFeedback ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      {/* User Info */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700">
                            <strong>Name:</strong> {selectedFeedback.userName || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>Email:</strong> {selectedFeedback.userEmail || 'Not provided'}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>Submitted:</strong> {formatDate(selectedFeedback.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Feedback Text */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Feedback</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {selectedFeedback.text}
                        </p>
                      </div>

                      {/* Areas */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Areas Selected</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedFeedback.areas.map((area) => (
                            <span key={area} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Status Management */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Status</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(selectedFeedback.id, 'pending')}
                            className={`px-4 py-2 rounded text-sm font-medium ${
                              selectedFeedback.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => handleStatusChange(selectedFeedback.id, 'reviewed')}
                            className={`px-4 py-2 rounded text-sm font-medium ${
                              selectedFeedback.status === 'reviewed'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                            }`}
                          >
                            Reviewed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                    Select a feedback item to view details
                  </div>
                )}
              </div>
            </div>
          ) : (
            <UserManagement />
          )}
        </div>
      </div>
    </div>
  )
}
