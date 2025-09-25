'use client'

import { useState, useEffect } from 'react'
import { useInspection } from '@/contexts/InspectionContext'
import { useFeedback } from '@/contexts/FeedbackContext'
import { useAuth, User } from '@/contexts/AuthContext'
import { InspectionReport } from '@/types/inspection'
import { Feedback } from '@/types/feedback'

export default function DashboardGraphs() {
  const { inspections } = useInspection()
  const { feedbacks } = useFeedback()
  const [users, setUsers] = useState<User[]>([])
  const [localInspections, setLocalInspections] = useState<InspectionReport[]>([])
  const [localFeedbacks, setLocalFeedbacks] = useState<Feedback[]>([])

  // Load all data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load users
      const usersData = localStorage.getItem('mpvi-users')
      if (usersData) {
        try {
          const parsedUsers = JSON.parse(usersData)
          setUsers(parsedUsers)
        } catch (error) {
          console.error('Error parsing users data:', error)
        }
      }

      // Load inspections
      const inspectionsData = localStorage.getItem('mpvi-inspections')
      if (inspectionsData) {
        try {
          const parsedInspections = JSON.parse(inspectionsData)
          setLocalInspections(parsedInspections)
        } catch (error) {
          console.error('Error parsing inspections data:', error)
        }
      }

      // Load feedback
      const feedbackData = localStorage.getItem('mpvi-feedback')
      if (feedbackData) {
        try {
          const parsedFeedbacks = JSON.parse(feedbackData)
          setLocalFeedbacks(parsedFeedbacks)
        } catch (error) {
          console.error('Error parsing feedback data:', error)
        }
      }
    }
  }, [])

  // Use local data if available, otherwise fall back to context
  const actualInspections = localInspections.length > 0 ? localInspections : inspections
  const actualFeedbacks = localFeedbacks.length > 0 ? localFeedbacks : feedbacks

  // Calculate inspection statistics
  const inspectionStats = {
    total: actualInspections.length,
    thisMonth: actualInspections.filter(inspection => {
      const inspectionDate = new Date(inspection.createdAt)
      const now = new Date()
      return inspectionDate.getMonth() === now.getMonth() && inspectionDate.getFullYear() === now.getFullYear()
    }).length,
    thisWeek: actualInspections.filter(inspection => {
      const inspectionDate = new Date(inspection.createdAt)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return inspectionDate >= weekAgo
    }).length,
    avgScore: actualInspections.length > 0 ? Math.round(actualInspections.reduce((sum, inspection) => sum + inspection.overallScore, 0) / actualInspections.length) : 0
  }

  // Calculate feedback statistics
  const feedbackStats = {
    total: actualFeedbacks.length,
    unread: actualFeedbacks.filter(feedback => !feedback.isRead).length,
    thisMonth: actualFeedbacks.filter(feedback => {
      const feedbackDate = new Date(feedback.createdAt)
      const now = new Date()
      return feedbackDate.getMonth() === now.getMonth() && feedbackDate.getFullYear() === now.getFullYear()
    }).length,
    thisWeek: actualFeedbacks.filter(feedback => {
      const feedbackDate = new Date(feedback.createdAt)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return feedbackDate >= weekAgo
    }).length
  }

  // Calculate user statistics
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'Admin').length,
    techs: users.filter(u => u.role === 'Tech').length,
    advisors: users.filter(u => u.role === 'Advisor').length,
    customers: users.filter(u => u.role === 'Customer').length,
    thisMonth: users.filter(user => {
      if (!user.createdAt) return false
      const userDate = new Date(user.createdAt)
      const now = new Date()
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
    }).length
  }

  // Generate time series data for the last 30 days
  const generateTimeSeriesData = (data: (InspectionReport | User | Feedback)[], dateField: string) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        count: 0
      }
    })

    data.forEach(item => {
      // Check if the date field exists and is valid
      if (item[dateField]) {
        const dateObj = new Date(item[dateField])
        // Check if the date is valid
        if (!isNaN(dateObj.getTime())) {
          const itemDate = dateObj.toISOString().split('T')[0]
          const dayData = last30Days.find(d => d.date === itemDate)
          if (dayData) {
            dayData.count++
          }
        }
      }
    })

    return last30Days
  }

  const inspectionTimeSeries = generateTimeSeriesData(actualInspections, 'createdAt')
  const userTimeSeries = generateTimeSeriesData(users, 'createdAt')

  // Debug info

  // Show message if no data
  if (users.length === 0 && actualInspections.length === 0 && actualFeedbacks.length === 0) {
    return (
      <div className="backdrop-blur-md rounded-lg shadow-sm p-8 text-center" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
        <h3 className="text-xl font-semibold text-white mb-4">No Data Available</h3>
        <p className="text-gray-300 mb-4">
          To see the dashboard graphs, you need to seed some data first.
        </p>
        <p className="text-sm text-gray-400">
          Open the browser console and run: <code className="bg-gray-700 px-2 py-1 rounded">seedData()</code>
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Inspection Reports Graph */}
      <div className="backdrop-blur-md rounded-lg shadow-sm p-6" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Inspection Reports</h3>
          <div className="text-2xl">📊</div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{inspectionStats.total}</div>
              <div className="text-sm text-gray-300">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{inspectionStats.avgScore}%</div>
              <div className="text-sm text-gray-300">Avg Score</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">This Month</span>
              <span className="text-white font-medium">{inspectionStats.thisMonth}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">This Week</span>
              <span className="text-white font-medium">{inspectionStats.thisWeek}</span>
            </div>
          </div>

          {/* Line Chart */}
          <div className="mt-4">
            <div className="text-xs text-gray-400 mb-2">Daily Creation (Last 30 Days)</div>
            <div className="relative h-20">
              <svg className="w-full h-full" viewBox="0 0 300 80">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Line chart */}
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  points={inspectionTimeSeries.map((point, index) => {
                    const x = (index / (inspectionTimeSeries.length - 1)) * 300
                    const maxCount = Math.max(...inspectionTimeSeries.map(p => p.count), 1)
                    const y = 80 - (point.count / maxCount) * 60
                    return `${x},${y}`
                  }).join(' ')}
                />
                
                {/* Data points */}
                {inspectionTimeSeries.map((point, index) => {
                  const x = (index / (inspectionTimeSeries.length - 1)) * 300
                  const maxCount = Math.max(...inspectionTimeSeries.map(p => p.count), 1)
                  const y = 80 - (point.count / maxCount) * 60
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#3B82F6"
                      className="hover:r-3 transition-all cursor-pointer"
                      title={`${point.date}: ${point.count} reports`}
                    />
                  )
                })}
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Management Graph */}
      <div className="backdrop-blur-md rounded-lg shadow-sm p-6" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Feedback</h3>
          <div className="text-2xl">💬</div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{feedbackStats.total}</div>
              <div className="text-sm text-gray-300">Total Feedback</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{feedbackStats.unread}</div>
              <div className="text-sm text-gray-300">Unread</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">This Month</span>
              <span className="text-white font-medium">{feedbackStats.thisMonth}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">This Week</span>
              <span className="text-white font-medium">{feedbackStats.thisWeek}</span>
            </div>
          </div>

          {/* Feedback Status Chart */}
          <div className="mt-4">
            <div className="text-xs text-gray-400 mb-2">Feedback Status</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Read</span>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${feedbackStats.total > 0 ? ((feedbackStats.total - feedbackStats.unread) / feedbackStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-white">{feedbackStats.total - feedbackStats.unread}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Unread</span>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${feedbackStats.total > 0 ? (feedbackStats.unread / feedbackStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-white">{feedbackStats.unread}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Graph */}
      <div className="backdrop-blur-md rounded-lg shadow-sm p-6" style={{ backgroundColor: 'rgba(75, 75, 75, 0.4)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Users</h3>
          <div className="text-2xl">👥</div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{userStats.total}</div>
              <div className="text-sm text-gray-300">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{userStats.thisMonth}</div>
              <div className="text-sm text-gray-300">New This Month</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Admins</span>
              <span className="text-white font-medium">{userStats.admins}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Techs</span>
              <span className="text-white font-medium">{userStats.techs}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Advisors</span>
              <span className="text-white font-medium">{userStats.advisors}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Customers</span>
              <span className="text-white font-medium">{userStats.customers}</span>
            </div>
          </div>

          {/* Line Chart */}
          <div className="mt-4">
            <div className="text-xs text-gray-400 mb-2">Daily Registration (Last 30 Days)</div>
            <div className="relative h-20">
              <svg className="w-full h-full" viewBox="0 0 300 80">
                {/* Grid lines */}
                <defs>
                  <pattern id="userGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#userGrid)" />
                
                {/* Line chart */}
                <polyline
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2"
                  points={userTimeSeries.map((point, index) => {
                    const x = (index / (userTimeSeries.length - 1)) * 300
                    const maxCount = Math.max(...userTimeSeries.map(p => p.count), 1)
                    const y = 80 - (point.count / maxCount) * 60
                    return `${x},${y}`
                  }).join(' ')}
                />
                
                {/* Data points */}
                {userTimeSeries.map((point, index) => {
                  const x = (index / (userTimeSeries.length - 1)) * 300
                  const maxCount = Math.max(...userTimeSeries.map(p => p.count), 1)
                  const y = 80 - (point.count / maxCount) * 60
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#06B6D4"
                      className="hover:r-3 transition-all cursor-pointer"
                      title={`${point.date}: ${point.count} users`}
                    />
                  )
                })}
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Role Distribution Chart */}
          <div className="mt-4">
            <div className="text-xs text-gray-400 mb-2">Role Distribution</div>
            <div className="space-y-2">
              {[
                { role: 'Admin', count: userStats.admins, color: 'bg-red-500' },
                { role: 'Tech', count: userStats.techs, color: 'bg-blue-500' },
                { role: 'Advisor', count: userStats.advisors, color: 'bg-green-500' },
                { role: 'Customer', count: userStats.customers, color: 'bg-gray-500' }
              ].map(({ role, count, color }) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{role}</span>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`${color} h-2 rounded-full`}
                        style={{ width: `${userStats.total > 0 ? (count / userStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
