'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/(app)/Header'
import { useParams } from 'next/navigation'
import { getStocks } from '@/services/exchanges'
import { useAllPortfolio } from '@/hooks/portfolios'
import { useStocks } from '@/hooks/stocks'
import { useAuth } from '@/hooks/auth'

import toast, { Toaster } from 'react-hot-toast'

const LIMIT = 100

const Exchange = () => {
  const { user } = useAuth()
  const params = useParams()
  const [stockData, setStockData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStock, setLoadingStock] = useState(null)

  const { portfolios, isLoading, handleCreatePortfolio } = useAllPortfolio()

  const { stocks, handleAddStocks } = useStocks()

  const fetchStocks = async (currentOffset = 0, append = false) => {
    setLoading(true)
    try {
      const data = await getStocks(params.exchange, LIMIT, currentOffset)

      if (!data) return

      if (append) {
        setStockData(prev => [...prev, ...(data.data.tickers || data.data.indexes)])
      } else {
        setStockData(data.data.tickers || data.data.indexes)
      }

      setTotal(data.pagination.total)
    } catch (error) {
      console.error('Error fetching stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT
    setOffset(newOffset)
    fetchStocks(newOffset, true)
  }

  const handleAddToPortfolio = async (stock) => {
    // Protect against undefined portfolios
    if (!Array.isArray(portfolios)) {
      toast.error('Portfolios not loaded yet. Please wait.')
      return
    }

    setLoadingStock(stock.symbol)

    const portfolio = {
      stock_name: stock.name,
      stock_symbol: stock.symbol,
      stock_exchange: '',
      stock_has_eod: stock.has_eod,
      stock_has_intraday: stock.has_intraday,
    }

    try {
      const existingPortfolio = portfolios.find((p) => p.stock_symbol === stock.symbol)
      if (!existingPortfolio) {
        await handleCreatePortfolio(portfolio)
        toast.success(`${stock.name} added to portfolio`)
      } else {
        toast.error(`${stock.name} already exists in portfolio`)
      }
    } catch (error) {
      toast.error('Failed to add to portfolio')
      console.error('Error adding stock to portfolio:', error)
    } finally {
      setLoadingStock(null)
    }
  }

  useEffect(() => {
    setOffset(0)
    fetchStocks(0)
  }, [params.exchange])

  const filteredStocks = stockData.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  )

  return (
    <>
      <Header title="Stocks" />
      <Toaster position="top-right" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-60 border border-gray-300 rounded-md p-2 text-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-lg transition"
                >
                  <p className="text-xl font-bold text-gray-800">
                    {stock.name} ({stock.symbol})
                  </p>


                  {/* Monitor Status */}
                  {stocks?.find((s) => s.symbol === stock.symbol) ? (
                    <p className="text-green-500 mt-2 font-medium"> Already in stock list</p>
                  ) : (
                    <button
                      onClick={() => handleAddStocks(stock)}
                      className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                      disabled={loadingStock === stock.symbol || isLoading}
                    >
                      {loadingStock === stock.symbol ? 'Adding...' : 'Add to stock list'}
                    </button>
                  )}
                </div>

              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">
                {loading ? 'Loading...' : 'No data available.'}
              </p>
            )}
          </div>

          {/* Load More */}
          {user?.role == 1 && filteredStocks.length < total && !loading && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Exchange
