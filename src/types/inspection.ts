export interface InspectionReport {
  id: string
  customerName: string
  customerEmail: string
  createdAt: string
  updatedAt: string
  createdBy: string // User ID who created the report
  vehicleInfo: {
    make: string
    model: string
    year: string
    vin: string
    mileage: string
  }
  inspectionItems: InspectionItem[]
  overallScore: number
  notes: string
}

export interface InspectionItem {
  id: string
  category: string
  item: string
  condition: 'Pass' | 'Attention Required' | 'Failed' | 'Not Inspected'
  notes: string
  whyItMatters?: string
  recommendedAction?: string
  score: number // 1-5 scale
}

export const INSPECTION_CATEGORIES = [
  'OnStar Diagnostics',
  'Engine',
  'Lighting',
  'Wipers & Windshield',
  'Battery',
  'Under Hood Fluid Levels/Systems',
  'Check for Proper Operation',
  'Lubricate & Tire Sealant',
  'Tires',
  'Brakes',
  'Visible Under Hood Components'
] as const

export const INSPECTION_ITEMS: Record<string, string[]> = {
  'OnStar Diagnostics': [
    'OnStar Active',
    'Enrolled in Advanced Diagnostics Report',
    'Battery Dealer Maintenance Notification',
    'Service History/Recall Check'
  ],
  'Engine': [
    'Engine oil',
    'Oil life monitor',
    'Reset oil life monitor'
  ],
  'Lighting': [
    'Exterior lights'
  ],
  'Wipers & Windshield': [
    'Wiper blade-driver',
    'Wiper blade-passenger',
    'Windshield condition'
  ],
  'Battery': [
    'Battery test results*',
    'Battery visual inspection',
    'Battery cables & connections'
  ],
  'Under Hood Fluid Levels/Systems': [
    'Engine oil',
    'Transmission',
    'Drive axle',
    'Engine cooling system',
    'Power steering',
    'Fuel system',
    'Brake fluid reservoir',
    'Windshield washer fluid'
  ],
  'Visible Under Hood Components': [
    'Belt (ALT, P/S, A/C & FUNCTION)',
    'Safety belt components',
    'Exhaust system',
    'Accelerator pedal',
    'Passenger compartment air filter',
    'Engine air filter',
    'Hoses',
    'Belts',
    'Shocks and struts',
    'Steering components',
    'Axle boots or driveshaft & u-joints',
    'Compartment lift struts',
    'Floor mat secured, no interference with pedals'
  ],
  'Check for Proper Operation': [
    'Horn',
    'Ignition lock',
    'Starter switch',
    'Evaporator control system',
    'Chassis components'
  ],
  'Lubricate & Tire Sealant': [
    'Require pressure monitor',
    'Tire sealant expiration date'
  ],
  'Tires': [
    'Individual tire positions (LF, RF, LR, RR)',
    'Service recommendations (Rotate, Align, Balance)'
  ],
  'Brakes': [
    'Driver Front',
    'Passenger Front',
    'Driver Rear',
    'Passenger Rear',
    'Brake System overall'
  ]
} as const
