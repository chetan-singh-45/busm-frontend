'use client'

import { useEffect, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import HeadingSection from '@/components/HeadingSection'
import UserSetAlertPopover from '@/components/UserSetAlertPopover'
import { useWatchlist } from '@/hooks/watchlist'
import { useAuth } from '@/hooks/auth'

export default function WatchlistTable() {
  const { watchlist } = useWatchlist()
  const { user } = useAuth()

  const [search, setSearch] = useState('')
  const [showAlertPopover, setShowAlertPopover] = useState(false)
  const [watchlistData, setWatchlistData] = useState([])
  
  useEffect(() => {
    if (watchlist && Array.isArray(watchlist)) {
      const mappedData = watchlist.map((item) => {
        const stock = item.stock || {}
        const stockPrice = stock.stock_price || {}
        const country = stock.country || {}

        const changeEUR = parseFloat(stockPrice.price_change_day || 0)
        const changePct = parseFloat((stockPrice.percentage_day || '0').replace('%', ''))

        const lastUpdated = stockPrice.date || stockPrice.updated_at || 'N/A'

        return {
          name: stock.name || 'N/A',
          last: stockPrice.price || 'N/A',
          high: stockPrice.high || '-',
          low: stockPrice.low || '-',
          changeEUR,
          changePct,
          lastUpdated,
          countryEmoji: getEmojiFromCountryCode(country.iso2),
          region: '', // Optional: map region if needed
          checked: false,
        }
      })

      setWatchlistData(mappedData)
    }
  }, [watchlist])

  const handleCheck = (index) => {
    const updated = [...watchlistData]
    updated[index].checked = !updated[index].checked
    setWatchlistData(updated)
  }

  const handleCheckAll = (e) => {
    const checked = e.target.checked
    const updated = watchlistData.map((item) => ({ ...item, checked }))
    setWatchlistData(updated)
  }

  const filteredData = watchlistData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.countryEmoji.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <HeadingSection title="Your Watchlist" />

      <div className="p-4 bg-white rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Watchlist</h2>

        {/* Search & Alerts */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search stock or country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowAlertPopover(!showAlertPopover)}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600"
            >
              Setup alerts
            </button>

            {showAlertPopover && (
              <div className="absolute right-full top-1/2 -translate-y-1/2 ml-2 z-50">
                <UserSetAlertPopover
                  index={{ name: 'Watchlist Item' }}
                  onClose={() => setShowAlertPopover(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600 border-b">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={filteredData.length > 0 && filteredData.every(item => item.checked)}
                  onChange={handleCheckAll}
                />
              </th>
              <th className="px-4 py-3">Country / Name</th>
              <th className="px-4 py-3 text-right">Last</th>
              <th className="px-4 py-3 text-right">High</th>
              <th className="px-4 py-3 text-right">Low</th>
              <th className="px-4 py-3 text-right">Change (€)</th>
              <th className="px-4 py-3 text-right">Change (%)</th>
              <th className="px-4 py-3 text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No items in this watchlist.
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheck(index)}
                    />
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <span>{item.countryEmoji}</span>
                    <span>{item.name}</span>
                  </td>
                  <td className="px-4 py-2 text-right">{item.last}</td>
                  <td className="px-4 py-2 text-right">{item.high}</td>
                  <td className="px-4 py-2 text-right">{item.low}</td>
                  <td className={`px-4 py-2 text-right ${item.changeEUR >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item.changeEUR >= 0 ? '+' : ''}{item.changeEUR.toFixed(2)}
                  </td>
                  <td className={`px-4 py-2 text-right ${item.changePct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item.changePct >= 0 ? '+' : ''}{item.changePct.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2 text-right">{item.lastUpdated}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

function getEmojiFromCountryCode(code) {
  if (!code) return ''
  return code
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()))
}
