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
    isEV: boolean
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

export const INSPECTION_CATEGORIES_ICE = [
  'Fluid Levels',
  'Tires',
  'Breaks',
  'Oil Life',
  'Battery',
  'Windshield',
  'Additional Checks'
] as const

export const INSPECTION_CATEGORIES_EV = [
  'Fluid Levels',
  'Tires',
  'Breaks',
  'Battery',
  'Windshield',
  'Additional Checks'
] as const

export const INSPECTION_ITEMS_ICE: Record<string, string[]> = {
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
    'Steering Components',
    'Exterior Lights'
  ],
  'Fluid Levels': [
    'Brake Fluid',
    'Diesel Exhaust',
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
    'LF',
    'LR',
    'RF',
    'RR'
  ],
  'Breaks': [
    'Brake system',
    'Driver Rear Linings',
    'Passenger Rear Linings',
    'Driver Front Linings',
    'Passenger Front Linings',
    'Parking Brake Linings'
  ],
  'Oil Life': [
    'Oil Life',
    'Engine Oil'
  ],
  'Battery': [
    'Battery Cables and Connections',
    'Battery Test Results',
    'Battery Visual Inspection'
  ],
  'Windshield': [
    'Windshield Condition',
    'Wipers Driver Front',
    'Wipers Rear',
    'Wipers Passenger front'
  ]
} as const

export const INSPECTION_ITEMS_EV: Record<string, string[]> = {
  'Additional Checks': [
    'Accelerator Pedal',
    'Axle Boots',
    'Backup Camera',
    'Charging Port Connector',
    'Charging Port Seal',
    'Drive Floor Mat',
    'Gas Struts',
    'Horn',
    'Passenger Air Filter',
    'Pedestrian Safety Signal',
    'Safety Belts',
    'Steering Components',
    'Exterior Lights'
  ],
  'Fluid Levels': [
    'Brake Fluid',
    'Diesel Exhaust',
    'Drive Axle',
    'Drive Unit',
    'Transfer Case',
    'EV Cooling System',
    'Shocks and Struts',
    'Windshield Washer'
  ],
  'Tires': [
    'Alignment',
    'Balance',
    'Rotation',
    'LF',
    'LR',
    'RF',
    'RR'
  ],
  'Breaks': [
    'Brake system',
    'Driver Front Linings',
    'Driver Rear Linings',
    'Passenger Front Linings',
    'Passenger Rear Linings',
    'Parking Brake Linings'
  ],
  'Battery': [
    'Battery Cables',
    'Battery Test Results',
    'Battery Visual Inspection'
  ],
  'Windshield': [
    'Windshield Condition',
    'Wipers Center Front',
    'Wipers Driver Front',
    'Wipers Rear',
    'Wipers Passenger front'
  ]
} as const

export const INSPECTION_ITEM_DESCRIPTIONS_ICE: Record<string, Record<string, string>> = {
  'Additional Checks': {
    'Accelerator Pedal': 'Accelerator pedal high effort or damage',
    'Belts': 'Belts: engine, accessory, serpentine and/or v-drive',
    'Chassis Lubrication': 'Chassis components lubrication',
    'Drive Axle': 'CV drive axle boots or driveshafts & U-joints',
    'Drive Floor Mat': 'Check that floor mats do not interfere with pedals, are the correct size, and are secured properly',
    'Gas Struts': 'Gas struts on hood or lift gate for wear & hold open ability',
    'Hoses': 'Hoses: engine, power steering and HVAC',
    'Ignition Control': 'Ignition lock cylinder operation',
    'Passenger Air Filter': 'Passenger compartment air filter',
    'Safety Belts': 'Safety belts, buckles, latch plates, retractors & anchors',
    'Starter Switch': 'Starter switch operation',
    'Steering Components': 'Steering components and steering linkage'
  },
  'Fluid Levels': {
    'Brake Fluid': 'Brake fluid reservoir',
    'Diesel Exhaust': 'Diesel exhaust fluid',
    'Drive Axle': 'Drive axle',
    'Transfer Case': 'Transfer case',
    'Engine Cooling System': 'Engine cooling system',
    'Engine Oil': 'Engine oil',
    'Fuel System': 'Fuel system',
    'Power Steering': 'Power steering',
    'Shocks and Struts': 'Shocks and struts',
    'Transmission Equipped': 'Transmission; if equipped with dipstick',
    'Windshield Washer': 'Windshield washer'
  },
  'Tires': {
    'LF': 'Driver Front',
    'LR': 'Driver Rear',
    'RF': 'Passenger Front',
    'RR': 'Passenger Rear'
  },
  'Oil Life': {
    'Oil Life': 'Oil life monitor %'
  }
} as const

export const INSPECTION_ITEM_DESCRIPTIONS_EV: Record<string, Record<string, string>> = {
  'Additional Checks': {
    'Accelerator Pedal': 'Accelerator pedal high effort or damage',
    'Drive Floor Mat': 'Check that floor mats do not interfere with pedals, are the correct size, and are secured properly',
    'Gas Struts': 'Gas struts on hood or lift gate for wear & hold open ability',
    'Passenger Air Filter': 'Passenger compartment air filter',
    'Safety Belts': 'Safety belts, buckles, latch plates, retractors & anchors',
    'Steering Components': 'Steering components and steering linkage'
  },
  'Fluid Levels': {
    'Brake Fluid': 'Brake fluid reservoir',
    'Diesel Exhaust': 'Diesel exhaust fluid',
    'Drive Axle': 'Drive axle',
    'Transfer Case': 'Transfer case',
    'EV Cooling System': 'EV cooling system',
    'Shocks and Struts': 'Shocks and struts',
    'Windshield Washer': 'Windshield washer'
  },
  'Tires': {
    'Alignment': 'Alignment needed',
    'Balance': 'Balance needed',
    'Rotation': 'Rotation needed',
    'LF': 'Driver front',
    'LR': 'Driver rear',
    'RF': 'Passenger front',
    'RR': 'Passenger rear'
  }
} as const
