import React from 'react';
import Modal from './Modal'; 
import Link from 'next/link';

const SetAlertModal = ({
  isOpen,
  setIsOpen,
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
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Set Alert for ${symbol.toUpperCase()}`}>
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          X
        </button>
      </div>

      <div className="space-y-4 text-sm">
        {/* Indicator Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Technical Indicator</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedIndicator?.id || ''}
            onChange={(e) => {
              const selected = indicators.find(i => i.id === parseInt(e.target.value));
              setSelectedIndicator(selected);
            }}
          >
            <option value="">Select indicator</option>
            {indicators.map((ind) => (
              <option key={ind.id} value={ind.id}>{ind.indicator_name}</option>
            ))}
          </select>
        </div>

        {/* Prediction */}
        <div>
          <label className="block mb-1 font-medium">Prediction</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="prediction"
                value="up"
                checked={prediction === 'up'}
                onChange={() => setPrediction('up')}
              />
              <span>⬆️ Crossing Up</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="prediction"
                value="down"
                checked={prediction === 'down'}
                onChange={() => setPrediction('down')}
              />
              <span>⬇️ Crossing Down</span>
            </label>
          </div>
        </div>

        {/* Timeframe */}
        <div className="mt-4">
          <label className="block mb-1 font-medium">Time Frame</label>
          <select
            name="timeframe"
            className="w-full border rounded px-3 py-2"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            required
          >
            <option value="">Choose Time Frame</option>
            <option value="daily">Daily</option>
            <option value="hourly">Hourly</option>
            <option value="15-min">15-min</option>
          </select>
        </div>

        {/* Expiry */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Set Expiry (in weeks)</label>
          <input
            type="number"
            name="expiry_weeks"
            min="1"
            max="52"
            placeholder="e.g. 1 - 52"
            className="w-full border rounded px-3 py-2"
            value={expiryWeeks}
            onChange={(e) => setExpiryWeeks(e.target.value)}
          />
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
            <Link href="/alert">Manage your alert</Link>
          </button>
          <button
            onClick={() => handleCreateIndicator(prediction, timeframe, expiryWeeks)}
            className="px-4 py-2 text-sm rounded bg-gray-800 text-white hover:bg-gray-700"
          >
            Save Alert
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SetAlertModal;
