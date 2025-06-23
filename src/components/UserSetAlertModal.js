'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BellIcon } from 'lucide-react'

export default function UserSetAlertModal({ index, onClose }) {
  const [isAdding, setIsAdding] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleAddToWatchlist = () => {
    setIsAdding(true)
    setTimeout(() => {
      toast.success(`${index.name} added to your watchlist!`)
      setIsAdding(false)
      setShowAlert(false)
      onClose()
    }, 800)
  }

  return (
    <>
      {/* Main Modal */}
      <Transition appear show={!!index} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
          <div className="min-h-screen px-4 text-center bg-black bg-opacity-40">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title className="text-lg font-bold text-gray-900 mb-4">
                  Set Technical Alert for {index?.name} ({index?.country})
                </Dialog.Title>

                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex gap-2 items-center">
                    <span className="text-xl">{index?.countryEmoji}</span>
                    <span className="font-medium">{index?.name}</span>
                  </div>
                  <div>
                    Last Price: <strong>{index?.last}</strong>
                  </div>
                  <div>
                    Change:{' '}
                    <span
                      className={
                        index?.changeEUR > 0
                          ? 'text-green-600'
                          : index?.changeEUR < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }
                    >
                      {index?.changeEUR > 0 ? '+' : ''}
                      {index?.changeEUR} €
                    </span>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Choose Signal Direction</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1">
                        <input type="radio" name="signal" defaultChecked />
                        <span>Crossing Up</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="radio" name="signal" />
                        <span>Crossing Down</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-900 border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddToWatchlist}
                    disabled={isAdding}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    {isAdding ? 'Saving...' : 'Save The Alert'}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Footer Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0A1045] text-white flex items-center justify-between px-6 py-3 z-40 shadow-md">
        <div className="text-sm flex gap-4 items-center">
          <button className="hover:underline">Clear All</button>
          <span className="text-white/50">|</span>
          <span>1 Selected</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAlert(true)}
            className="w-9 h-9 flex items-center justify-center bg-white text-[#0A1045] rounded-full shadow"
          >
            <BellIcon size={18} />
          </button>

          <button
            onClick={handleAddToWatchlist}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add To Watchlist
          </button>
        </div>
      </div>
    </>
  )
}
