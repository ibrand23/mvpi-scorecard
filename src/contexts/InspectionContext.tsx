'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { InspectionReport, InspectionItem } from '@/types/inspection'

interface InspectionContextType {
  inspections: InspectionReport[]
  createInspection: (inspection: Omit<InspectionReport, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateInspection: (id: string, updates: Partial<InspectionReport>) => void
  deleteInspection: (id: string) => void
  getInspectionById: (id: string) => InspectionReport | undefined
  getInspectionsByCustomerEmail: (email: string) => InspectionReport[]
  getInspectionsByRole: (userRole: string, userEmail: string) => InspectionReport[]
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined)

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [inspections, setInspections] = useState<InspectionReport[]>([])

  useEffect(() => {
    // Load inspections from localStorage on mount
    const storedInspections = localStorage.getItem('mvpi-inspections')
    if (storedInspections) {
      setInspections(JSON.parse(storedInspections))
    }
  }, [])

  const saveInspections = (newInspections: InspectionReport[]) => {
    setInspections(newInspections)
    localStorage.setItem('mvpi-inspections', JSON.stringify(newInspections))
  }

  const createInspection = (inspectionData: Omit<InspectionReport, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const now = new Date().toISOString()
    const newInspection: InspectionReport = {
      ...inspectionData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    }
    
    const updatedInspections = [...inspections, newInspection]
    saveInspections(updatedInspections)
    return newInspection.id
  }

  const updateInspection = (id: string, updates: Partial<InspectionReport>) => {
    const updatedInspections = inspections.map(inspection => 
      inspection.id === id 
        ? { ...inspection, ...updates, updatedAt: new Date().toISOString() }
        : inspection
    )
    saveInspections(updatedInspections)
  }

  const deleteInspection = (id: string) => {
    const updatedInspections = inspections.filter(inspection => inspection.id !== id)
    saveInspections(updatedInspections)
  }

  const getInspectionById = (id: string): InspectionReport | undefined => {
    return inspections.find(inspection => inspection.id === id)
  }

  const getInspectionsByCustomerEmail = (email: string): InspectionReport[] => {
    return inspections.filter(inspection => 
      inspection.customerEmail.toLowerCase() === email.toLowerCase()
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const getInspectionsByRole = (userRole: string, userEmail: string): InspectionReport[] => {
    switch (userRole) {
      case 'Admin':
      case 'Tech':
      case 'Advisor':
        // These roles can see all inspections
        return inspections.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'Customer':
        // Customers can only see their own inspections
        return getInspectionsByCustomerEmail(userEmail)
      default:
        return []
    }
  }

  return (
    <InspectionContext.Provider value={{
      inspections,
      createInspection,
      updateInspection,
      deleteInspection,
      getInspectionById,
      getInspectionsByCustomerEmail,
      getInspectionsByRole
    }}>
      {children}
    </InspectionContext.Provider>
  )
}

export function useInspection() {
  const context = useContext(InspectionContext)
  if (context === undefined) {
    throw new Error('useInspection must be used within an InspectionProvider')
  }
  return context
}
