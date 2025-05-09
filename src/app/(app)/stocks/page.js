'use client'

import { useState } from 'react'
import Header from '@/app/(app)/Header'
import { useAllPortfolio } from '@/hooks/portfolios'
import { useStocks } from '@/hooks/stocks'
import toast, { Toaster } from 'react-hot-toast'
import { ConfirmDelete } from '@/components/ConfirmDelete'
import { useAuth } from '@/hooks/auth'

const Stock = () => {

  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStock, setLoadingStock] = useState(null)
  const { portfolios, isLoading, handleCreatePortfolio } = useAllPortfolio()
  const { stocks , handleDeleteStock} = useStocks()
  const handleAddToPortfolio = async (stock) => {

    // Protect against undefined portfolios
    // if (!Array.isArray(portfolios)) {
    //   toast.error('Portfolios not loaded yet. Please wait.')
    //   return
    // }

    setLoadingStock(stock.symbol)

    const portfolio = {
      id: stock.id,
    }


    try {
      const existingPortfolio = portfolios.find((p) => p.stock.symbol === stock.symbol)
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
      setLoading(false)
    }
  }

  const filteredMonitoredStocks = stocks?.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.trim().toLowerCase())
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
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
           { filteredMonitoredStocks?.length > 0 ? (
              filteredMonitoredStocks.map((stock) => (
                <div key={stock.symbol} className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-lg transition">
                  <p className="text-xl font-bold text-gray-800">
                    {stock.name} ({stock.symbol})
                  </p>
                  {portfolios?.find((p) => p.stock.symbol === stock.symbol) ? (
                  <>
                    <p className="text-green-500 mt-2 font-medium">Already in portfolio</p>
                    { user?.role == 1 && <button
                        onClick={() =>
                          ConfirmDelete(() => handleDeleteStock(stock.id))
                        }
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                        >
                        Remove Stock
                        </button>}
                  </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAddToPortfolio(stock)}
                        className="mt-3 mr-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                        disabled={loadingStock === stock.symbol || isLoading}
                      >
                        {loadingStock === stock.symbol ? 'Adding...' : 'Add to Portfolio'}
                      </button>
                      { user?.role == 1 && <button

                      onClick={() =>
                        ConfirmDelete(() => handleDeleteStock(stock.id))
                      }
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                    >
                      Remove Stock
                    </button>}
                    </>
                  )}

                </div>
              ))
            ) : (
               <p className="text-gray-600 text-center col-span-full">
                {loading ? 'Loading...' : 'No data available.'}
              </p>
            )
          }
          </div>
            {/* <div className="flex justify-center mt-8">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Load More
              </button>
            </div> */}
        </div>
      </div>
    </>
  )
}

export default Stock
