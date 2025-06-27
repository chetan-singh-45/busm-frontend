'use client'

import { useState } from 'react'
import { X, Plus, Star } from 'lucide-react'

const sampleWatchlists = ['My Watchlist', 'watchlist 2']

export default function AddToWatchlistPopover({ onClose }) {
  const [watchlists, setWatchlists] = useState(
    sampleWatchlists.map((name) => ({
      name,
      checked: false,
      saved: false,
      showOpen: false,
    }))
  )
  const [creating, setCreating] = useState(false)
  const [newListName, setNewListName] = useState('')

  const handleToggle = (index) => {
    const updated = [...watchlists]
    updated[index].checked = !updated[index].checked

    if (updated[index].checked) {
      updated[index].saved = false
      updated[index].showOpen = false
      setWatchlists([...updated])
      setTimeout(() => {
        updated[index].saved = true
        setWatchlists([...updated])
        setTimeout(() => {
          updated[index].showOpen = true
          setWatchlists([...updated])
        }, 1200)
      }, 600)
    } else {
      updated[index].saved = false
      updated[index].showOpen = false
      setWatchlists([...updated])
    }
  }

  const handleAddNew = () => {
    if (!newListName.trim()) return
    const newEntry = {
      name: newListName,
      checked: true,
      saved: false,
      showOpen: false,
    }
    setWatchlists((prev) => [...prev, newEntry])
    setCreating(false)
    setNewListName('')
    setTimeout(() => {
      setWatchlists((prev) =>
        prev.map((wl) =>
          wl.name === newEntry.name ? { ...wl, saved: true } : wl
        )
      )
      setTimeout(() => {
        setWatchlists((prev) =>
          prev.map((wl) =>
            wl.name === newEntry.name ? { ...wl, showOpen: true } : wl
          )
        )
      }, 1200)
    }, 600)
  }

  const handleDone = () => {
    onClose?.()
  }
  
  return (
    <>
    <div className="w-80 rounded-md border shadow bg-white text-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Star size={16} className="text-yellow-500" />
            Add to Watchlist
        </div>
        <X className="h-4 w-4 text-gray-500 cursor-pointer" onClick={handleDone} />
      </div>


      {/* Watchlist Items */}
      <div className="max-h-60 overflow-y-auto divide-y">
        {watchlists.map((wl, index) => (
          <div key={index} className="flex justify-between items-center px-4 py-2 hover:bg-gray-50">
            <label className="flex items-center gap-2 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={wl.checked}
                onChange={() => handleToggle(index)}
              />
              <span className="text-gray-800">{wl.name}</span>
            </label>

            <div className="text-xs text-right min-w-[50px] text-green-600">
              {wl.checked && (
                wl.showOpen ? (
                  <a href="/watchlist" className="text-blue-600 hover:underline">Open</a>
                ) : wl.saved ? (
                  <span>Saved!</span>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Done Button */}
      <div className="px-4 py-3">
        <button
          onClick={handleDone}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-full font-medium"
        >
          Done
        </button>
      </div>

      {/* Create New Watchlist */}
      <div className="border-t px-4 py-2 text-sm">
        {creating ? (
          <div className="flex items-center gap-2">
           <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="border px-2 py-1 rounded w-full text-sm bg-white text-black"
              placeholder="New Watchlist Name"
            />

            <button onClick={handleAddNew} className="text-blue-600 hover:underline">Save</button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="text-blue-600 flex items-center gap-1 hover:underline"
          >
            <Plus size={14} /> Create New Watchlist
          </button>
        )}
      </div>
          <div className="absolute -bottom-1 right-8 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 border border-t border-l z-10"></div>
    </div>
    </>
  )
}
