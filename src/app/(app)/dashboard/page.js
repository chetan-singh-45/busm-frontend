'use client'

import { useEffect } from 'react'
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
import { TrendingDown, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { watchlist, isLoading, isError, handleRemoveWatchlist } = useWatchlist()

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

      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow animate-pulse h-[250px]"
                />
              ))
            ) : Array.isArray(watchlist) && watchlist.length > 0 ? (
                  watchlist.map((stock) => {
                    const symbol = stock.stock_symbol?.toUpperCase()
                    const intradayData = stock.intraday || []
                    const eod = stock.eod?.[0]
                    const prevEod = stock.eod?.[1]
                    const intraday = stock.intraday?.[stock.intraday.length - 1] || []

                    const intradayFormatted = intradayData.map((item) => ({
                      ...item,
                      time: new Date(item.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    }))

                  const priceChange =
                    eod && prevEod ? ((eod.close - prevEod.close) / eod.close) * 100 : null
                          
                  const priceColor =
                    priceChange >= 0 ? 'text-green-600' : 'text-red-500'

                  const PriceIcon = priceChange >= 0 ? TrendingUp : TrendingDown

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
                          {priceChange !== null && (
                            <div className={`flex items-center gap-1 ${priceColor}`}>
                              <PriceIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {priceChange.toFixed(2)}%
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
                              dataKey="close"
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
              {watchlist?.length === 0 ? 'No data available.' : 'Loading...'}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
