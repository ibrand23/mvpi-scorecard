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
  description?: string
  score: number // 1-5 scale
}

export const INSPECTION_CATEGORIES = [
  'Fluid Levels',
  'Tires',
  'Breaks',
  'Oil Life',
  'Battery',
  'Windshield',
  'Additional Checks'
] as const

export const INSPECTION_ITEMS: Record<string, string[]> = {
  'Additional Checks': [
    'Accelerator Pedal',
    'Backup Camera',
    'Belts',
    'Chassis Lubrication',
    'Drive Axle',
    'Drive Floor Mat',
    'Engine Air Filter',
    'Evaporations Control System',
    'Exhaust System Components',
    'Gas Struts',
    'Horn',
    'Hoses',
    'Ignition Control',
    'Passenger Air Filter',
    'Safety Belts',
    'Starter Switch',
    'Steering Components'
  ],
  'Fluid Levels': [
    'Brake Fluid',
    'Diesle Exhaust',
    'Drive Axle',
    'Transfer Case',
    'Engine Cooling System',
    'Engine Oil',
    'Fuel System',
    'Power Steering',
    'Shocks and Struts',
    'Transmission Equipped',
    'Windshield Washer'
  ],
  'Tires': [
    'Alignment',
    'Balance',
    'Rotation',
    'Driver Front',
    'Driver Rear',
    'Passenger Front',
    'Passenger Rear'
  ],
  'Breaks': [
    'Brake system',
    'Driver Front Linings',
    'Driver Rear Linings',
    'Passenger Front Linings',
    'Passenger Rear Linings',
    'Parking Brake Linings'
  ],
  'Oil Life': [
    'Oil Life',
    'Engine Oil'
  ],
  'Battery': [
    'Battery Cables and Connections',
    'Battery Test Results',
    'Battery Visual Inspection',
    'Exterior Lights'
  ],
  'Windshield': [
    'Windshield Condition',
    'Wipers Driver Front',
    'Wipers Rear',
    'Wipers Passenger front'
  ]
} as const

export const INSPECTION_ITEM_DESCRIPTIONS: Record<string, Record<string, string>> = {
  'Additional Checks': {
    'Accelerator Pedal': 'Accelerator pedal high effort',
    'Belts': 'Belts: engine, accessory, serpentine',
    'Chassis Lubrication': 'Chassis components lubrication',
    'Drive Axle': 'CV drive axle boots or drive',
    'Drive Floor Mat': 'Check that floor mats do not interfere',
    'Gas Struts': 'Gas struts on hood or lift gate',
    'Hoses': 'Hoses: engine, power steering',
    'Ignition Control': 'Ignition lock cylinder operation',
    'Passenger Air Filter': 'Passenger compartment air filter',
    'Safety Belts': 'Safety belts, buckles, latch',
    'Starter Switch': 'Starter switch operation',
    'Steering Components': 'Steering components and suspension'
  },
  'Fluid Levels': {
    'Brake Fluid': 'Brake fluid reservoir',
    'Diesle Exhaust': 'Diesel exhaust fluid',
    'Drive Axle': 'Drive axle',
    'Transfer Case': 'Transfer case',
    'Engine Cooling System': 'Engine cooling system',
    'Engine Oil': 'Engine oil',
    'Fuel System': 'Fuel system',
    'Power Steering': 'Power steering',
    'Shocks and Struts': 'Shocks and struts',
    'Transmission Equipped': 'Transmission; if equipped with',
    'Windshield Washer': 'Windshield washer'
  },
  'Oil Life': {
    'Oil Life': 'Oil life monitor %'
  }
} as const
