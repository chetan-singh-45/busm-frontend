'use client'

import { useEffect, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import HeadingSection from '@/components/HeadingSection'
import { useWatchlist } from '@/hooks/watchlist'
import FloatingFooter from '@/components/FloatingFooter'
import { useAuth } from '@/hooks/auth'
import { Toaster, toast } from 'react-hot-toast'
import ComingSoon from '@/components/ComingSoon';

export default function Watchlist() {
  
  const { user } = useAuth()
  const {watchlist, handleAddWatchlist } = useWatchlist()
  const [search, setSearch] = useState('')
  const [watchlistData, setWatchlistData] = useState([])

  useEffect(() => {
      if (user && watchlist?.length >= 0) {
        const savedItems = JSON.parse(localStorage.getItem('pendingWatchlist') || '[]')
        const filtered = savedItems.filter(item =>
          !watchlist.some(w => w.stock_id === item.id)
        )

        if (filtered.length > 0) {
          localStorage.removeItem('pendingWatchlist')
          Promise.all(filtered.map(item => handleAddWatchlist({ stock_id: item.id })))
            .then(() => {
              toast.success('Index added to your watchlist.')
            })
            .catch(() => {
              toast.error('Failed to sync some watchlist items.')
            })
        }
      }
    }, [user, watchlist])

  useEffect(() => {
    if (watchlist && Array.isArray(watchlist)) {
      const mappedData = watchlist.map((item) => {
        const stock = item.stock || {}
        const stockPrice = stock.stock_price || {}
        const country = stock.country.name || 'N/A'
        const changeEUR = parseFloat(stockPrice.price_change_day || 0)
        const changePct = parseFloat((stockPrice.percentage_day || '0').replace('%', ''))
        const lastUpdated = stockPrice.date || stockPrice.updated_at || 'N/A'

        return {
          id: stock.id, 
          name: stock.name || 'N/A',
          last: stockPrice.price || 'N/A',
          high: stockPrice.high || '-',
          low: stockPrice.low || '-',
          changeEUR,
          changePct,
          lastUpdated,
          countryEmoji: stock.country.emoji,
          country,
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
    item.country.toLowerCase().includes(search.toLowerCase())
  )

  const selectedItems = watchlistData.filter(item => item.checked)

  return (
    <>
     <ComingSoon />
      {/* <HeadingSection title="Your Watchlist" />
        <Toaster position="top-right" />

      <div className="p-4 sm:p-6 bg-white rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Watchlist</h2> */}

        {/* Search */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="relative w-full sm:max-w-sm">
            <input
              type="text"
              placeholder="Search stock or country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div> */}

        {/* Responsive Table */}
        {/* <div className="w-full overflow-x-auto sm:overflow-visible min-h-auto">
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
                <th className="px-4 py-3 text-right hidden sm:table-cell">High</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Low</th>
                <th className="px-4 py-3 text-right">Change (€)</th>
                <th className="px-4 py-3 text-right">Change (%)</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Last Updated</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No items in this watchlist.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleCheck(index)}
                      />
                    </td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <div className="relative group flex items-center">
                        <span>{item.countryEmoji}</span>
                        <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
                          {item.country}
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                        </div>
                      </div>
                      <span className="truncate max-w-[120px]">{item.name}</span>
                    </td>
                    <td className="px-4 py-2 text-right">{item.last}</td>
                    <td className="px-4 py-2 text-right hidden sm:table-cell">{item.high}</td>
                    <td className="px-4 py-2 text-right hidden sm:table-cell">{item.low}</td>
                    <td className={`px-4 py-2 text-right ${item.changeEUR >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {item.changeEUR >= 0 ? '+' : ''}{item.changeEUR.toFixed(2)}
                    </td>
                    <td className={`px-4 py-2 text-right ${item.changePct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {item.changePct >= 0 ? '+' : ''}{item.changePct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 text-right hidden md:table-cell">{item.lastUpdated}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedItems.length > 0 && (
          <FloatingFooter
            selectedItems={selectedItems}
            selectedCount={selectedItems.length}
            onClear={() => {
              setWatchlistData(prev =>
                prev.map(item => ({ ...item, checked: false }))
              )
            }}
          />
        )}
      </div> */}
    </>
  )
}
