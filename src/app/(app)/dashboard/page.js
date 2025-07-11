'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import { useWatchlist } from '@/hooks/watchlist'
import { useDashboard } from '@/hooks/dashboard'
import toast, { Toaster } from 'react-hot-toast'
import { Bell, Building, CandlestickChart, User, TrendingUp, BellRing } from 'lucide-react'
import StockTable from '@/components/StockTable'
import Notification from '@/components/Notification'
import { getRecentNotifications, notificationStats } from '@/services/stats';
import { useRouter } from 'next/navigation'

const Dashboard = () => {
  const { user } = useAuth()
  const { watchlist, isLoading, isError, handleRemoveWatchlist, handleAddWatchlist } = useWatchlist()
  const { stats, isLoading: loadingStats } = useDashboard()
  const [loadingStock, setLoadingStock] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBanner, setShowBanner] = useState(true)
  const router = useRouter()
  // const [searchQuery, setSearchQuery] = useState('')
  // const [selectedCountry, setSelectedCountry] = useState('all')
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await notificationStats()
        setUserStats(res?.data?.data[0])
      } catch (error) {
        console.error('Failed to load user stats', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleToggleWatchlist = async (stock) => {
    if (!user) {
      toast.error('You must be logged in to manage watchlist')
      return
    }

    setLoadingStock(stock.symbol)

    try {
      const existingEntry = watchlist.find((w) => w.stock_id === stock.id)

      if (existingEntry) {
        await handleRemoveWatchlist(existingEntry.id)
        toast.success(`${stock.name} removed from watchlist`)
      } else {
        await handleAddWatchlist({ stock_id: stock.id })
        toast.success(`${stock.name} added to watchlist`)
      }
    } catch (error) {
      toast.error('Watchlist operation failed')
      console.error(error)
    } finally {
      setLoadingStock(null)
    }
  }

  // useEffect(() => {
  //   if (isError) {
  //     toast.error('Failed to load watchlist')
  //   }
  // }, [isError])

  return (
    <>
      <Header title="Dashboard" />
      {/* Last visit banner */}
      {showBanner && stats?.new_notifications?.length > 0 && (
      <div className="fixed top-6 right-6 z-50 bg-blue-50 border border-blue-300 text-blue-800 px-12 py-2 rounded-lg shadow-md flex items-center space-x-3 max-w-sm w-full">            <BellRing className="w-5 h-5 text-green-600" />
              <span className="text-sm">
                {stats.new_notifications.length} new alert
                {stats.new_notifications.length > 1 ? 's' : ''} since last visit.
                <button
                  onClick={() => {
                    setShowBanner(false)
                    router.push('/notifications')
                  }}
                  className="ml-2 underline text-blue-700 hover:text-blue-900"
                >
                  view
                </button>
              </span>
              <button
                onClick={() => setShowBanner(false)}
                className="text-blue-700 hover:text-blue-900 text-lg font-semibold"
                aria-label="Dismiss"
              >
                &times;
              </button>
            </div>
          )}

      <Toaster position="top-right" />
      {/* Admin Stats */}
      {user?.role == 1 && (
        <div className="bg-gray-50 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loadingStats ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Total Exchanges</h3>
                    <p className="text-2xl font-semibold text-gray-800">{stats?.exchanges_count}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Total Users</h3>
                    <p className="text-2xl font-semibold text-gray-800">{stats?.users_count}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Total Alerts</h3>
                    <p className="text-2xl font-semibold text-gray-800">{stats?.stock_events_count}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <CandlestickChart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Total Stocks</h3>
                    <p className="text-2xl font-semibold text-gray-800">{stats?.stocks_count}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {user && (
        <div className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Trading Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loadingStats ? (
                // Skeleton loading state
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow animate-pulse flex flex-col"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))
              ) : (
                <>
                  {/* Total Alerts */}
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Total Alerts</span>
                      <Bell className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-3">
                      {userStats?.last_7_days_alert_count || 0}
                    </p>
                    <span className="text-xs text-gray-400 mt-1">Last 7 days</span>
                  </div>

                  {/* Most Active Indicator */}
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Most Active Tool</span>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">{userStats?.most_active_indicator?.indicator_name || 'None'}</span>
                        <span className="text-sm font-medium text-gray-800"> {userStats?.most_active_indicator?.usage_count || 0} alerts</span>
                      </div>
                    </div>
                  </div>
                  {/* Top Triggered Stocks */}
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Top Triggered Index</span>
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="mt-3 space-y-2">
                      {userStats?.top_stocks?.length ? (
                        userStats.top_stocks.map((stock, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">{stock.name}</span>
                            <span className="text-sm font-medium text-gray-800">{stock.count} alerts</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No Index triggered</span>
                      )}
                    </div>
                  </div>

                  {/* Direction Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Direction Summary:</span>
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="mt-3 space-y-2">
                      {userStats?.direction?.length ? (
                        userStats.direction.map((stock, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">{stock.prediction}</span>
                            <span className="text-sm font-medium text-gray-800">{stock.count} alerts</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No Index triggered</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

       <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-3 p-4">
        {/* Notification Section */}
        <div>
          <Notification title="Recent Notifications" fetchNotifications={getRecentNotifications} />
        </div>

        {/* Watchlist Section */}
        <div>
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

export default Dashboard
