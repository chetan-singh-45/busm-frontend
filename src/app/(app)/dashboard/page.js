'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import { useWatchlist } from '@/hooks/watchlist'
import { useDashboard } from '@/hooks/dashboard'
import toast, { Toaster } from 'react-hot-toast'
import { Bell, Building, CandlestickChart, User } from 'lucide-react'
import StockTable from '@/components/StockTable'

const Dashboard = () => {
  const { user } = useAuth()
  const { watchlist, isLoading, isError, handleRemoveWatchlist, handleAddWatchlist } = useWatchlist()
  const { stats, isLoading: loadingStats } = useDashboard()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [loadingStock, setLoadingStock] = useState(null) 

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

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load watchlist')
    }
  }, [isError])

  return (
    <>
      <Header title="Dashboard" />
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

      {/* Watchlist Table */}
      <StockTable
        stocks={watchlist} // you can change to all stocks if needed
        watchlist={watchlist}
        isLoading={isLoading}
        isError={isError}
        handleToggleWatchlist={handleToggleWatchlist}
        loadingStock={loadingStock}
      />
    </>
  )
}

export default Dashboard
