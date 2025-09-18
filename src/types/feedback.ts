export interface Feedback {
  id: string
  text: string
  areas: string[]
  status: 'pending' | 'reviewed'
  createdAt: string
  userId?: string
  userName?: string
  userEmail?: string
}

export const FEEDBACK_AREAS = [
  'General Feedback',
  'Login/Authentication',
  'Dashboard',
  'Inspection Reports List',
  'Create Inspection Report',
  'Edit Inspection Report',
  'View Inspection Report',
  'User Profile',
  'Admin Functions',
  'Navigation',
  'Performance',
  'UI/UX Design',
  'Bug Report',
  'Feature Request'
] as const

export type FeedbackArea = typeof FEEDBACK_AREAS[number]
