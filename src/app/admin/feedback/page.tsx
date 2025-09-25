'use client'

import { useState } from 'react'
import { useFeedback } from '@/contexts/FeedbackContext'
import AdminLayout from '@/components/AdminLayout'

export default function AdminFeedbackPage() {
  const { feedbacks, deleteFeedback, markAsRead } = useFeedback()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>('all')

  // Filter feedback based on search and status
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'read' && feedback.isRead) ||
      (filterStatus === 'unread' && !feedback.isRead)
    
    return matchesSearch && matchesStatus
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

  const handleDeleteFeedback = (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      deleteFeedback(id)
    }
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  return (
    <AdminLayout title="Feedback Management" subtitle="View and manage user feedback">
      <div className="backdrop-blur-md rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
        {/* Search and Filter Controls */}
        <div className="px-6 py-4 border-b border-gray-600">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search feedback by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'read' | 'unread')}
                className="px-3 py-2 bg-white/10 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Feedback</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="divide-y divide-gray-600">
          {filteredFeedbacks.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              {searchTerm || filterStatus !== 'all' ? 'No feedback found matching your criteria' : 'No feedback received yet'}
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className={`p-6 ${!feedback.isRead ? 'bg-white/5' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{feedback.name}</h3>
                      <span className="text-sm text-gray-300">{feedback.email}</span>
                      {!feedback.isRead && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      Submitted on {formatDate(feedback.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!feedback.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(feedback.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteFeedback(feedback.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-white/5 rounded-md p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{feedback.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {filteredFeedbacks.length > 0 && (
          <div className="px-6 py-3 backdrop-blur-md border-t border-gray-600" style={{ backgroundColor: 'rgba(100, 100, 100, 0.3)' }}>
            <div className="flex justify-between items-center text-sm text-gray-300">
              <span>Showing {filteredFeedbacks.length} of {feedbacks.length} feedback items</span>
              <div className="flex space-x-4">
                <span>Total: {feedbacks.length}</span>
                <span>Unread: {feedbacks.filter(f => !f.isRead).length}</span>
                <span>Read: {feedbacks.filter(f => f.isRead).length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
