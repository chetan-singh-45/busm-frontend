'use client'

import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import HeadingSection from "@/components/HeadingSection"
import UserSetAlertPopover from '@/components/UserSetAlertPopover'

const defaultData = [
  {
    name: 'FTSE 100',
    last: '8,163.67',
    high: '8,200.00',
    low: '8,120.00',
    changeEUR: 45.23,
    changePct: 0.56,
    lastUpdated: '29/05',
    countryEmoji: '🇬🇧',
    region: 'Europe',
    checked: false,
  },
  {
    name: 'DAX',
    last: '18,492.00',
    high: '18,600.00',
    low: '18,400.00',
    changeEUR: -9.56,
    changePct: -0.05,
    lastUpdated: '29/05',
    countryEmoji: '🇩🇪',
    region: 'Europe',
    checked: false,
  },
  {
    name: 'CAC 40',
    last: '7,925.15',
    high: '7,950.00',
    low: '7,880.00',
    changeEUR: 22.85,
    changePct: 0.29,
    lastUpdated: '29/05',
    countryEmoji: '🇫🇷',
    region: 'Europe',
    checked: false,
  },
]

export default function WatchlistTable() {
  const [watchlists, setWatchlists] = useState(['My Watchlist', 'My Watchlist 2'])
  const [activeTab, setActiveTab] = useState('My Watchlist')

  const [watchlistData, setWatchlistData] = useState({
    'My Watchlist': defaultData,
    'My Watchlist 2': defaultData,
  })

  const [search, setSearch] = useState('')
  const [showAlertPopover, setShowAlertPopover] = useState(false)
  const [creatingNew, setCreatingNew] = useState(false)
  const [newWatchlistName, setNewWatchlistName] = useState('')

  const currentData = watchlistData[activeTab] || []

  const handleCheck = (index) => {
    const updated = [...currentData]
    updated[index].checked = !updated[index].checked
    setWatchlistData({ ...watchlistData, [activeTab]: updated })
  }

  const handleCheckAll = (e) => {
    const checked = e.target.checked
    const updated = currentData.map(item => ({ ...item, checked }))
    setWatchlistData({ ...watchlistData, [activeTab]: updated })
  }

  const filteredData = currentData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.countryEmoji.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreateWatchlist = () => {
    const trimmed = newWatchlistName.trim()
    if (!trimmed || watchlists.includes(trimmed)) return
    setWatchlists([...watchlists, trimmed])
    setWatchlistData({ ...watchlistData, [trimmed]: [] }) // empty watchlist
    setActiveTab(trimmed)
    setNewWatchlistName('')
    setCreatingNew(false)
  }

  return (
    <>
      <HeadingSection title="Major World Market Indices" />

      <div className="p-4 bg-white rounded-xl shadow">
        {/* Tabs */}
        <div className="flex mb-4 items-center gap-2">
          {watchlists.map((name, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(name)}
              className={`px-4 py-2 rounded-t-md font-medium shadow ${
                activeTab === name ? 'bg-white text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              {name}
            </button>
          ))}
          {creatingNew ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
                placeholder="New Watchlist"
              />
              <button
                onClick={handleCreateWatchlist}
                className="text-green-600 hover:underline text-sm"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreatingNew(true)}
              className="text-xl text-gray-400 hover:text-black"
              title="Create new watchlist"
            >
              +
            </button>
          )}
        </div>

        {/* Active Watchlist Title */}
        <h2 className="text-lg font-semibold mb-2">{activeTab}</h2>

        {/* Search & Alerts */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="EUR/USD or AAPL"
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
                  index={{ name: 'Dow Jones Industrial Average' }}
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
                    {item.changeEUR > 0 ? '+' : ''}{item.changeEUR.toFixed(2)}
                  </td>
                  <td className={`px-4 py-2 text-right ${item.changePct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item.changePct > 0 ? '+' : ''}{item.changePct.toFixed(2)}%
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
