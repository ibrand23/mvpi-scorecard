'use client'

import { useState } from 'react'
import FeedbackPopup from './FeedbackPopup'

export default function FeedbackIcon() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-4 left-4 flex flex-col items-center z-40">
        <div className="text-white text-sm font-medium transform -rotate-90 whitespace-nowrap mb-12">
          App Feedback
        </div>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          title="Send Feedback"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      <FeedbackPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  )
}
