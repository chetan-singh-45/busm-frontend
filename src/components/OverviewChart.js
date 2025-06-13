'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import * as echarts from 'echarts'
import { Toaster ,toast} from 'react-hot-toast'
import { useWatchlist } from '@/hooks/watchlist'
import { useAuth } from '@/hooks/auth'
import { useAllIndicator } from '@/hooks/indicators'
import PriceLine from '@/components/PriceLine'
import { useStocks } from '@/hooks/stocks'
import { Star, CandlestickChart, LineChart } from 'lucide-react'
import SetAlertModal from '@/components/SetAlertModal';
import ChaseLoader from '@/components/ChaseLoader';

const ranges = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y']

const OverviewChart = ({ symbol, defaultRange = '1D' }) => {
  const { user } = useAuth()
  const [range, setRange] = useState(defaultRange)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [chartType, setChartType] = useState('line')
  const { indicators, smaFetcher, createIndicatorStock } = useAllIndicator(symbol)
  const [modalData, setModalData] = useState(null)
  const [selectedIndicator, setSelectedIndicator] = useState(null)
  const { watchlist, handleHistoricalData, handleRemoveWatchlist, handleAddWatchlist } = useWatchlist()
  const [prediction, setPrediction] = useState()
  const [timeframe, setTimeframe] = useState()
  const [expiryWeeks, setExpiryWeeks] = useState('')
  const { stocks } = useStocks()
  const index = stocks?.find((s) => s?.symbol?.toUpperCase() === symbol.toUpperCase())
  const closingPrice = index?.stock_price?.price

  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!symbol) return
    setLoading(true)
    handleHistoricalData(symbol, range)
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to fetch history'))
      .finally(() => setLoading(false))
  }, [symbol, range])

  const marketData = useMemo(() => {
    if (!data?.length) return null
    const prices = data.map(d => d.close)
    const volumes = data.map(d => d.volume || 0)
    return {
      dayHigh: Math.max(...data.map(d => d.high)),
      dayLow: Math.min(...data.map(d => d.low)),
      week52High: data[0]?.['52high'],
      week52Low: data[0]?.['52low'],
      avgVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length,
      sma20: prices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, prices.length),
      sma50: prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, prices.length),
    }
  }, [data])

  const formatNumber = num => num ? Number(num).toLocaleString(undefined, { maxFractionDigits: 2 }) : '-'
  const formatXAxis = dateStr => {
    const d = new Date(dateStr)
    if (range === '1D') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (['5D', '1M'].includes(range)) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }

  useEffect(() => {
    if (!data?.length || !chartRef.current) return

    const category = data.map(d => formatXAxis(d.datetime))
    const ohlc = data.map(d => [d.open, d.close, d.low, d.high])
    const closeLine = data.map(d => d.close)

    const option = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      xAxis: { type: 'category', data: category, boundaryGap: chartType === 'candlestick' },
      yAxis: { scale: true, splitLine: { show: true } },
      grid: { left: 60, right: 20, top: 30, bottom: 60 },
      dataZoom: [
        { type: 'inside', start: 70, end: 100 },
        { type: 'slider', bottom: 20, start: 70, end: 100 }
      ],
      series:
        chartType === 'candlestick'
          ? [
              {
                type: 'candlestick',
                data: ohlc,
                itemStyle: {
                  color: '#0f766e',
                  color0: '#ef4444',
                  borderColor: '#0f766e',
                  borderColor0: '#ef4444'
                }
              }
            ]
          : [
              {
                type: 'line',
                data: closeLine,
                smooth: true,
                lineStyle: { color: '#0f766e', width: 2 },
                showSymbol: false,
                areaStyle: { color: 'rgba(16, 103, 185, 0.1)' }
              }
            ]
    }

    chartInstance.current?.dispose()
    chartInstance.current = echarts.init(chartRef.current)
    chartInstance.current.setOption(option)
    window.addEventListener('resize', () => chartInstance.current?.resize())

    return () => chartInstance.current?.dispose()
  }, [data, range, chartType])

  const handleIndicatorData = async indicator => {
    try {
      const res = await smaFetcher(symbol)
      setSelectedIndicator(indicator)
      setModalData({ sma: res.data.sma_200, lastPrice: res.data.latest_close })
    } catch {
      toast.error('Failed to load SMA data')
    }
  }

  const handleCreateIndicator = () => {
    const payload = {
      indicator_id: selectedIndicator.id,
      stock_symbol: symbol,
      user_id: user.id,
      sma_price: modalData.sma,
      last_price: modalData.lastPrice,
      prediction,
      timeframe,
      expiry_weeks: parseInt(expiryWeeks, 10)
    }
    setLoading(true)
    createIndicatorStock(payload)
      .then(() => { setIsOpen(false); toast.success('Alert saved successfully') })
      .catch(() => toast.error('Failed to create indicator entry'))
      .finally(() => setLoading(false))
  }

