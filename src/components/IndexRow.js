'use client'

// import { toast } from 'react-hot-toast'

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
         <div className="relative group cursor-pointer">
          <span>{item.countryEmoji}</span>

          {/* Tooltip */}
          <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            <div className="relative bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              {item.countryName}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>
        </div>
          <span>{item.name}</span>
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
