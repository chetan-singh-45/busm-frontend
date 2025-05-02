'use client'

import React, { useEffect, useState ,Fragment} from 'react'
import toast from 'react-hot-toast'
import { useWatchlist } from '@/hooks/watchlist'
import { useAuth } from '@/hooks/auth'
import { useAllIndicator } from '@/hooks/indicators'
import { Dialog, Transition } from '@headlessui/react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Modal from './Modal'

const ranges = ['1d', '5d', '1m', '6m', 'YTD', '1y', '5y']

const OverviewChart = ({ symbol, defaultRange = '1d' }) => {
  const { user } = useAuth()
  const [range, setRange] = useState(defaultRange)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { indicators, smaFetcher, createIndicatorStock } = useAllIndicator(symbol)
  const [modalData, setModalData] = useState(null)
  const [selectedIndicator, setSelectedIndicator] = useState(null);  

  const { handleHistoricalData } = useWatchlist()

  const closeModal = () => {
    setIsOpen(false)
  }
  
  const handleCreateIndicatorStock = async (prediction) =>{

    const indicator_stock ={
        indicator_id: selectedIndicator.id,
        stock_symbol: symbol,
        user_id : user.id,
        sma_price: modalData.sma,
        last_price: modalData.lastPrice,
        prediction: prediction,
    }
      setLoading(selectedIndicator.id)
      try {
        await createIndicatorStock(indicator_stock)     
        setIsOpen(false)
      } catch (error) {
        console.error('Error adding to indicator_stock:', error)
      } finally {
          setLoading(null)
      }
    
  }
  
  
  const handleIndicatorData = async (indicator) =>{

      try {
        const res = await smaFetcher(symbol) 
        const { sma_200, latest_close } = res.data
        setSelectedIndicator(indicator);
        setModalData({
          sma: sma_200,
          lastPrice: latest_close,
        })
        setIsOpen(true)
      } catch (err) {
        toast.error('Failed to load SMA data')
      }
  }

  useEffect(() => {
    if (!symbol) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await handleHistoricalData(symbol, range)
        setData(res.data.data)
      } catch (err) {
        toast.error('Failed to fetch history')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [symbol, range])
  
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <div className="flex gap-2 mb-4 flex-wrap">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded border ${
              range === r ? 'bg-blue-600 text-white' : 'bg-white text-black'
            }`}
          >
            {r.toUpperCase()}
          </button>  
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading data...</p>
      ) : data ? (
        <div className="bg-gray-100 p-4 rounded">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <XAxis
                dataKey="datetime"
                fontSize={10}
                tickFormatter={(v) => {
                    const date = new Date(v)
                    const day = String(date.getDate()).padStart(2, '0')
                    const month = date.toLocaleString('default', { month: 'short' })
                    return `${month} ${day}`
                  }}
                />
                <YAxis
                fontSize={10}
                domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip
                contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                }}
                labelFormatter={(label) => `Time: ${new Date(label).toLocaleTimeString()}`}
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
          <>
          <h3>Indicators</h3>
              { indicators.map((indicator) => 
                <button
                    key={indicator.id}
                    onClick={() => handleIndicatorData(indicator)}
                    className="mt-3 mx-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-red-600"
                  >{indicator.indicator_name}
                  </button>
              )}
          </>
        </div>
      ) : (
        <p className="text-gray-600 text-center col-span-full">
        {loading ? 'Loading...' : 'No data available.'}
      </p>
      )}
      <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-30" />
                </Transition.Child>
      
                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-200"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-150"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                      <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                         Indicator  
                      </Dialog.Title>
                        <div className="space-y-3">
                          <p className="text-gray-700">
                            <strong>SMA data:</strong> {modalData?.sma.toFixed(2)}
                          </p>
                          <p className="text-gray-700">
                            <strong>Last Price:</strong> {modalData?.lastPrice}
                          </p>
                        </div>
                        <div className="mt-6 flex justify-center gap-6">
                          <button
                            onClick={() => handleCreateIndicatorStock("up")}
                            className="px-3 py-1 rounded border bg-white-600 text-black hover:bg-gray-300 transition-colors duration-200"
                            >
                             ↑ Up
                          </button>

                          <button
                            onClick={() => handleCreateIndicatorStock("down")}
                            className="px-3 py-1 rounded border bg-white-600 text-black hover:bg-gray-300 transition-colors duration-200"
                          >
                           ↓ Down
                          </button>
                        </div>
                
                        <div className="mt-4 text-right">
                          <button
                            onClick={closeModal}
                            className="px-3 py-1 rounded border bg-white-600 text-black hover:bg-gray-300 transition-colors duration-200"
                            >
                            Cancel
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
    </div>
  )
}

export default OverviewChart