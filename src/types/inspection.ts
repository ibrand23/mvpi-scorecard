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
  status: 'Draft' | 'Completed' | 'Reviewed'
}

export interface InspectionItem {
  id: string
  category: string
  item: string
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Needs Attention'
  notes: string
  score: number // 1-5 scale
}

export const INSPECTION_CATEGORIES = [
  'Exterior',
  'Interior', 
  'Engine',
  'Transmission',
  'Brakes',
  'Suspension',
  'Electrical',
  'Tires',
  'Lights',
  'Safety Equipment'
] as const

export const INSPECTION_ITEMS: Record<string, string[]> = {
  'Exterior': [
    'Paint Condition',
    'Body Damage',
    'Rust/Corrosion',
    'Glass Condition',
    'Mirrors',
    'Bumpers',
    'Trim & Molding'
  ],
  'Interior': [
    'Seats & Upholstery',
    'Dashboard',
    'Carpet/Flooring',
    'Door Panels',
    'Headliner',
    'Steering Wheel',
    'Center Console'
  ],
  'Engine': [
    'Engine Oil',
    'Coolant Level',
    'Battery Condition',
    'Belts & Hoses',
    'Air Filter',
    'Engine Mounts',
    'Fluid Leaks'
  ],
  'Transmission': [
    'Transmission Fluid',
    'Shifting Quality',
    'Clutch (if manual)',
    'Transmission Mounts',
    'Drive Shaft',
    'Differential'
  ],
  'Brakes': [
    'Brake Pads',
    'Brake Rotors',
    'Brake Lines',
    'Brake Fluid',
    'Parking Brake',
    'ABS System'
  ],
  'Suspension': [
    'Shocks/Struts',
    'Springs',
    'Control Arms',
    'Ball Joints',
    'Tie Rods',
    'Sway Bars'
  ],
  'Electrical': [
    'Battery',
    'Alternator',
    'Starter',
    'Lights',
    'Radio/Stereo',
    'Power Windows',
    'Power Locks'
  ],
  'Tires': [
    'Tire Condition',
    'Tire Pressure',
    'Tire Tread Depth',
    'Wheel Condition',
    'Spare Tire',
    'Tire Alignment'
  ],
  'Lights': [
    'Headlights',
    'Taillights',
    'Turn Signals',
    'Brake Lights',
    'Hazard Lights',
    'Fog Lights'
  ],
  'Safety Equipment': [
    'Seat Belts',
    'Airbags',
    'Child Safety Locks',
    'Emergency Kit',
    'First Aid Kit',
    'Fire Extinguisher'
  ]
} as const
