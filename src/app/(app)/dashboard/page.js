'use client'

import { useEffect } from 'react'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import { useWatchlist } from '@/hooks/watchlist'
import { useDashboard } from '@/hooks/dashboard'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { Bell, Building, CandlestickChart, User } from 'lucide-react'
import { ConfirmDelete } from '@/components/ConfirmDelete'

const Dashboard = () => {
  const { user } = useAuth()
  const { watchlist, isLoading, isError, handleRemoveWatchlist } = useWatchlist()
  const { stats, isLoading: loadingStats } = useDashboard()

  const userWatchlist = watchlist?.filter(stock => stock.user_id === user?.id)

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load watchlist')
    }
  }, [isError])

  const formatNumber = (num) =>
    num ? Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'

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
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Watchlist</h2>

            {isLoading ? (
              <p>Loading...</p>
            ) : userWatchlist?.length === 0 ? (
              <p className="text-gray-500">No stocks in your watchlist.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                  <thead className="bg-gray-100 text-gray-700 uppercase">
                    <tr>
                      <th className="px-4 py-2">Symbol</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Change</th>
                      <th className="px-4 py-2">Volume</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userWatchlist.map(stock => {
                      const symbol = stock.stock_symbol?.toUpperCase()
                      const intraday = stock.intraday
                      const eod = stock.eod?.[0]
                      const lastPrice = stock.isMarketOpen ? intraday?.price : eod?.close
                      const percentChange = intraday?.percentage_day
                      const priceChange = intraday?.price_change_day
                      const priceColor = percentChange >= 0 ? 'text-green-600' : 'text-red-500'

                      return (
                        <tr key={stock.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{symbol}</td>
                          <td className="px-4 py-2">
                            <Link
                              href={`/overview/${symbol}`}
                              className="text-blue-600 hover:underline font-medium"
                            >
                            {stock.stock_name}
                            </Link>
                          </td>
                          <td className="px-4 py-2">{formatNumber(lastPrice)}</td>
                          <td className={`px-4 py-2 ${priceColor}`}>
                            {percentChange ? `${percentChange} (${priceChange})` : '-'}
                          </td>
                          <td className="px-4 py-2">{formatNumber(eod?.volume)}</td>
                          <td className="px-4 py-2">
                          <button
                              onClick={() =>
                                ConfirmDelete(() => handleRemoveWatchlist(stock.id))
                              }
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                              Remove
                          </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
