'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'

export default function UserSetAlertPopover({ 
  index,
  onClose, 
  symbol = '',
  indicators = [],
  selectedIndicator,
  setSelectedIndicator,
  prediction,
  setPrediction,
  timeframe,
  setTimeframe,
  expiryWeeks,
  setExpiryWeeks,
  handleCreateIndicator,
  successIndex,
}) {

  const [isAdding, setIsAdding] = useState(false)
  const [emailNotify, setEmailNotify] = useState(false)
  const [showValidation, setShowValidation] = useState(false);

  const handleSaveAlert = () => {
    const isMissingIndicator = !selectedIndicator;
    const isMissingEmail = !emailNotify;
    if (isMissingIndicator || isMissingEmail) {
      setShowValidation(true);
      if (isMissingIndicator) toast.error('Please select a technical tool');
      if (isMissingEmail) toast.error('Please enable email notifications');
      return;
    }

    setShowValidation(false);
    setIsAdding(true);

    setTimeout(() => {
      setIsAdding(false);
      handleCreateIndicator(prediction, timeframe, expiryWeeks);
    }, 800);
  }
  
  return (
    <div className="relative z-50">
      {/* Tail */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-md border border-gray-200 z-0" />

      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-5 w-80 text-sm text-gray-800 z-10">
        {successIndex === index?.id  ? (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-600 mb-3" size={40} />
            <h2 className="text-lg font-semibold text-green-700 mb-2">Alert Created!</h2>
            <p className="text-sm text-gray-500 mb-3">You will be notified via email when triggered.</p>
            <button
              onClick={() => {
                onClose();
                }}
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
                className={`w-full border ${!selectedIndicator && showValidation ? 'border-red-500' : 'border-gray-300'} rounded-full px-3 py-2 text-sm`}
                value={selectedIndicator?.id || ''}
                onChange={(e) => {
                  const selected = indicators.find(i => i.id === parseInt(e.target.value));
                  setSelectedIndicator(selected);
                }}
              >
                <option value="">Choose a Technical Tool</option>
                {indicators.map((tool) => (
                  <option key={tool.id} value={tool.id}>
                    {tool.indicator_name}
                  </option>
                ))}
              </select>

              {/* Show validation message */}
              {!selectedIndicator && showValidation && (
                <p className="text-red-500 text-xs mt-1">Please select a technical tool.</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium mb-1">Choose Signal Direction</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="signal"
                    value="up"
                    checked={prediction === 'up'}
                    onChange={() => setPrediction('up')}
                    className="accent-green-500"
                  />
                  <span>Crossing Up</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="signal"
                    value="down"
                    checked={prediction === 'down'}
                    onChange={() => setPrediction('down')}
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
                    checked={timeframe === 'daily'}
                    onChange={() => setTimeframe('daily')}
                    className="accent-green-500"
                  />
                  <span>Daily</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="timeframe"
                    value="hourly"
                    checked={timeframe === 'hourly'}
                    onChange={() => setTimeframe('hourly')}
                    className="accent-green-500"
                  />
                  <span>Hourly</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="radio"
                    name="timeframe"
                    value="15-min"
                    checked={timeframe === '15-min'}
                    onChange={() => setTimeframe('15-min')}
                    className="accent-green-500"
                  />
                  <span>15 minutes</span>
                </label>
              </div>
            </div>
           
           <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">Set Expiry (in weeks)</label>
              <input
                type="number"
                name="expiry_weeks"
                min="1"
                max="52"
                placeholder="1 - 52"
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                value={expiryWeeks}
                onChange={(e) => setExpiryWeeks(e.target.value)}
              />
            </div>
  
            <div className="mb-4 mt-2">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="accent-green-500"
                />
                Email <span className="text-red-500">*</span>
              </label>
              {!emailNotify && showValidation && (
                <p className="text-red-500 text-xs mt-1">Please enable email notifications.</p>
              )}
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
