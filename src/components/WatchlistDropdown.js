'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

const WatchlistPopover = ({ watchlist, onClose }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleClickOutside = (e) => {
      if (
        !e.target.closest('#watchlist-popover') &&
        !e.target.closest('#watchlist-button')
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  if (!mounted || typeof window === 'undefined') return null

  return createPortal(
    <div
      id="watchlist-popover"
      className="fixed top-24 right-6 w-[460px] bg-white border border-gray-200 rounded-lg shadow-2xl z-[9999]"
    >
      <div className="p-3 max-h-96 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-700 border-b">
              <th className="pb-1">Name</th>
              <th className="pb-1 text-right">Price</th>
              <th className="pb-1 text-right">Chg.</th>
              <th className="pb-1 text-right">Chg. %</th>
            </tr>
          </thead>
          <tbody>
            {watchlist?.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-2 text-gray-500">
                  No items
                </td>
              </tr>
            ) : (
              watchlist.map((item, index) => {
                const stock = item.stock
                const price = parseFloat(stock.stock_price?.price || 0).toLocaleString()
                const chg = parseFloat(stock.stock_price?.price_change_day || 0)
                const chgPercent = parseFloat(stock.stock_price?.percent_change_day || 0)
                const isUp = chg > 0

                return (
                  <tr key={index} className="border-t">
                    <td className="py-1 font-semibold text-blue-700">{stock.name}</td>
                    <td className="py-1 text-right">{price}</td>
                    <td className={`py-1 text-right ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                      {isUp ? '+' : ''}
                      {chg}
                    </td>
                    <td className={`py-1 text-right ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                      {isUp ? '+' : ''}
                      {chgPercent.toFixed(2)}%
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-100 px-3 py-2 text-center text-sm">
        <Link href="/watchlist" className="text-blue-600 hover:underline">
          View Full Watchlist
        </Link>
      </div>
    </div>,
    document.body
  )
}

export default WatchlistPopover
