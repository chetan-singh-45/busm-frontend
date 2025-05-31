'use client'

import React, { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useWatchlist } from '@/hooks/watchlist'
import { useAuth } from '@/hooks/auth'
import { useAllIndicator } from '@/hooks/indicators'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import Modal from './Modal'
import PriceLine from '@/components/PriceLine'

const ranges = ['1D', '5D', '1M', '6M', 'YTD', '1Y','5Y']

const OverviewChart = ({ symbol, defaultRange = '1D' }) => {
  const { user } = useAuth()
  const [range, setRange] = useState(defaultRange)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [chartType, setChartType] = useState('area')
  const [showVolume, setShowVolume] = useState(false)
  const { indicators, smaFetcher, createIndicatorStock } = useAllIndicator(symbol)
  const [modalData, setModalData] = useState(null)
  const [selectedIndicator, setSelectedIndicator] = useState(null)
  const { watchlist, handleHistoricalData } = useWatchlist()

  const stock = watchlist?.find((s) => s.stock?.symbol?.toUpperCase() === symbol.toUpperCase())
  const closingPrice = stock?.stock?.stock_price?.price

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

  const marketData = useMemo(() => {
    if (!data || !data.length) return null
    const prices = data.map((d) => d.close)
    const volumes = data.map((d) => d.volume || 0)
    const dayHigh = Math.max(...data.map((d) => d.high))
    const dayLow = Math.min(...data.map((d) => d.low))
    const week52High = data[0]?.['52high']
    const week52Low = data[0]?.['52low']
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length
    const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, prices.length)
    const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, prices.length)
    return { dayHigh, dayLow, week52High, week52Low, avgVolume, sma20, sma50 }
  }, [data])

  const formatNumber = (num) =>
    num ? Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'

  const formatXAxisTick = (dateStr) => {
    const date = new Date(dateStr)
    if (range === '1D') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (['5D', '1M'].includes(range)) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }
  }

  const handleIndicatorData = async (indicator) => {
    try {
      const res = await smaFetcher(symbol)
      const { sma_200, latest_close } = res.data
      setSelectedIndicator(indicator)
      setModalData({ sma: sma_200, lastPrice: latest_close })
      setIsOpen(true)
    } catch (err) {
      toast.error('Failed to load SMA data')
    }
  }

  const handleCreateIndicatorStock = async (prediction) => {
    const indicator_stock = {
      indicator_id: selectedIndicator.id,
      stock_symbol: symbol,
      user_id: user.id,
      sma_price: modalData.sma,
      last_price: modalData.lastPrice,
      prediction,
    }
    setLoading(true)
    try {
      await createIndicatorStock(indicator_stock)
      setIsOpen(false)
    } catch (err) {
      toast.error('Failed to create indicator entry')
    } finally {
      setLoading(false)
    }
  }

  if (!marketData) return <p className="text-gray-600">Loading...</p>

  return (
    <div className="bg-white shadow-xl border rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{stock?.stock?.name || symbol}</h2>
          <p className="text-sm text-gray-500">{symbol.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">${formatNumber(closingPrice)}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs rounded-md ${
                range === r ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType(chartType === 'line' ? 'area' : 'line')}
            className="px-3 py-1 text-xs rounded border"
          >
            {chartType === 'line' ? 'Area' : 'Line'}
          </button>
          <button
            onClick={() => setShowVolume(!showVolume)}
            className="px-3 py-1 text-xs rounded border"
          >
            Volume
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <ResponsiveContainer width="100%" height={showVolume ? 280 : 350}>
          {chartType === 'line' ? (
            <LineChart data={data}>
              <XAxis dataKey="datetime" tickFormatter={formatXAxisTick} fontSize={10} />
              <YAxis fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                formatter={(val) => [`$${val.toFixed(2)}`, 'Close']}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="datetime" tickFormatter={formatXAxisTick} fontSize={10} />
              <YAxis fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                formatter={(val) => [`$${val.toFixed(2)}`, 'Close']}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Area type="monotone" dataKey="close" stroke="#3b82f6" fill="url(#priceGradient)" />
            </AreaChart>
          )}
        </ResponsiveContainer>

        {showVolume && (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={data}>
                <XAxis dataKey="datetime" hide />
                <YAxis hide />
                <Tooltip formatter={(val) => [`${val}`, 'Volume']} />
                <Area type="monotone" dataKey="volume" stroke="#6b7280" fill="#6b7280" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Indicators */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Technical Indicators</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {indicators.map((indicator) => (
            <button
              key={indicator.id}
              onClick={() => handleIndicatorData(indicator)}
              className="p-4 border rounded-lg bg-white hover:shadow transition"
            >
              <div className="font-medium">{indicator.indicator_name}</div>
              <div className="text-xs text-gray-500">View Signal</div>
            </button>
          ))}
        </div>
      </div>

      {/* Market Summary */}
      <div className="bg-white border p-4 rounded-xl">
        <h4 className="font-semibold mb-4">Market Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span>Day Low</span>
            <span className="text-red-600 font-medium">${formatNumber(marketData.dayLow)}</span>
          </div>
          <div className="flex justify-between">
            <span>Day High</span>
            <span className="text-green-600 font-medium">${formatNumber(marketData.dayHigh)}</span>
          </div>
          <div className="flex justify-between">
            <span>SMA 20</span>
            <span className="text-blue-600 font-medium">${formatNumber(marketData.sma20)}</span>
          </div>
          <div className="flex justify-between">
            <span>SMA 50</span>
            <span className="text-blue-600 font-medium">${formatNumber(marketData.sma50)}</span>
          </div>
        </div>

        {/* 52W Price Indicator */}
        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span>52W Low</span>
            <span>52W High</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-red-600">${formatNumber(marketData.week52Low)}</span>
            <span className="text-green-600">${formatNumber(marketData.week52High)}</span>
          </div>
          <PriceLine
            week52High={marketData.week52High}
            week52Low={marketData.week52Low}
            closingPrice={closingPrice}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={selectedIndicator?.indicator_name || "Indicator"}>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">SMA</span>
            <span className="text-blue-600 font-semibold">
              {typeof modalData?.sma === 'number' ? modalData.sma.toFixed(2) : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Last Price</span>
            <span className="text-green-600 font-semibold">
              {typeof modalData?.lastPrice === 'number' ? modalData.lastPrice.toFixed(2) : '-'}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={() => handleCreateIndicatorStock("up")}
            className="px-4 py-2 border bg-white text-black hover:bg-gray-200 rounded"
          >
            ↑ Cross Up
          </button>
          <button
            onClick={() => handleCreateIndicatorStock("down")}
            className="px-4 py-2 border bg-white text-black hover:bg-gray-200 rounded"
          >
            ↓ Cross Down
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default OverviewChart
