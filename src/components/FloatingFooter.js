import { useState } from 'react'
import { BellIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/auth'
import UserSetAlertPopover from '@/components/UserSetAlertPopover'
import AddToWatchlistPopover from '@/components/AddToWatchlistPopover'

export default function FloatingFooter({ selectedItems, selectedCount, onClear, setShowLoginModal }) {
  const { user } = useAuth()
  const [showPopover, setShowPopover] = useState(false)
  const [showWatchlistPopover, setShowWatchlistPopover] = useState(false)

  if (selectedCount === 0) return null

  const handleSetAlert = () => {
    if (!user) return setShowLoginModal(true)

    if (selectedItems.length === 1) {
      setShowPopover((prev) => !prev)
      setShowWatchlistPopover(false)
    } else {
      toast.error('Please select only one index to set an alert.')
    }
  }

  const handleAddToWatchlist = () => {
  if (!user) {
    // Save selected indexes to localStorage before showing login modal
    localStorage.setItem('pendingWatchlist', JSON.stringify(selectedItems))
    return setShowLoginModal(true)
  }

  setShowWatchlistPopover((prev) => !prev)
  setShowPopover(false)
}


  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-[#0A1045] text-white flex items-center justify-between px-6 py-3 shadow-lg">
      <div className="text-sm flex gap-4 items-center">
        <button onClick={onClear} className="hover:underline">Clear All</button>
        <span className="text-white/50">|</span>
        <span>{selectedCount} Selected</span>
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Set Alert Button & Popover */}
        <div className="relative">
          <button
            onClick={handleSetAlert}
            disabled={selectedItems.length !== 1 ? 'Select a single asset to add an alert' : ''}
            className={`w-9 h-9 flex items-center justify-center rounded-full shadow transition
              ${selectedItems.length === 1
                ? 'bg-white text-[#0A1045] hover:bg-gray-100'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            <BellIcon size={18} />
          </button>

          {showPopover && selectedItems.length === 1 && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50">
              <UserSetAlertPopover
                index={selectedItems[0]}
                onClose={() => setShowPopover(false)}
              />
            </div>
          )}
        </div>

        {/* Add to Watchlist Button & Popover */}
        <div className="relative">
          <button
            onClick={handleAddToWatchlist}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            Add To Watchlist
          </button>

          {showWatchlistPopover && (
            <div className="absolute bottom-12 right-0 z-50">
              <AddToWatchlistPopover onClose={() => setShowWatchlistPopover(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
