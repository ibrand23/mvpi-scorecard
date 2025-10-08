export interface VisitorData {
  id: string
  timestamp: string
  userAgent: string
  referrer: string
  sessionId: string
  isNewVisitor: boolean
  userId?: string
}

export interface VisitorStats {
  totalVisitors: number
  uniqueVisitors: number
  newVisitors: number
  returningVisitors: number
  visitorsToday: number
  visitorsThisWeek: number
  visitorsThisMonth: number
  dailyVisitors: { date: string; count: number }[]
  hourlyVisitors: { hour: number; count: number }[]
}

const VISITOR_STORAGE_KEY = 'mpvi-visitors'
const SESSION_STORAGE_KEY = 'mpvi-session-id'

export class VisitorTracker {
  private static instance: VisitorTracker
  private visitors: VisitorData[] = []
  private sessionId: string

  private constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.loadVisitors()
  }

  public static getInstance(): VisitorTracker {
    if (!VisitorTracker.instance) {
      VisitorTracker.instance = new VisitorTracker()
    }
    return VisitorTracker.instance
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return ''
    
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!sessionId) {
      sessionId = this.generateSessionId()
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId)
    }
    return sessionId
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private loadVisitors(): void {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(VISITOR_STORAGE_KEY)
      if (stored) {
        this.visitors = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading visitor data:', error)
      this.visitors = []
    }
  }

  private saveVisitors(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(this.visitors))
    } catch (error) {
      console.error('Error saving visitor data:', error)
    }
  }

  public trackVisit(userId?: string): void {
    if (typeof window === 'undefined') return

    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    // Check if this session has already been tracked today
    const todayVisits = this.visitors.filter(v => 
      v.sessionId === this.sessionId && 
      v.timestamp.startsWith(today)
    )
    
    if (todayVisits.length > 0) {
      return // Already tracked this session today
    }

    // Check if this is a new visitor (no previous visits)
    const isNewVisitor = !this.visitors.some(v => v.sessionId === this.sessionId)

    const visitorData: VisitorData = {
      id: `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: now.toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      sessionId: this.sessionId,
      isNewVisitor,
      userId
    }

    this.visitors.push(visitorData)
    this.saveVisitors()
  }

  public getVisitorStats(): VisitorStats {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get unique visitors by session ID
    const uniqueSessions = new Set(this.visitors.map(v => v.sessionId))
    const uniqueVisitors = uniqueSessions.size

    // Get new visitors
    const newVisitors = this.visitors.filter(v => v.isNewVisitor).length

    // Get returning visitors
    const returningVisitors = uniqueVisitors - newVisitors

    // Get visitors today
    const visitorsToday = this.visitors.filter(v => 
      v.timestamp.startsWith(today)
    ).length

    // Get visitors this week
    const visitorsThisWeek = this.visitors.filter(v => 
      new Date(v.timestamp) >= weekAgo
    ).length

    // Get visitors this month
    const visitorsThisMonth = this.visitors.filter(v => 
      new Date(v.timestamp) >= monthAgo
    ).length

    // Generate daily visitors data for last 30 days
    const dailyVisitors = this.generateDailyVisitorsData()

    // Generate hourly visitors data for today
    const hourlyVisitors = this.generateHourlyVisitorsData()

    return {
      totalVisitors: this.visitors.length,
      uniqueVisitors,
      newVisitors,
      returningVisitors,
      visitorsToday,
      visitorsThisWeek,
      visitorsThisMonth,
      dailyVisitors,
      hourlyVisitors
    }
  }

  private generateDailyVisitorsData(): { date: string; count: number }[] {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        count: 0
      }
    })

    // Count unique visitors per day
    const dailySessions = new Map<string, Set<string>>()
    
    this.visitors.forEach(visitor => {
      const date = visitor.timestamp.split('T')[0]
      if (!dailySessions.has(date)) {
        dailySessions.set(date, new Set())
      }
      dailySessions.get(date)!.add(visitor.sessionId)
    })

    last30Days.forEach(day => {
      const sessions = dailySessions.get(day.date)
      if (sessions) {
        day.count = sessions.size
      }
    })

    return last30Days
  }

  private generateHourlyVisitorsData(): { hour: number; count: number }[] {
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0
    }))

    const today = new Date().toISOString().split('T')[0]
    const todayVisitors = this.visitors.filter(v => v.timestamp.startsWith(today))
    
    const hourlySessions = new Map<number, Set<string>>()
    
    todayVisitors.forEach(visitor => {
      const hour = new Date(visitor.timestamp).getHours()
      if (!hourlySessions.has(hour)) {
        hourlySessions.set(hour, new Set())
      }
      hourlySessions.get(hour)!.add(visitor.sessionId)
    })

    hourlyData.forEach(hourData => {
      const sessions = hourlySessions.get(hourData.hour)
      if (sessions) {
        hourData.count = sessions.size
      }
    })

    return hourlyData
  }

  public clearVisitorData(): void {
    this.visitors = []
    this.saveVisitors()
  }

  public exportVisitorData(): VisitorData[] {
    return [...this.visitors]
  }
}

// Export a singleton instance
export const visitorTracker = VisitorTracker.getInstance()
