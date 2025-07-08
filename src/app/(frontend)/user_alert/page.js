'use client'

import { useState } from 'react'
import { Pencil, Trash2, Mail } from 'lucide-react'
import HeadingSection from "@/components/HeadingSection"

const sampleData = [
  { flag: '🇺🇸', name: 'Dow Jones', alert: 'SMA 200', direction: 'Crossing Up', timeframe: 'Daily', notify: true, enabled: true },
  { flag: '🇺🇸', name: 'S&P 500', alert: 'SMA 200', direction: 'Crossing Down', timeframe: 'Hourly', notify: true, enabled: true },
  { flag: '🇺🇸', name: 'Nasdaq', alert: 'SMA 200', direction: 'Crossing Up', timeframe: '15 minute', notify: true, enabled: true },
  { flag: '🇨🇦', name: 'Small Cap 2000', alert: 'SMA 200', direction: 'Crossing Down', timeframe: 'Hourly', notify: true, enabled: true },
  { flag: '🇦🇪', name: 'S&P 500 VIX', alert: 'SMA 200', direction: 'Crossing Down', timeframe: '15 minute', notify: true, enabled: true },
  { flag: '🇬🇧', name: 'S&P/TSX', alert: 'SMA 200', direction: 'Crossing Up', timeframe: 'Hourly', notify: true, enabled: true },
  { flag: '🇮🇹', name: 'Bovespa', alert: 'SMA 200', direction: 'Crossing Up', timeframe: 'Hourly', notify: true, enabled: true },
]

export default function AlertCenter() {
  const [data, setData] = useState(sampleData)

  const toggleStatus = (index) => {
    const updatedData = [...data]
    updatedData[index].enabled = !updatedData[index].enabled
    setData(updatedData)
  }

  return (
    <>
   <HeadingSection title="Alert Center" />
    <div className="p-4 bg-white rounded-xl shadow-md overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700">
        <thead>
          <tr className="text-left bg-gray-100 text-gray-600">
            <th className="px-4 py-3">Country / Name</th>
            <th className="px-4 py-3">Alert Options</th>
            <th className="px-4 py-3">Signal Direction</th>
            <th className="px-4 py-3">Time Frame</th>
            <th className="px-4 py-3">Notification Method</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 flex items-center gap-2">
                <span>{row.flag}</span>
                <span>{row.name}</span>
              </td>
              <td className="px-4 py-2">{row.alert}</td>
              <td className="px-4 py-2">{row.direction}</td>
              <td className="px-4 py-2">{row.timeframe}</td>
              <td className="px-4 py-2">
                {row.notify && <Mail size={16} className="text-gray-600" />}
              </td>
              <td className="px-4 py-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={() => toggleStatus(i)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-checked:bg-green-500 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative peer-checked:after:translate-x-4" />
                </label>
              </td>
              <td className="px-4 py-2 flex gap-3 items-center">
                <Pencil size={16} className="text-gray-600 cursor-pointer hover:text-blue-500" />
                <Trash2 size={16} className="text-red-500 cursor-pointer hover:text-red-600" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  )
}