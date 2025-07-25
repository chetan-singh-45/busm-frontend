import { useState } from 'react'
import { BellIcon, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/auth'
import { useWatchlist } from '@/hooks/watchlist'
import UserSetAlertPopover from '@/components/UserSetAlertPopover'
import { useAllIndicator } from '@/hooks/indicators'

export default function FloatingFooter({ selectedItems, selectedCount, onClear, setShowLoginModal, refreshUserAlerts }) {
 
  const { user } = useAuth()
  const { watchlist,mutate, handleAddWatchlist, handleRemoveWatchlist } = useWatchlist()
  const symbol = selectedItems?.[0]?.stock?.symbol          
  const { indicators, smaFetcher, createIndicatorStock } = useAllIndicator(symbol)
  // const { indicators, smaFetcher, createIndicatorStock } = useAllIndicator(selectedItems?.[0]?.stock?.symbol)
  const [showPopover, setShowPopover] = useState(false)
  const [selectedIndicator, setSelectedIndicator] = useState(null)
  const [modalData, setModalData] = useState({ sma: null, lastPrice: null })
  const [prediction, setPrediction] = useState('up') 
  const [timeframe, setTimeframe] = useState('daily')
  const [expiryWeeks, setExpiryWeeks] = useState('1')
  const [loading, setLoading] = useState(false)
  const [successIndex, setSuccessIndex] = useState(null)
  

  if (selectedCount === 0) return null

  const selected = selectedItems[0]
  const isSingle = selectedItems.length === 1

  const allInWatchlist = watchlist?.length
  ? selectedItems.every(item =>
      watchlist.some(w => w.stock_id === item.id)
    )
  : false


  const handleSetAlert = () => {
    if (!user) return setShowLoginModal(true)
    if (!isSingle) return toast.error('Select only one index to set an alert.')
    setShowPopover(prev => !prev)
    setSuccessIndex(null)
    handleIndicatorData(indicators?.id)
  }

  const handleIndicatorData = async (indicator) => {
    try {
      setSelectedIndicator(indicator)
      const res = await smaFetcher(symbol)
      setModalData({
        sma: res.data.sma_200,
        lastPrice: res.data.latest_close,
      })
    } catch (err) {
      toast.error('Failed to load SMA data')
    }
  }

  const handleCreateIndicator = () => {
    const payload = {
      indicator_id: selectedIndicator.id,
      stock_symbol: symbol,
      user_id: user.id,
      sma_price: modalData.sma,
      last_price: modalData.lastPrice,
      prediction,
      timeframe,
      expiry_weeks: parseInt(expiryWeeks, 10),
    }

    setLoading(true)
    createIndicatorStock(payload)
      .then(() => {
        toast.success(`Alert saved successfully`)
          // setShowPopover(false)
        setSuccessIndex(selected.id)
        refreshUserAlerts()
      })
      .catch(() => toast.error('Failed to create indicator entry'))
      .finally(() => setLoading(false))
  }


  const handleWatchlistToggle = async () => {
    if (!user) {
      localStorage.setItem('pendingWatchlist', JSON.stringify(selectedItems))
      return setShowLoginModal(true)
    }

    try {
      const itemsToRemove = selectedItems.filter(item =>
        watchlist.some(w => w.stock_id === item.id)
      )
      const itemsToAdd = selectedItems.filter(item =>
        !watchlist.some(w => w.stock_id === item.id)
      )

      if (itemsToRemove.length === selectedItems.length) {
        await Promise.all(
          itemsToRemove.map(item => {
            const match = watchlist.find(w => w.stock_id === item.id)
            return handleRemoveWatchlist(match.id)
          })
        )
        toast.success('Removed from your watchlist!')
      } else if (itemsToAdd.length > 0) {
        await Promise.all(
          itemsToAdd.map(item => handleAddWatchlist({ stock_id: item.id }))
        )
        toast.success('Added to your watchlist!')
      }
      await mutate()
    } catch (err) {
      toast.error('Failed to update watchlist.')
    }
  }


  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-[#0A1045] text-white flex items-center justify-between px-6 py-3 shadow-lg">
      <div className="text-sm flex gap-4 items-center">
        <button onClick={onClear} className="hover:underline">Clear All</button>
        <span className="text-white/50">|</span>
        <span>{selectedCount} Selected</span>
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Alert button */}
        <div className="relative">
          <button
            onClick={handleSetAlert}
            disabled={!isSingle}
            className={`w-9 h-9 flex items-center justify-center rounded-full shadow transition
              ${isSingle
                ? 'bg-white text-[#0A1045] hover:bg-gray-100'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            <BellIcon size={18} />
          </button>

          {showPopover && isSingle && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50">
              <UserSetAlertPopover
                index={selected}
                onClose={() => setShowPopover(false)}
                symbol={symbol}
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
                successIndex={successIndex}
                setSuccessIndex={setSuccessIndex}
              />
            </div>
          )}
        </div>

        {/* Toggle Watchlist Button */}
        <button
          onClick={handleWatchlistToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
            allInWatchlist
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          <Star
            className={allInWatchlist ? 'text-yellow-400' : 'text-gray-500'}
            size={18}
            fill={allInWatchlist ? 'currentColor' : 'none'}
          />
          {allInWatchlist ? 'Added' : 'Add to Watchlist'}
        </button>
      </div>
    </div>
  )
}
