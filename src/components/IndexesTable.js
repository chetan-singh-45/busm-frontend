'use client'

import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import IndexRow from '@/components/IndexRow'
import FloatingFooter from '@/components/FloatingFooter'
import UserSetAlertModal from '@/components/UserSetAlertModal'
import LoginRegisterModal from '@/components/LoginRegisterModal'

export default function IndexesTable({
  data,
  isError,
  onCheckboxClick,
}) {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState(null)
  const [localData, setLocalData] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [showAlertModalFor, setShowAlertModalFor] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (data?.length) {
        const cleaned = data.map(item => ({ ...item, checked: false }))
        setLocalData(cleaned)
    }
  }, [data])


  useEffect(() => {
    if (isError) {
      toast.error('Failed to load indexes.')
    }
  }, [isError])

  const handleCheckboxToggle = (index) => {
    const updatedData = [...localData]
    updatedData[index].checked = !updatedData[index].checked
    setLocalData(updatedData)
    onCheckboxClick?.(updatedData[index])

    // Update selectedIndex based on checked state
    if (updatedData[index].checked) {
        setSelectedIndex(updatedData[index])
    } else if (selectedIndex?.name === updatedData[index].name) {
        setSelectedIndex(null)
    }
   }

  const filteredData = localData.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchRegion = !region || item.region === region
    return matchSearch && matchRegion
  })

  return (
    <div className="flex flex-col flex-1">
      <Toaster />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Country/Name..."
          className="w-full sm:w-80 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={localData.length > 0 && localData.every((item) => item.checked)}
                    onChange={(e) => {
                        const checked = e.target.checked
                        const updated = localData.map((item) => ({ ...item, checked }))
                        setLocalData(updated)
                        if (!checked) {
                        setSelectedIndex(null)
                        }
                    }}
                    />
                    <span>Country / Name</span>
                </div>
                </th>
                <th className="px-4 py-3 text-right">Last</th>
                <th className="px-4 py-3 text-right">High</th>
                <th className="px-4 py-3 text-right">Low</th>
                <th className="px-4 py-3 text-right">Change (€)</th>
                <th className="px-4 py-3 text-right">Change (%)</th>
                <th className="px-4 py-3 text-right">Last Updated</th>
            </tr>
            </thead>

          <tbody className="text-sm text-gray-800">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No index found.
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <IndexRow
                    key={item.name}
                    item={item}
                    index={index}
                    isSelected={selectedIndex?.name === item.name}
                    onToggle={() => handleCheckboxToggle(index)}
                    onSelect={() => setSelectedIndex(selectedIndex?.name === item.name ? null : item)}
                />
              ))
            )}
          </tbody>
        </table>

        <FloatingFooter
            selectedItems={localData.filter((item) => item.checked)}
            selectedCount={localData.filter((item) => item.checked).length}
            onClear={() => {
                setLocalData((prev) =>
                prev.map((item) => ({ ...item, checked: false }))
                )
                setSelectedIndex(null)
            }}
            onSetAlert={(item) => setShowAlertModalFor(item)}
            setShowLoginModal={setShowLoginModal}
        />

        <LoginRegisterModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
       />
        
        <UserSetAlertModal
        index={showAlertModalFor}
        onClose={() => setShowAlertModalFor(null)}
        />

      </div>
    </div>
  )
}
