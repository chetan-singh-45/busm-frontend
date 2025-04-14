'use client'

import { useEffect } from 'react'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import { useAllPortfolio } from '@/hooks/portfolios'
import toast, { Toaster } from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const { portfolios, isLoading, isError } = useAllPortfolio()

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load portfolios')
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
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No stocks in your portfolio.</p>
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
