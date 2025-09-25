import { useState } from 'react'

/**
 * Custom hook for managing localStorage with type safety
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 * @returns [value, setValue, removeValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Remove value from localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for managing arrays in localStorage with CRUD operations
 */
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = []
): {
  items: T[]
  addItem: (item: Omit<T, 'id'> & { id?: string }) => string
  updateItem: (id: string, updates: Partial<T>) => void
  deleteItem: (id: string) => void
  getItemById: (id: string) => T | undefined
  setItems: (items: T[]) => void
} {
  const [items, setItems] = useLocalStorage<T[]>(key, initialValue)

  const addItem = (item: Omit<T, 'id'> & { id?: string }): string => {
    const newItem = {
      ...item,
      id: item.id || Date.now().toString()
    } as T & { id: string }
    
    setItems(prev => [...prev, newItem])
    return newItem.id
  }

  const updateItem = (id: string, updates: Partial<T>) => {
    setItems(prev => 
      prev.map(item => 
        (item as T & { id: string }).id === id 
          ? { ...item, ...updates }
          : item
      )
    )
  }

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => (item as T & { id: string }).id !== id))
  }

  const getItemById = (id: string): T | undefined => {
    return items.find(item => (item as T & { id: string }).id === id)
  }

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    setItems
  }
}
