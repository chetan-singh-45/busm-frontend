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
import PriceLine from '@/components/PriceLine'
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
  const { watchlist, handleHistoricalData } = useWatchlist()

  const stock = watchlist?.find((s) => s.stock_symbol.toUpperCase() === symbol.toUpperCase());
  const intraday = stock?.intraday || [];
  const eod = stock?.eod?.[0].close.toFixed?.(2);   
  const isMarketOpen = stock?.isMarketOpen;
  const closingPrice = isMarketOpen ? stock?.intraday?.[stock.intraday.length - 1]?.close.toFixed?.(2) : eod;
  const dayHigh = intraday.length > 0 ? Math.max(...intraday.map(item => item.high)) : null;
  const dayLow = intraday.length > 0 ? Math.min(...intraday.map(item => item.low)) : null;
  const week52high = data?.[0]?.["52high"] ?? null;
  const week52low = data?.[0]?.["52low"] ?? null;
  // const prevClosingPrice = stock?.eod?.[1]?.close;
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

  const formatNumber = (num) =>
    num ? Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-';

  const getXAxisTicks = (data, range) => {
    const uniqueTicks = new Map();

    data.forEach(item => {
      const date = new Date(item.datetime);
      let key;

      if (range === '1d') {
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
      } else if (range === '5d' || range === '1m') {
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      } else if (range === '6m' || range === 'YTD') {
        key = `${date.getFullYear()}-${date.getMonth()}`;
      }
      else {
        key = `${date.getFullYear()}`;
      }

      if (!uniqueTicks.has(key)) {
        uniqueTicks.set(key, item.datetime);
      }
    });

    return Array.from(uniqueTicks.values());
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{symbol.toUpperCase()} Chart</h2>
        {closingPrice ? (
          <p className="text-lg font-bold text-gray-800">
            ${formatNumber(closingPrice)}
            {/* ${formatNumber(prevClosingPrice)} */}
          </p>
        ) : (
          <p className="text-gray-600">...</p>
        )}
      </div>

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
                tickFormatter={(dateStr) => {
                  const date = new Date(dateStr);
                  if (range === '1d') {
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  } else if (range === '5d' || range === '1m') {
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  } else if (range === '6m' || range === 'YTD') {
                    console.log(range)
                    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                  }
                  else {
                    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                  }
                }}
                ticks={getXAxisTicks(data, range)}
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
                labelFormatter={(label) => {
                  const date = new Date(label);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = date.toLocaleString('default', { month: 'short' });
                  const year = date.getFullYear();
                  const time = date.toLocaleTimeString();
                  return `${month} ${day}, ${year} ${time}`; 
                }}
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
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Indicators</h3>
              <div className="flex flex-wrap gap-3">
                {indicators.map((indicator) => (
                  <button
                    key={indicator.id}
                    onClick={() => handleIndicatorData(indicator)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    {indicator.indicator_name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-white border rounded-lg shadow p-4">
            <h4 className="text-md font-semibold mb-4">Market Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between bg-gray-50 p-3 rounded">
                    <p className="text-gray-500">Day Low</p>
                    <p className="text-red-600 font-semibold">${dayLow.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-3 rounded">
                    <p className="text-gray-500">Day High</p>
                    <p className="text-green-600 font-semibold">${dayHigh.toFixed(2)}</p>
                  </div>
                </div>
                <div className="w-full relative mt-4">
                  <div className="flex justify-between px-2 text-sm text-gray-500">
                    <span>52W Low</span>
                    <span>52W High</span>
                  </div>
                  <div className="flex justify-between px-2 text-sm font-semibold">
                    <span className="text-red-700">${week52low.toFixed(2)}</span>
                    <span className="text-green-700">${week52high.toFixed(2)}</span>
                  </div>
                  <PriceLine  week52High={week52high} week52Low={week52low} closingPrice={closingPrice}/>
                </div>

            </div>
          </>

        </div>
      ) : (
        <p className="text-gray-600 text-center col-span-full">
        {loading ? 'Loading...' : 'No data available.'}
      </p>
      )}
     <Modal isOpen={isOpen} onClose={closeModal} title="Indicator">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">SMA</span>
            <span className="text-blue-600 font-semibold">{modalData?.sma.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Last Price</span>
            <span className="text-green-600 font-semibold">{modalData?.lastPrice}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={() => handleCreateIndicatorStock("up")}
            className="px-3 py-1 rounded border bg-white-600 text-black hover:bg-gray-300 transition-colors duration-200"
          >
            ↑ Cross Up
          </button>

          <button
            onClick={() => handleCreateIndicatorStock("down")}
            className="px-3 py-1 rounded border bg-white-600 text-black hover:bg-gray-300 transition-colors duration-200"
          >
            ↓ Cross Down
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
      </Modal>
    </div>
  )
}

export default OverviewChart