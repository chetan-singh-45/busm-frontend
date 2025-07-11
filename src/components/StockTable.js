'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast'
import { Star, TrendingUp, TrendingDown, Search } from 'lucide-react';
import Dropdown from '@/components/Dropdown'

export default function StockTable({
  title,
  stocks = [],
  isLoading,
  isError,
  handleToggleWatchlist,
  watchlist = [],
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  // useEffect(() => {
  //   if (isError) toast.error('Failed to load stocks')
  // }, [isError])

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
    <div className="bg-white rounded-2xl shadow-md border p-6">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-semibold mb-4 text-[#11193C]">{title}</h2>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
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
        <div className="relative z-30 w-48">
          <Dropdown
            align="left"
            width="48"
            trigger={
              <button className="inline-flex justify-between w-full px-4 py-2 text-base border border-gray-300 bg-white text-gray-900 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">                {selectedCountry === 'all' ? 'All Countries' : selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)}
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            }
          >
            <button
              onClick={() => setSelectedCountry('all')}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${selectedCountry === 'all'
                ? 'font-semibold text-blue-600'
                : 'text-gray-800'
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
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white-100 sticky top-0 z-10">
              <tr className="text-sm text-gray-700 uppercase tracking-wide">
                <th className="px-4 py-3"></th>
                {/* <th className="px-4 py-3 text-center">Symbol</th> */}
                <th className=" text-center">Index</th>
                {/* <th className="px-4 py-3 text-center">Country</th> */}
                <th className="px-4 py-3 text-center">Price</th>
                <th className="px-4 py-3 text-center">Change</th>
                <th className="px-4 py-3 text-center">%</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((item) => {
                const stock = item?.stock || item
                const symbol = stock.symbol?.toUpperCase()
                const price = stock?.stock_price?.price
                const percentChange = stock?.stock_price?.percentage_day
                const priceChange = stock?.stock_price?.price_change_day
                const volume = stock?.stock_price?.volume
                const isStarred = isInWatchlist(stock.id)
                const isPositive = priceChange >= 0 || percentChange >= 0
                const countryName = stock?.country?.name || '-'
                const countryEmoji = stock?.country?.emoji || ''

                return (
                  <tr key={stock.id} className="border-t hover:bg-gray-50 transition duration-150">
                    <td className="text-right">
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
                    </td>
                    {/* <td className="px-4 py-3 font-semibold text-gray-800 text-center">{symbol || '-'}</td> */}
                    <td className="px-4 py-3 text-gray-800 text-center">
                      <div className="flex flex-col items-center">
                        <span>
                          {countryEmoji} {stock.name || '-'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {countryName}
                        </span>
                      </div>
                    </td>

                    {/* <td className="px-4 py-3 capitalize text-gray-800 text-center">
                       {countryName}
                    </td> */}
                    <td className="px-4 py-3 text-gray-800 text-center">{formatNumber(price)}</td>

                    <td className="px-4 py-3 text-center">
                      {priceChange != null ? (
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-700' : 'text-red-700'}`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {isPositive ? `+${priceChange}` : `${(priceChange)}`}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {percentChange != null ? (
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-700' : 'text-red-700'}`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {isPositive ? `+${percentChange}` : `${(percentChange)}`}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <Link
                          href={`/overview/${symbol}`}
                          className="inline-flex items-center gap-3 text-white px-2 py-1 rounded-md hover:bg-green-500 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="black"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                      </div>

                    </td>
                  </tr>
                )
              })}
            </tbody>

          </table>
        </div>
      )}
    </div>
  )
}
