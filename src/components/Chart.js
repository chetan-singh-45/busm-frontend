'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { LineChart, CandlestickChart } from 'lucide-react'
import { useWatchlist } from '@/hooks/watchlist'
import ChaseLoader from '@/components/ChaseLoader'
import { toast, Toaster } from 'react-hot-toast'

const timeRanges = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y']

const Chart = ({ symbol, defaultRange = '1D' }) => {
  const [range, setRange] = useState(defaultRange)
  const [chartType, setChartType] = useState('candlestick')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const { handleHistoricalData } = useWatchlist()

  useEffect(() => {
    if (!symbol) return
    setLoading(true)
    handleHistoricalData(symbol, range)
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to fetch chart data'))
      .finally(() => setLoading(false))
  }, [symbol, range])

  const formatXAxis = (dateStr) => {
    const d = new Date(dateStr)
    if (range === '1D') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (['5D', '1M'].includes(range)) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }

  useEffect(() => {
    if (!data || !chartRef.current) return

    const categories = data.map(d => formatXAxis(d.datetime))
    const ohlc = data.map(d => [d.open, d.close, d.low, d.high])
    const closeLine = data.map(d => d.close)

    const option = {
    animation: true,
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    grid: {
        left: 20,
        right: 60,
        top: 40,
        bottom: 60, // extra space for slider
    },
    xAxis: {
        type: 'category',
        position: 'bottom',
        data: categories,
        boundaryGap: chartType === 'candlestick',
        axisLine: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#555', fontSize: 11 },
    },
    yAxis: {
        scale: true,
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#ccc' } },
        axisLabel: {
        show: true,
        color: '#555',
        fontSize: 11,
        margin: 12,
        },
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#eee' } }
    },
    dataZoom: [
        {
        type: 'inside', // ✅ zoom via mousewheel/pinch
        xAxisIndex: 0,
        start: 80,
        end: 100,
        },
        {
        type: 'slider', // ✅ visible zoom bar at the bottom
        xAxisIndex: 0,
        height: 20,
        bottom: 10,
        start: 80,
        end: 100,
        handleIcon:
            'M8.7,11.4v-8c0-0.2-0.1-0.4-0.3-0.4H7.3C7.1,3,7,3.2,7,3.4v8c0,0.2,0.1,0.4,0.3,0.4h1.1C8.6,11.8,8.7,11.6,8.7,11.4z',
        handleSize: '100%',
        handleStyle: {
            color: '#aaa',
        },
        textStyle: {
            color: '#888',
        },
        borderColor: '#ccc',
        },
    ],
    series: chartType === 'candlestick'
        ? [{
            type: 'candlestick',
            data: ohlc,
            barWidth: 25, 
            itemStyle: {
            color: '#22c55e',
            color0: '#ef4444',
            borderColor: '#22c55e',
            borderColor0: '#ef4444'
            }
        }]
        : [{
            type: 'line',
            data: closeLine,
            showSymbol: false,
            smooth: true,
            lineStyle: { color: '#2563eb', width: 2 },
            areaStyle: { color: 'rgba(37,99,235,0.08)' }
        }]
    }


    if (chartInstance.current) chartInstance.current.dispose()
    chartInstance.current = echarts.init(chartRef.current)
    chartInstance.current.setOption(option)
    window.addEventListener('resize', () => chartInstance.current?.resize())
    return () => chartInstance.current?.dispose()
  }, [data, chartType, range])

  if (loading || !data) return <ChaseLoader message="Loading Chart..." />

  return (
    <div className="bg-white rounded-xl py-4 shadow-sm p-0 relative">
      <Toaster />

    <div className="absolute top-12 left-6 z-10 flex flex-row items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">
            {symbol || 'Stock Name'}
        </span>
        <span className="text-xs font-semibold text-green-600">
            +5.53 (0.48%)
        </span>
    </div>

      {/* Chart Type Toggle */}
      <div className="absolute top-2 left-6 my-2 z-10 flex space-x-1">
        <button
          onClick={() => setChartType('line')}
          className={`p-1 rounded ${chartType === 'line' ? 'bg-gray-200 shadow' : 'hover:bg-gray-100'}`}
          title="Line Chart"
        >
          <LineChart className="w-4 h-4" />
        </button>
        <button
          onClick={() => setChartType('candlestick')}
          className={`p-1 rounded ${chartType === 'candlestick' ? 'bg-gray-200 shadow' : 'hover:bg-gray-100'}`}
          title="Candlestick Chart"
        >
          <CandlestickChart className="w-4 h-4" />
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="w-full  pt-10" style={{ height: 400 }}>
        <div ref={chartRef} className="w-full h-full" />
      </div>

      {/* Time Range Buttons (Bottom Center) */}
    <div className="flex justify-center mt-6">
    <div className="inline-flex border border-gray-200 rounded-md overflow-hidden shadow-sm">
        {timeRanges.map((r, idx) => (
        <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 text-sm transition-all duration-150 ${
            range === r
                ? 'bg-white text-[#0A0A35] font-semibold'
                : 'bg-[#f9f9f9] text-[#0A0A35]/70 hover:bg-white'
            } ${idx !== 0 ? 'border-l border-gray-200' : ''}`}
        >
            {r}
        </button>
        ))}
    </div>
    </div>

    </div>
  )
}

export default Chart
