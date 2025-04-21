'use client'

import { useState,useEffect } from 'react'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import { useAllPortfolio } from '@/hooks/portfolios'
import { useWatchlist } from '@/hooks/watchlist'
import toast, { Toaster } from 'react-hot-toast'

const Portfolio = () => {
  const { user } = useAuth()
  const { portfolios, isLoading, isError, handleDeletePortfolio } = useAllPortfolio()
  const { watchlist, handleAddWatchlist } = useWatchlist()
  const [loadingId, setLoadingId] = useState(null)
  const onAddToWatchlist = async (stock) => {
    const watchlistData = {
      user_id: user.id,
      portfolio_id: stock.id,
    }
    setLoadingId(stock.id)
    try {
        if (!Array.isArray(watchlist)) {
            toast.error('Watchlist not loaded properly')
            return
        }
        
        const exists = watchlist.find(
            (w) => w.portfolio_id === stock.id && w.user_id === user.id
        )
        
        if (!exists) {
        await handleAddWatchlist(watchlistData) 
        toast.success('Added to watchlist')
      } else {
        toast.error('Already exists in watchlist')
      }
    } catch (error) {
      toast.error('Failed to add to watchlist')
      console.error('Error adding stock to watchlist:', error)
    } finally {
        setLoadingId(null)
      }
  }
  
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load portfolios')
    }
  }, [isError])

  return (
    <>
      <Header title="Portfolio" />
      <Toaster position="top-right" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <p className="text-lg font-semibold mb-4">
                Your selected stocks...
              </p>

              {isLoading ? (
                <p className="text-gray-500">Loading your portfolio...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.isArray(portfolios) && portfolios.length > 0 ? (
                    portfolios.map((stock) => (
                      <div
                        key={stock.id}
                        className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm"
                      >
                        <h3 className="text-lg font-semibold">{stock.stock_name}</h3>
                        <p className="text-sm text-gray-600">{stock.stock_symbol}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          EOD: {stock.stock_has_eod ? 'Yes' : 'No'} | Intraday:{' '}
                          {stock.stock_has_intraday ? 'Yes' : 'No'}
                        </p>
                        {
                            watchlist?.find((p) => p.id === stock.id) ? (
                              <>
                              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                              <p className="text-green-500 mt-2">Already in watchlist</p>
                              <button
                                onClick={() => handleDeletePortfolio(stock.id)
                                  .then(() => toast.success(`${stock.stock_symbol} removed from Portfolio`))
                                  .catch((err) => { toast.error(err)})
                                }
                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                              >
                                Remove Portfolio
                              </button>
                              </div>
                            </>
                            ) : (
                            <>
                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">

                                <button
                                  onClick={() => onAddToWatchlist(stock)}
                                  disabled={loadingId === stock.id}
                                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                                  >
                                  {loadingId === stock.id ? 'Adding...' : 'Add to Watchlist'}
                                </button>           
                              <button
                                onClick={() => handleDeletePortfolio(stock.id)
                                  .then(() => toast.success(`${stock.stock_symbol} removed from Portfolio`))
                                  .catch((err) => { toast.error(err)})
                                }
                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                              >
                                Remove Portfolio
                              </button>
                            </div>  
                            </>
                         )
                        }
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center col-span-full">
                     {watchlist?.length === 0 ? 'No data available.' : 'Loading...'}
                    </p>
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

export default Portfolio
