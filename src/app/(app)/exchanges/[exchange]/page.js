'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/(app)/Header'
import Loading from '@/app/(app)/Loading'
import { useAuth } from '@/hooks/auth'
import { useRouter, useParams } from 'next/navigation'
import { getStocks, useAllExchanges } from '@/hooks/exchanges'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import Button from '@/components/Button'


const Exchange = () => {
  const { user } = useAuth({ middleware: 'auth' })
  const router = useRouter()
  const params = useParams()

  const [stockData, setStockData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStocks = stockData?.data?.tickers?.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const fetchStocks = async () => {
        try {
          const response = await getStocks(params.exchange)
          const data = await response.json()
          console.log('Stock Data:', data.data)
          setStockData(data)
        } catch (error) {
          console.error('Error fetching stocks:', error)
        }
      }
    
    fetchStocks()
  }, [params.exchange])



  return (
    <>
      <Header title="Exchanges" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <input
            type="text"
            placeholder="Search stocks..."
            className="w-60 border border-gray-300 rounded-md p-2 text-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
               
                <h2 className="font-semibold text-2xl text-gray-800">Select Stocks</h2>
                {/* {stockData?.data?.tickers.length > 0 ? (
                stockData.data.tickers.map(stock => (
                    <div key={stock.symbol}  className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-lg transition">
                    <p className="text-xl font-bold text-gray-800">{stock.name} ({stock.symbol})</p>
                    </div>
                ))
                ) : (
                <p>Loading or no data available...</p>
                )} */}

                {stockData?.data?.tickers.length > 0 ? (
                    filteredStocks.map(stock => (
                        <div key={stock.symbol}  className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-lg transition">
                        <p className="text-xl font-bold text-gray-800">{stock.name} ({stock.symbol})</p>
                        </div>
                    ))
                    ) : (
                    <p>Loading or no data available...</p>
                )}
              </div>

              </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Exchange