if (!marketData) return <ChaseLoader message="Loading chart..." />;

  const toggleWatchlist = async () => {
    if (!user) return toast.error('You must be logged in')
    setLoading(true)
    const inList = watchlist?.some(w => w.stock?.symbol?.toUpperCase() === symbol.toUpperCase())
    const fn = inList ? handleRemoveWatchlist : handleAddWatchlist
    const arg = inList
      ? watchlist.find(w => w.stock?.symbol?.toUpperCase() === symbol.toUpperCase()).id
      : { stock_id: index.id }
    try {
      await fn(arg)
      toast.success(inList ? 'Removed from watchlist' : 'Added to watchlist')
    } catch {
      toast.error('Watchlist operation failed')
    } finally {
      setLoading(false)
    }
  }
  const isStarred = watchlist?.some(w => w.stock?.symbol?.toUpperCase() === symbol.toUpperCase())

  return (
    
    <div className="bg-white shadow-xl border rounded-xl p-6">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <div>
          <h2 className="text-2xl font-bold">{index?.name || symbol}</h2>
          <p className="text-sm text-gray-500">{symbol.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">${formatNumber(closingPrice)}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 items-center mt-4 mb-6">
        <button
          onClick={toggleWatchlist}
          title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
          className="hover:scale-110 transition-transform duration-200"
        >
          <Star
            className={`w-5 h-5 ${isStarred ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={isStarred ? 'currentColor' : 'none'}
          />
        </button>
        <button onClick={() => { setIsOpen(true); handleIndicatorData(indicators[0]) }} title="Set Alert">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zM10 18a2 2 0 002-2H8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

     <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-4">
      {/*CandlestickChart*/}
       <button
          onClick={() => setChartType('candlestick')}
          className={`p-1 rounded hover:bg-gray-100 ${chartType === 'candlestick' ? 'bg-white shadow border' : ''}`}
          title="Candlestick"
        >
          <CandlestickChart className="w-5 h-5" strokeWidth={2} />
        </button>

      {/*LineChart*/}
        <button
          onClick={() => setChartType('line')}
          className={`p-1 rounded hover:bg-gray-100 ${chartType === 'line' ? 'bg-white shadow border' : ''}`}
          title="Line Chart"
          >
          <LineChart className="w-5 h-5" strokeWidth={2} />
        </button>

          {/* Range Selector */}
        <div className="w-px h-5 bg-gray-300 mx-2" />
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 text-xs rounded ${range === r ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
      </div>

      {/* Market Summary */}
      <div className="bg-white border p-4 rounded-xl">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex justify-between"><span>Day Low</span><span className="text-red-600">${formatNumber(marketData.dayLow)}</span></div>
          <div className="flex justify-between"><span>Day High</span><span className="text-green-600">${formatNumber(marketData.dayHigh)}</span></div>
          <div className="flex justify-between"><span>SMA 20</span><span className="text-blue-600">${formatNumber(marketData.sma20)}</span></div>
          <div className="flex justify-between"><span>SMA 50</span><span className="text-blue-600">${formatNumber(marketData.sma50)}</span></div>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-red-600">${formatNumber(marketData.week52Low)}</span>
          <span className="text-green-600">${formatNumber(marketData.week52High)}</span>
        </div>
        <PriceLine week52High={marketData.week52High} week52Low={marketData.week52Low} closingPrice={closingPrice} />
      </div>

      {/* Alert Modal */}
       <SetAlertModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        symbol={symbol}
        indicators={indicators}
        selectedIndicator={selectedIndicator}
        setSelectedIndicator={setSelectedIndicator}
        prediction={prediction}
        setPrediction={setPrediction}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        expiryWeeks={expiryWeeks}
        setExpiryWeeks={setExpiryWeeks}
        handleCreateIndicator={handleCreateIndicator}
      />

    </div>
  )
}

export default OverviewChart
