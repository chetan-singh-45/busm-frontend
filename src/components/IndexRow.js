'use client'

import { toast } from 'react-hot-toast'

export default function IndexRow({ item, index, isSelected, onToggle, onSelect }) {
  const getChangeStyle = (change) =>
    change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'

  return (
    <tr
      className={`border-t transition duration-150 ${
        isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
      }`}
    >
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={onToggle}
          />
          <span
            className="flex items-center gap-1 cursor-pointer"
            onClick={onSelect}
          >
            <span>{item.countryEmoji}</span>
            <span>{item.name}</span>
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">{item.last}</td>
      <td className="px-4 py-3 text-right">{item.high}</td>
      <td className="px-4 py-3 text-right">{item.low}</td>
      <td className={`px-4 py-3 text-right ${getChangeStyle(item.changeEUR)}`}>
        {item.changeEUR > 0 ? '+' : ''}
        {item.changeEUR}
      </td>
      <td className={`px-4 py-3 text-right ${getChangeStyle(item.changePct)}`}>
        {item.changePct > 0 ? '+' : ''}
        {item.changePct}
      </td>
      <td className="px-4 py-3 text-right">{item.lastUpdated}</td>
    </tr>
  )
}
