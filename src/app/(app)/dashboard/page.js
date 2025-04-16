'use client'

import { useEffect } from 'react'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import { useWatchlist } from '@/hooks/watchlist'
import toast, { Toaster } from 'react-hot-toast'
import { useEod } from '@/hooks/eod'
const Dashboard = () => {
  const { user } = useAuth()
  const { watchlist, isLoading, isError } = useWatchlist()

  const symbols = watchlist?.map((item) => item.portfolio?.stock_symbol) || []
  const { eodData } = useEod(symbols)
  
  const getPriceStatus = (eod) => {
    if (!eod?.close || !eod?.open) return '—'
    if (eod.close > eod.open) return 'Up'
    if (eod.close < eod.open) return 'Down'
    return 'Same'
  }
  
  const getPriceChangePercent = (eod) => {
    if (!eod?.close || !eod?.open) return '—'
    const change = ((eod.close - eod.open) / eod.open) * 100
    return change.toFixed(2) + '%'
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

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <p className="text-lg font-semibold mb-4">
                Welcome{user?.name ? `, ${user.name}` : ''}!
              </p>

              {isLoading ? (
                <p className="text-gray-500">Loading your watchlist...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.isArray(watchlist) && watchlist.length > 0 ? (
                    watchlist.map((stock) => {
                      const symbol = stock.portfolio.stock_symbol.trim().toUpperCase()
                      const eod = eodData?.symbol
                      const status = getPriceStatus(eod)
                      const percentChange = getPriceChangePercent(eod)

                      return (
                        <div
                          key={stock.id}
                          className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm"
                        >
                          <h3 className="text-lg font-semibold">{stock.portfolio.stock_name}</h3>
                          <p className="text-sm text-gray-600">{symbol}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            EOD: {stock.portfolio.stock_has_eod ? 'Yes' : 'No'} | Intraday:{' '}
                            {stock.portfolio.stock_has_intraday ? 'Yes' : 'No'}
                          </p>
                          {eod ? (
                            <div className="mt-2">
                              <p className="text-sm text-gray-700">Open: ${eod.open}</p>
                              <p className="text-sm text-gray-700">Close: ${eod.close}</p>
                              <p className={`text-sm font-semibold mt-1 ${status === 'Up' ? 'text-green-600' : status === 'Down' ? 'text-red-600' : 'text-gray-500'}`}>
                                {status} ({percentChange})
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm mt-2">No EOD data</p>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500">No stocks in your watchlist.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
