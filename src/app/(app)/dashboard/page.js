'use client'

import { useEffect } from 'react'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import { useWatchlist } from '@/hooks/watchlist'
import toast, { Toaster } from 'react-hot-toast'
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
  const { watchlist, isLoading, isError } = useWatchlist()

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
                const eod = stock.eod?.[0]
                const intraday = stock.intraday || []

                const intradayFormatted = intraday.map((item) => ({
                  ...item,
                  time: new Date(item.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                }))

                const priceChange =
                  eod && eod.open ? ((eod.close - eod.open) / eod.open) * 100 : null

                const priceColor =
                  priceChange >= 0 ? 'text-green-600' : 'text-red-500'

                const PriceIcon = priceChange >= 0 ? TrendingUp : TrendingDown

                return (
                  <div
                    key={stock.id}
                    className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition"
                  >
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

                    {eod && (
                      <>
                        <p className="text-3xl font-bold mb-2">
                          ${formatNumber(eod.close)}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <p>
                            <span className="font-medium">Open:</span>{' '}
                            ${formatNumber(eod.open)}
                          </p>
                          <p>
                            <span className="font-medium">High:</span>{' '}
                            ${formatNumber(eod.high)}
                          </p>
                          <p>
                            <span className="font-medium">Low:</span>{' '}
                            ${formatNumber(eod.low)}
                          </p>
                          <p>
                            <span className="font-medium">Volume:</span>{' '}
                            {formatNumber(eod.volume)}
                          </p>
                        </div>
                      </>
                    )}

                    {intradayFormatted.length > 0 && (
                      <div className="mt-4 h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={intradayFormatted}>
                          <XAxis dataKey="time" fontSize={10} hide />
                          <YAxis
                            fontSize={10}
                            domain={['dataMin - 1', 'dataMax + 1']} // Add margin to make the chart more dynamic
                            hide
                          />
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
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500">No stocks in your watchlist.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
