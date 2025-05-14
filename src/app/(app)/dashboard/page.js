'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import { useWatchlist } from '@/hooks/watchlist'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingDown, TrendingUp, Bell, Building, CandlestickChart } from 'lucide-react'
import { getNotificationCount, getStocksCount, getExchangesCount } from '@/services/dashboard'
const Dashboard = () => {
  const { user } = useAuth() // Get user from useAuth hook
  const { watchlist, isLoading, isError, handleRemoveWatchlist } = useWatchlist()
  const [notificationCount, setNotificationCount] = useState(0)
  const [stocksCount, setStocksCount] = useState(0)
  const [exchangesCount, setExchangesCount] = useState(0)

  useEffect(() => {
    getNotificationCount()
      .then(response => {
        setNotificationCount(response.data.data || 0)
      })
      .catch(error => {
        console.error('Notification Error:', error)
      })

    getStocksCount()
      .then(response => {
        setStocksCount(response.data.data || 0)
      })
      .catch(error => {
        console.error('Stocks Error:', error)
      })

    getExchangesCount()
      .then(response => {
        setExchangesCount(response.data.data || 0)
      })
      .catch(error => {
        console.error('Exchanges Error:', error)
      })
  }, [])

  // Filter watchlist based on user ID
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
      {user?.role == 1 &&
        <div className="bg-white px-6 py-4 rounded-xl shadow mb-2 mt-2 border-sky-500">
          <div className="flex flex-wrap items-center justify-between text-sm sm:text-base font-medium text-gray-700 gap-6">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky-500" />
              <span>Notification Sent: {notificationCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <CandlestickChart className="w-5 h-5 text-sky-500" />
              <span>Supported Stocks: {stocksCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-500" />
              <span>Supported Exchanges: {exchangesCount}</span>
            </div>
          </div>
        </div>}


      <div className="py-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow animate-pulse h-[250px]"
                />
              ))
            ) : Array.isArray(userWatchlist) && userWatchlist.length > 0 ? (
              userWatchlist.map((stock) => {
                const symbol = stock.stock_symbol?.toUpperCase()
                const intradayData = stock.intraday || []
                const eod = stock.eod?.[0]
                // const prevEod = stock.eod?.[1]
                // const isMarketOpen = stock.isMarketOpen
                const intraday = stock.intraday?.[stock.intraday.length - 1]

                const lastClose = stock?.intraday?.[stock.intraday.length - 1]?.marketstack_last || stock?.eod?.[0]?.close;
                const previousClose = stock?.eod?.[1]?.close;
                const priceChange = (lastClose - previousClose).toFixed(2);
                const percentChange = ((priceChange / previousClose) * 100).toFixed(2);
                const intradayFormatted = intradayData.map((item) => ({
                  ...item,
                  time: new Date(item.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                }))

                // const priceChange =
                //   eod && prevEod ? ((eod.close - prevEod.close) / eod.close) * 100 : null

                const priceColor =
                  percentChange >= 0 ? 'text-green-600' : 'text-red-500'

                const PriceIcon = percentChange >= 0 ? TrendingUp : TrendingDown

                return (
                  <div
                    key={stock.id}
                    className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition flex flex-col justify-between">
                    <Link href={`/overview/${stock.stock_symbol}`} className="flex-1">
                      <div className="cursor-pointer">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h2 className="text-lg font-semibold">{stock.stock_name}</h2>
                            <p className="text-sm text-gray-400">{symbol}</p>
                          </div>
                          {percentChange !== null && (
                            <div className={`flex items-center gap-1 ${priceColor}`}>
                              <PriceIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {percentChange}%
                              </span>
                            </div>
                          )}
                        </div>

                        {intraday && (
                          <>
                            <p className="text-sm text-gray-400">Market Price</p>
                            <p className="text-3xl font-bold mb-2">
                              ${formatNumber(intraday.close)}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <p>
                                <span className="font-medium">Open:</span>{' '}
                                ${formatNumber(intraday.open)}
                              </p>
                              <p>
                                <span className="font-medium">High:</span>{' '}
                                ${formatNumber(intraday.high)}
                              </p>
                              <p>
                                <span className="font-medium">Low:</span>{' '}
                                ${formatNumber(intraday.low)}
                              </p>
                              <p>
                                <span className="font-medium">Volume:</span>{' '}
                                {formatNumber(intraday.volume)}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </Link>

                    {/* Chart stays OUTSIDE the Link so it's not clickable */}
                    {intradayFormatted.length > 0 && (
                      <div
                        className="mt-4 h-[120px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={intradayFormatted}>
                            <XAxis dataKey="time" fontSize={10} />
                            <YAxis fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} hide />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                fontSize: 12,
                              }}
                              labelFormatter={(label) => `Time: ${label}`}
                              formatter={(value) => [`$${value.toFixed(2)}`, 'Close']}
                            />
                            <Line
                              type="monotone"
                              dataKey="low"
                              stroke="#3b82f6"
                              strokeWidth={2.5}
                              dot={false}
                              animationDuration={300}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Remove from Watchlist button */}
                    <div className="mt-4">
                      <button
                        onClick={() =>
                          handleRemoveWatchlist(stock.id)
                            .then(() => toast.success(`${symbol} removed from Watchlist`))
                            .catch((err) => toast.error(err))
                        }
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                      >
                        Remove from Watchlist
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-600 text-center col-span-full">
                {userWatchlist?.length === 0 ? 'No data available.' : 'Loading...'}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
