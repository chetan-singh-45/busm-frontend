'use client'

import { useState, useEffect } from 'react'
import {
  Bell, Calendar, User, UserPlus, Globe, TrendingUp,
  BarChart2, Map, Clock, MessageCircle
} from 'lucide-react'
import InsightCard from '@/components/InsightCard'
import { useAuth } from '@/hooks/auth'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import StockTable from '@/components/StockTable'
import Notification from '@/components/Notification'
import { getRecentNotifications, notificationStats } from '@/services/stats'
import { useWatchlist } from '@/hooks/watchlist'
import toast, { Toaster } from 'react-hot-toast'
import Header from '@/app/(app)/Header'
import PageSkeleton from '@/components/skeletons/PageSkeleton'
import CardSkeleton from '@/components/skeletons/CardSkeleton'
import { useDashboard } from '@/hooks/dashboard'
import { getActiveUsers, getWeeklyUsers } from '@/services/dashboard'


const AdminDashboard = () => {
  const { user } = useAuth()
  const [loadingStock, setLoadingStock] = useState(null)
  const { watchlist, isLoading, isError, handleRemoveWatchlist, handleAddWatchlist } = useWatchlist()
  const [showSkeleton, setShowSkeleton] = useState(true)
  const { stats, isLoading: loadingStats } = useDashboard()
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dauWauData, setdauWauData] = useState(null)

  // Platform Summary KPI's
  const total_notifications = stats?.stock_events_count || 0;
  const notification_24h = stats?.notification_24h || 0
  const total_users = stats?.users_count || 0;
  const new_user_7d = stats?.newUsers_7d || 0;
  const countriesMonitored = stats?.totalUniqueCountries || 0;
  const indices_traked = stats?.indices_traked || 0
  const onboard = stats?.onboarding_change_percent || 0

  //User Behavior Insights
  const most_popular_index = stats?.top_index || 'No Data'
  const most_used_indicator = userStats?.most_active_indicator?.indicator_name || 'No Data'
  const topCountry = stats?.topCountry?.country_name || 'No Data';
  const activeTimeSlot = stats?.topHour?.time_range || 'No Data'
  const topUsers = stats?.topUsers || []

  //User Growth & Retention
  const formattedAvg = stats?.formattedAvg || 0

  useEffect(() => {
    if (user && watchlist?.length >= 0) {
      const savedItems = JSON.parse(localStorage.getItem('pendingWatchlist') || '[]')
      const filtered = savedItems.filter(item =>
        !watchlist.some(w => w.stock_id === item.id)
      )

      if (filtered.length > 0) {
        localStorage.removeItem('pendingWatchlist')
        Promise.all(filtered.map(item => handleAddWatchlist({ stock_id: item.id })))
          .then(() => {
            toast.success('Index added to your watchlist.')
          })
          .catch(() => {
            toast.error('Failed to sync some watchlist items.')
          })
      }
    }
  }, [user, watchlist])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await notificationStats()
        const active_users = await getActiveUsers()
        const weekly_users = await getWeeklyUsers()
        setdauWauData(weekly_users?.data)

        setUserStats(res?.data?.data[0])
      } catch (error) {
        console.error('Failed to load user stats', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (showSkeleton) return (<>
    <PageSkeleton />
    <CardSkeleton />
  </>)

  const handleToggleWatchlist = async (stock) => {
    if (!user) return toast.error('Login required')
    setLoadingStock(stock.symbol)

    try {
      const existing = watchlist.find(w => w.stock_id === stock.id)
      if (existing) {
        await handleRemoveWatchlist(existing.id)
        toast.success(`${stock.name} removed`)
      } else {
        await handleAddWatchlist({ stock_id: stock.id })
        toast.success(`${stock.name} added`)
      }
    } catch (error) {
      toast.error('Error updating watchlist')
    } finally {
      setLoadingStock(null)
    }
  }

  const kpiData = [
    { icon: <Bell className="w-6 h-6 text-green-500" />, title: "Total Notifications Sent", value: total_notifications },
    { icon: <Calendar className="w-6 h-6 text-green-500" />, title: "Notifications (24h)", value: notification_24h },
    { icon: <User className="w-6 h-6 text-green-500" />, title: "Registered Users", value: total_users },
    { icon: <UserPlus className="w-6 h-6 text-green-500" />, title: "New Users (7d)", value: new_user_7d },
    { icon: <Globe className="w-6 h-6 text-green-500" />, title: "Countries Monitored", value: countriesMonitored },
    { icon: <TrendingUp className="w-6 h-6 text-green-500" />, title: "Indices Tracked", value: indices_traked },
    { icon: <Clock className="w-6 h-6 text-green-500" />, title: "Onboarding", value: onboard },
  ]

  const behaviorInsights = [
    { icon: <TrendingUp className="w-6 h-6 text-green-500" />, title: "Most Popular Index", value: most_popular_index },
    { icon: <BarChart2 className="w-6 h-6 text-green-500" />, title: "Most Used Indicator", value: most_used_indicator },
    { icon: <Map className="w-6 h-6 text-green-500" />, title: "Most Watched Country", value: topCountry },
    { icon: <Clock className="w-6 h-6 text-green-500" />, title: "Active Time Slot", value: activeTimeSlot },
    { icon: <MessageCircle className="w-6 h-6 text-green-500" />, title: "Average Watchlist Size", value: formattedAvg },
  ]

  if (user?.role != 1) return <h1 className="p-6 text-lg font-semibold">Not authorized</h1>

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header title="Dashboard Overview" subtitle="Track performance and engagement" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiData.map((item, idx) => <InsightCard key={idx} {...item} />)}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">User Behavior Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {behaviorInsights.map((item, idx) => <InsightCard key={idx} {...item} />)}
          </div>
        </div>

        {/* Top Engaged Users Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Engaged Users</h2>
          {topUsers.length === 0 ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <ResponsiveContainer width="80%" height={Math.max(topUsers.length * 50, 100)}>
              {/* BarChart goes here */}
              <BarChart
                data={topUsers}
                layout="vertical"
                margin={{ top: 30, right: 20, left: 100, bottom: 20 }}
                barSize={20}
              >
                {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 13, fill: "#374151" }}
                  width={150}
                />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ fontSize: '14px', borderRadius: '8px' }}
                />
                <Bar dataKey="event_logs_count" name="Total Events" fill="#10B981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-medium mb-3">DAU Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dauWauData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="dau" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-medium mb-3">WAU Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dauWauData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="wau" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Notification
            title="Recent Notifications"
            fetchNotifications={getRecentNotifications}
          />
          <StockTable
            title="My Watchlist"
            stocks={watchlist}
            watchlist={watchlist}
            isLoading={isLoading}
            isError={isError}
            handleToggleWatchlist={handleToggleWatchlist}
            loadingStock={loadingStock}
          />
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
