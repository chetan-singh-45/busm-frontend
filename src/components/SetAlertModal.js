import React from 'react';
import Modal from './Modal'; 
import Link from 'next/link';

const SetAlertModal = ({
  isOpen,
  loading,
  setIsOpen,
  symbol = '',
  stockName = '',
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
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Set Technical Alert for ${stockName}`}>
      <div className="relative p-4 text-sm">
        {/* Indicator Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Configure Alert Options</label>
          <select
            className="w-full border rounded-full px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            value={selectedIndicator?.id || ''}
            onChange={(e) => {
              const selected = indicators.find(i => i.id === parseInt(e.target.value));
              setSelectedIndicator(selected);
            }}
          >
            <option value="">Choose a Technical Tool</option>
            {indicators.map((ind) => (
              <option key={ind.id} value={ind.id}>{ind.indicator_name}</option>
            ))}
          </select>
        </div>

        {/* Prediction */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Choose Signal Direction</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="prediction"
                value="up"
                checked={prediction === 'up'}
                onChange={() => setPrediction('up')}
                className="accent-blue-600"
              />
              <span>Crossing Up</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="prediction"
                value="down"
                checked={prediction === 'down'}
                onChange={() => setPrediction('down')}
                className="accent-blue-600"
              />
              <span>Crossing Down</span>
            </label>
          </div>
        </div>

        {/* Time Frame */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Choose Time Frame</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="timeframe"
                value="daily"
                checked={timeframe === 'daily'}
                onChange={() => setTimeframe('daily')}
                className="accent-blue-600"
              />
              <span>Daily</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="timeframe"
                value="hourly"
                checked={timeframe === 'hourly'}
                onChange={() => setTimeframe('hourly')}
                className="accent-blue-600"
              />
              <span>Hourly</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="timeframe"
                value="15-min"
                checked={timeframe === '15-min'}
                onChange={() => setTimeframe('15-min')}
                className="accent-blue-600"
              />
              <span>15 minutes</span>
            </label>
          </div>
        </div>

        {/* Expiry Input */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Set Expiry (in weeks)</label>
          <input
            type="number"
            min="1"
            max="52"
            className="w-full border rounded-full px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="1"
            value={expiryWeeks}
            onChange={(e) => setExpiryWeeks(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <Link href="/alert">
              <button className="px-4 py-2 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                Manage your alert
              </button>
            </Link>
            
             <button
              onClick={() => handleCreateIndicator(prediction, timeframe, expiryWeeks)}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-white ${
                loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save The Alert'}
            </button>
            {/* <button
              onClick={() => handleCreateIndicator(prediction, timeframe, expiryWeeks)}
              className="px-4 py-2 rounded-full text-white bg-green-600 hover:bg-green-700"
            >
              Save The Alert
            </button> */}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SetAlertModal;
