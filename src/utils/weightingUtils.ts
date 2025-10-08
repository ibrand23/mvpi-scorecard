export interface WeightingItem {
  id: string
  section: string
  vehicleType: 'ICE' | 'EV'
  inspectionItem: string
  failedWeight: number
  attentionRequiredWeight: number
}

export interface WeightingConfig {
  [key: string]: WeightingItem
}

// Default weighting configuration
const DEFAULT_WEIGHTING: WeightingConfig = {}

// Initialize default weighting for all inspection items
export const initializeDefaultWeighting = (): WeightingConfig => {
  const config: WeightingConfig = {}
  
  // This will be populated by the weighting page when it loads
  // For now, return empty config
  return config
}

// Get weighting configuration from localStorage
export const getWeightingConfig = (): WeightingConfig => {
  if (typeof window === 'undefined') {
    return DEFAULT_WEIGHTING
  }
  
  try {
    const savedConfig = localStorage.getItem('mpvi-weighting-config')
    if (savedConfig) {
      const items: WeightingItem[] = JSON.parse(savedConfig)
      const config: WeightingConfig = {}
      items.forEach(item => {
        config[item.id] = item
      })
      return config
    }
  } catch (error) {
    console.error('Error loading weighting config:', error)
  }
  
  return DEFAULT_WEIGHTING
}

// Get weight for a specific inspection item
export const getItemWeight = (
  section: string, 
  inspectionItem: string, 
  vehicleType: 'ICE' | 'EV', 
  condition: 'Failed' | 'Attention Required'
): number => {
  const config = getWeightingConfig()
  const id = `${vehicleType.toLowerCase()}-${section}-${inspectionItem}`.replace(/\s+/g, '-').toLowerCase()
  const item = config[id]
  
  if (!item) {
    // Return default weights if not configured
    return condition === 'Failed' ? 25 : 7
  }
  
  return condition === 'Failed' ? item.failedWeight : item.attentionRequiredWeight
}

// Calculate overall vehicle health score with weighting
export const calculateVehicleHealthScore = (
  inspectionItems: Array<{
    section: string
    item: string
    condition: 'Pass' | 'Failed' | 'Attention Required' | 'Not Inspected'
  }>,
  vehicleType: 'ICE' | 'EV'
): number => {
  let totalDeduction = 0
  let totalItems = 0
  
  inspectionItems.forEach(({ section, item, condition }) => {
    if (condition === 'Not Inspected') {
      return // Skip not inspected items
    }
    
    totalItems++
    
    if (condition === 'Failed') {
      const weight = getItemWeight(section, item, vehicleType, 'Failed')
      totalDeduction += weight
    } else if (condition === 'Attention Required') {
      const weight = getItemWeight(section, item, vehicleType, 'Attention Required')
      totalDeduction += weight
    }
  })
  
  if (totalItems === 0) {
    return 100 // Perfect score if no items inspected
  }
  
  const score = Math.max(0, 100 - totalDeduction)
  return Math.round(score)
}

// Get weighting summary for display
export const getWeightingSummary = (vehicleType: 'ICE' | 'EV'): {
  totalItems: number
  defaultFailedWeight: number
  defaultAttentionWeight: number
} => {
  const config = getWeightingConfig()
  const items = Object.values(config).filter(item => item.vehicleType === vehicleType)
  
  return {
    totalItems: items.length,
    defaultFailedWeight: items.length > 0 ? items[0].failedWeight : 25,
    defaultAttentionWeight: items.length > 0 ? items[0].attentionRequiredWeight : 7
  }
}
