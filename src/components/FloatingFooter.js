import { BellIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/auth' 

export default function FloatingFooter({ selectedItems, selectedCount, onClear, onSetAlert, setShowLoginModal }) {
    
    const {user} = useAuth()

    if (selectedCount === 0) return null

    const handleSetAlert = () => {
    if (!user) return setShowLoginModal(true)
    if (selectedItems.length === 1) {
      onSetAlert(selectedItems[0])
    } else {
      toast.error('Please select only one index to set an alert.')
    }
  }

  const handleAddToWatchlist = () => {
    if (!user) return setShowLoginModal(true)
    toast.success('added')
  }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-[#0A1045] text-white flex items-center justify-between px-6 py-3 shadow-lg">
            <div className="text-sm flex gap-4 items-center">
                <button onClick={onClear} className="hover:underline">
                    Clear All
                </button>
                <span className="text-white/50">|</span>
                <span>{selectedCount} Selected</span>
            </div>
            <div className="flex items-center gap-3">
                <div
                    title={
                        selectedItems.length !== 1
                            ? 'Select a single asset to add an alert'
                            : ''
                    }
                >
                    <button  onClick={handleSetAlert}
                        disabled={selectedItems.length !== 1}
                        className={`w-9 h-9 flex items-center justify-center rounded-full shadow transition
                ${selectedItems.length === 1
                                ? 'bg-white text-[#0A1045] hover:bg-gray-100'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                `}
                    >
                        <BellIcon size={18} />
                    </button>
                </div>
                <button
                    onClick={handleAddToWatchlist}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    Add To Watchlist
                </button>
            </div>
        </div>
    )
}
