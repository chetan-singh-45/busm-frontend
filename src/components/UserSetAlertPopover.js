'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'

export default function UserSetAlertPopover({ index, onClose }) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [signalDirection, setSignalDirection] = useState('up')
  const [timeFrame, setTimeFrame] = useState('daily')
  const [emailNotify, setEmailNotify] = useState(false)
  const [tool, setTool] = useState('')

  const handleSaveAlert = () => {
    if (!tool) {
      toast.error('Please select a technical tool')
      return
    }
    setIsAdding(true)
    setTimeout(() => {
      setIsAdding(false)
      setIsSuccess(true)
      toast.success('Alert Created!')
    }, 800)
  }

  return (
    <div className="relative z-50">
      {/* Tail */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-md border border-gray-200 z-0" />

      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-5 w-80 text-sm text-gray-800 z-10">
        {isSuccess ? (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-600 mb-3" size={40} />
            <h2 className="text-lg font-semibold text-green-700 mb-2">Alert Created!</h2>
            <p className="text-sm text-gray-500 mb-3">You will be notified via email when triggered.</p>
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-full text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-sm mb-4">Set Technical Alert for {index?.name}</h3>

            <div className="mb-4">
              <label className="block text-xs font-medium mb-1">Configure Alert Options</label>
              <select
                className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm"
                value={tool}
                onChange={(e) => setTool(e.target.value)}
              >
                <option value="">Choose a Technical Tool</option>
                <option value="sma200">SMA 200</option>
                <option value="ema50">EMA 50</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium mb-1">Choose Signal Direction</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="signal"
                    value="up"
                    checked={signalDirection === 'up'}
                    onChange={() => setSignalDirection('up')}
                    className="accent-green-500"
                  />
                  <span>Crossing Up</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="signal"
                    value="down"
                    checked={signalDirection === 'down'}
                    onChange={() => setSignalDirection('down')}
                    className="accent-green-500"
                  />
                  <span>Crossing Down</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium mb-1">Choose Time Frame</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="timeframe"
                    value="daily"
                    checked={timeFrame === 'daily'}
                    onChange={() => setTimeFrame('daily')}
                    className="accent-green-500"
                  />
                  <span>Daily</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="timeframe"
                    value="hourly"
                    checked={timeFrame === 'hourly'}
                    onChange={() => setTimeFrame('hourly')}
                    className="accent-green-500"
                  />
                  <span>Hourly</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="timeframe"
                    value="15min"
                    checked={timeFrame === '15min'}
                    onChange={() => setTimeFrame('15min')}
                    className="accent-green-500"
                  />
                  <span>15 minutes</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="accent-green-500"
                />
                Email
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveAlert}
                disabled={isAdding}
                className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded-full text-sm font-semibold"
              >
                {isAdding ? 'Saving...' : 'Save The Alert'}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-full py-2 rounded-full text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
