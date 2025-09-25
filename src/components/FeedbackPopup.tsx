'use client'

import { useState } from 'react'
import { useFeedback } from '@/contexts/FeedbackContext'
import { useAuth } from '@/contexts/AuthContext'
import { FEEDBACK_AREAS } from '@/types/feedback'

interface FeedbackPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackPopup({ isOpen, onClose }: FeedbackPopupProps) {
  const { createFeedback } = useFeedback()
  const { user } = useAuth()
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['General Feedback'])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAreaToggle = (area: string) => {
    if (selectedAreas.includes(area)) {
      // Remove the area if it's already selected
      const newAreas = selectedAreas.filter(a => a !== area)
      // If removing General Feedback and no other areas, keep it empty
      // If removing other areas and no areas left, add General Feedback back
      if (area === 'General Feedback') {
        setSelectedAreas(newAreas)
      } else {
        setSelectedAreas(newAreas.length > 0 ? newAreas : ['General Feedback'])
      }
    } else {
      // Add the area
      if (area === 'General Feedback') {
        // If selecting General Feedback, clear all others
        setSelectedAreas(['General Feedback'])
      } else {
        // If selecting other area, remove General Feedback and add this one
        const newAreas = selectedAreas.filter(a => a !== 'General Feedback')
        setSelectedAreas([...newAreas, area])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!feedbackText.trim()) {
      alert('Please enter your feedback')
      return
    }

    setIsSubmitting(true)

    try {
      createFeedback({
        text: feedbackText.trim(),
        areas: selectedAreas,
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email
      })

      // Reset form
      setFeedbackText('')
      setSelectedAreas(['General Feedback'])
      
      // Show success message and close popup
      alert('Thank you for your feedback!')
      onClose()
    } catch {
      // Error submitting feedback
      alert('Error submitting feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full z-50" style={{ backgroundColor: '#090909' }}>
      <div className="relative top-20 mx-auto p-5  w-11/12 max-w-2xl shadow-lg rounded-2xl backdrop-blur-md" style={{ backgroundColor: '#1E1E1E' }}>
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-600">
          <h2 className="text-2xl font-bold text-white">Send Feedback</h2>
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Your Feedback *
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none text-white bg-gray-800/50 placeholder-gray-400"
              placeholder="Please describe your feedback, suggestions, or report any issues..."
              required
            />
          </div>

          {/* Areas Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Areas of the App (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto  rounded-xl p-3 backdrop-blur-md" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              {FEEDBACK_AREAS.map((area) => (
                <label key={area} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAreas.includes(area)}
                    onChange={() => handleAreaToggle(area)}
                    className="rounded border-gray-600 text-blue-400 focus:outline-none"
                  />
                  <span className="text-sm text-white">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* User Info Display */}
          {user && (
            <div className="backdrop-blur-md rounded-xl p-3 " style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
              <p className="text-sm text-gray-300">
                <strong>Submitting as:</strong> {user.name} ({user.email})
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-gray-500"
              title="Cancel"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !feedbackText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
