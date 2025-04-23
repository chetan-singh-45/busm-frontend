'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useWatchlist } from '@/hooks/watchlist'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const ranges = ['1d', '5d', '1m', '6m', 'YTD', '1y', '5y']

const OverviewChart = ({ symbol, defaultRange = '1d' }) => {
  const [range, setRange] = useState(defaultRange)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const { handleHistoricalData } = useWatchlist()
  useEffect(() => {
    if (!symbol) return
    const fetchData = async () => {
      setLoading(true)
      try {
        console.log('Fetching:', symbol, range)  //log this
        const res = await handleHistoricalData(symbol, range)
        console.log('Historical Response:', res)
        setData(res.data.data)
      } catch (err) {
        toast.error('Failed to fetch history')
        console.error('fetchData error:', err)  //full log
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
                    const date = new Date(v);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = date.toLocaleString('default', { month: 'short' });
                    return `${month} ${day}`;
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

        </div>
      ) : (
        <p className="text-gray-400">No data available.</p>
      )}
    </div>
  )
}

export default OverviewChart
