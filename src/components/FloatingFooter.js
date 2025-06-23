import { BellIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function FloatingFooter({ selectedItems, selectedCount, onClear }) {
  if (selectedCount === 0) return null

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
        <button
          onClick={() =>
            toast.success(`Set alert for ${selectedItems.map((i) => i.name).join(', ')}`)
          }
          className="w-9 h-9 flex items-center justify-center bg-white text-[#0A1045] rounded-full shadow"
        >
          <BellIcon size={18} />
        </button>

        <button
          onClick={() =>
            toast.success(`${selectedItems.map((i) => i.name).join(', ')} added to watchlist`)
          }
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add To Watchlist
        </button>
      </div>
    </div>
  )
}
