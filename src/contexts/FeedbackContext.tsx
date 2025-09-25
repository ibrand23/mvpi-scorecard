'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Feedback } from '@/types/feedback'

interface FeedbackContextType {
  feedbacks: Feedback[]
  createFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'status'>) => string
  updateFeedbackStatus: (id: string, status: 'pending' | 'reviewed') => void
  deleteFeedback: (id: string) => void
  markAsRead: (id: string) => void
  getFeedbackById: (id: string) => Feedback | undefined
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  useEffect(() => {
    // Load feedbacks from localStorage on mount (client-side only)
    if (typeof window !== 'undefined') {
      const storedFeedbacks = localStorage.getItem('mpvi-feedbacks')
      if (storedFeedbacks) {
        setFeedbacks(JSON.parse(storedFeedbacks))
      }
    }
  }, [])

  const saveFeedbacks = (newFeedbacks: Feedback[]) => {
    setFeedbacks(newFeedbacks)
    if (typeof window !== 'undefined') {
      localStorage.setItem('mpvi-feedbacks', JSON.stringify(newFeedbacks))
    }
  }

  const createFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'status'>): string => {
    const now = new Date().toISOString()
    const newFeedback: Feedback = {
      ...feedbackData,
      id: Date.now().toString(),
      createdAt: now,
      status: 'pending'
    }
    
    const updatedFeedbacks = [...feedbacks, newFeedback]
    saveFeedbacks(updatedFeedbacks)
    return newFeedback.id
  }

  const updateFeedbackStatus = (id: string, status: 'pending' | 'reviewed') => {
    const updatedFeedbacks = feedbacks.map(feedback => 
      feedback.id === id 
        ? { ...feedback, status }
        : feedback
    )
    saveFeedbacks(updatedFeedbacks)
  }

  const deleteFeedback = (id: string) => {
    const updatedFeedbacks = feedbacks.filter(feedback => feedback.id !== id)
    saveFeedbacks(updatedFeedbacks)
  }

  const markAsRead = (id: string) => {
    updateFeedbackStatus(id, 'reviewed')
  }

  const getFeedbackById = (id: string): Feedback | undefined => {
    return feedbacks.find(feedback => feedback.id === id)
  }

  return (
    <FeedbackContext.Provider value={{
      feedbacks,
      createFeedback,
      updateFeedbackStatus,
      deleteFeedback,
      markAsRead,
      getFeedbackById
    }}>
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}
