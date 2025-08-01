'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast'
import { Star, Bell, TrendingUp, TrendingDown, Search, Eye } from 'lucide-react'
import Dropdown from '@/components/Dropdown'
import { useRouter } from 'next/navigation'
import { useAllIndicator } from '@/hooks/indicators'
import SetAlertModal from '@/components/SetAlertModal';
import { useAuth } from '@/hooks/auth'

export default function StockTable({
  title,
  stocks = [],
  isLoading,
  isError,
  handleToggleWatchlist,
  watchlist = [],
}) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const router = useRouter()
  const [loadingOverviewSymbol, setLoadingOverviewSymbol] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState(null)
  const { indicators, smaFetcher, createIndicatorStock } = useAllIndicator()
  const [selectedIndicator, setSelectedIndicator] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [prediction, setPrediction] = useState()
  const [timeframe, setTimeframe] =  useState() 
  const [expiryWeeks, setExpiryWeeks] = useState('1')
  const [stockName,setStockName] = useState('')
  
  const handleIndicatorData = async (symbol, indicator) => {
    try {
      const res = await smaFetcher(symbol)
      setSelectedIndicator(indicator)
      setModalData({ sma: res.data.sma_200, lastPrice: res.data.latest_close })
    } catch {
      toast.error('Failed to load SMA data')
    }
  }

  const handleCreateIndicator = () => {
    if (!selectedIndicator || !modalData || !prediction || !timeframe) {
      toast.error("Please fill all alert fields.")
      return
    }

    const payload = {
      indicator_id: selectedIndicator.id,
      stock_symbol: selectedSymbol,
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
      .catch(() => toast.error('SMA not found'))
      .finally(() => setLoading(false))
  }

  const handleOverviewClick = (symbol) => {
    setLoadingOverviewSymbol(symbol)

    setTimeout(() => {
      router.push(`/overview/${symbol}`)
    }, 500)
  }


  const formatNumber = (num) =>
    num ? Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'

  const countries = Array.from(
    new Set(stocks?.map(item =>
      item?.stock?.country?.name || item?.country?.name
    ))
  ).sort()

  const filteredStocks = stocks?.filter(item => {
    const stock = item?.stock || item
    const nameMatch =
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const countryMatch =
      selectedCountry === 'all' ||
      stock.country.name.toLowerCase() === selectedCountry.toLowerCase()

      return nameMatch && countryMatch
  })

  const isInWatchlist = (stockId) =>
    watchlist?.some(w => w.stock_id === stockId || w.stock?.id === stockId)
  
  return (
    <div className="bg-white rounded-2xl shadow-md border p-4 sm:p-6 w-full">
      <Toaster position="top-right" />
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#11193C]">{title}</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center mb-6">
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative z-30 w-full sm:w-48">
          <Dropdown
            align="left"
            width="48"
            trigger={
              <button className="inline-flex justify-between w-full px-4 py-2 text-base border border-gray-300 bg-white text-gray-900 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
                {selectedCountry === 'all'
                  ? 'All Countries'
                  : selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)}
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            }
          >
            <button
              onClick={() => setSelectedCountry('all')}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${selectedCountry === 'all' ? 'font-semibold text-blue-600' : 'text-gray-800'
                }`}
                >
              All Countries
            </button>
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country.toLowerCase())}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${selectedCountry.toLowerCase() === country.toLowerCase()
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-800'
                  }`}
              >
                {country.charAt(0).toUpperCase() + country.slice(1)}
              </button>
            ))}
          </Dropdown>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : filteredStocks?.length === 0 ? (
        <p className="text-gray-500">No matching data found.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full table-auto text-sm sm:text-base">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-xs sm:text-sm text-gray-700 uppercase tracking-wide">
                <th className="px-2 sm:px-4 py-2 sm:py-3"></th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Index</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Price</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Change</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">%</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((item) => {
                const stock = item?.stock || item
                const symbol = stock.symbol?.toUpperCase()
                const price = stock?.stock_price?.price
                const percentChange = stock?.stock_price?.percentage_day
                const priceChange = stock?.stock_price?.price_change_day
                const isStarred = isInWatchlist(stock.id)
                const isPositive = priceChange >= 0 || percentChange >= 0
                const countryName = stock?.country?.name || '-'
                const countryEmoji = stock?.country?.emoji || ''
                const stock_name = item?.name || ''
                
                return (
                  <tr
                    key={stock.id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="text-right px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleToggleWatchlist(stock)}
                          title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Star
                            className={`w-5 h-5 ${isStarred ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill={isStarred ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          onClick={ () => {
                            setSelectedSymbol(symbol)
                            setStockName(stock_name)
                            setIsOpen(true)
                            handleIndicatorData(symbol, indicators[0])
                          }}
                          title={'set alert'}
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Bell className={`w-5 h-5 text-green-500`} />
                        </button>
                      </div>
                    </td>

                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-800">
                      <div className="flex flex-col items-center">
                        <span>{countryEmoji} {stock.name || '-'}</span>
                        <span className="text-xs text-gray-400">{countryName}</span>
                      </div>
                    </td>

                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-800">
                      {formatNumber(price)}
                    </td>

                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                      {priceChange != null ? (
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {isPositive ? `+${priceChange}` : `${priceChange}`}
                        </span>
                      ) : '-'}
                    </td>

                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                      {percentChange != null ? (
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {isPositive ? `+${percentChange}` : `${percentChange}`}
                        </span>
                      ) : '-'}
                    </td>

                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                      <button
                        onClick={() => handleOverviewClick(symbol)}
                        disabled={loadingOverviewSymbol === symbol}
                        className="inline-flex items-center justify-center text-black hover:text-blue-600 transition disabled:opacity-50"
                      >
                        {loadingOverviewSymbol === symbol ? (
                          <span className="flex space-x-1">
                            <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                          </span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Alert Modal */}
      <SetAlertModal
        isOpen={isOpen}
        loading={loading}
        setIsOpen={setIsOpen}
        symbol={selectedSymbol}
        stockName={stockName}
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
