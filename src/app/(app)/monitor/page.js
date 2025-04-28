'use client'

import { useEffect } from 'react'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import toast, { Toaster } from 'react-hot-toast'
import { useStocks } from '@/hooks/stocks'

const Monitor = () => {
  const { user } = useAuth()
  const { stocks, isLoading, isError } = useStocks()
  
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load stocks')
    }
  }, [isError])

  return (
    <>
      <Header title="Monitor" />
      <Toaster position="top-right" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <p className="text-lg font-semibold mb-4">
                Your Monitored stocks 
              </p>

              {isLoading || stocks === undefined ? (
                <p className="text-gray-500">Loading your stock monitor...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.isArray(stocks) && stocks.length > 0 ? (
                    stocks.map((stock) => (
                      <div
                        key={stock.id}
                        className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm"
                      >
                        <h3 className="text-lg font-semibold">{stock.name}</h3>
                        <p className="text-sm text-gray-600">{stock.symbol}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center col-span-full">
                     {stocks?.length === 0 ? 'No data available.' : 'Loading...'}
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

export default Monitor
