'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function UserSetAlertModal({ index, onClose }) {
  const  user = useAuth()
  const router = useRouter()

  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [signalDirection, setSignalDirection] = useState('up')
  const [timeFrame, setTimeFrame] = useState('daily')
  const [emailNotify, setEmailNotify] = useState(false)

  const handleSaveAlert = () => {
    setIsAdding(true)
    setTimeout(() => {
      setIsAdding(false)
      setIsSuccess(true)
    }, 800)
  }

  const handleClose = () => {
    setIsSuccess(false)
    onClose()
  }

  return (
    <Transition appear show={!!index} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={handleClose}>
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

          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

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

              {isSuccess ? (
                // ✅ SUCCESS UI
                <div className="text-center">
                  <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
                  <h2 className="text-lg font-semibold text-green-700 mb-2">Alert Created Successfully</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    When the alert is triggered, you'll be notified by email.
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        toast.success('Viewing alert...')
                        // router.push('/alerts') // optional
                      }}
                      className="w-full border border-gray-300 py-2 rounded-full text-sm hover:bg-gray-100"
                    >
                      View Alert
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                // 🔧 FORM UI
                <>
                  <Dialog.Title className="text-lg font-bold text-gray-900 mb-4">
                    Set Technical Alert for {index?.name} ({index?.countryEmoji})
                  </Dialog.Title>

                  <div className="space-y-5 text-sm text-gray-700">
                    <div>
                      <label className="block font-medium mb-1">Configure Alert Options</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500">
                        <option>Choose a Technical Tool</option>
                        <option>SMA 200</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Choose Signal Direction</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="signal"
                            value="up"
                            checked={signalDirection === 'up'}
                            onChange={() => setSignalDirection('up')}
                          />
                          Crossing Up
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="signal"
                            value="down"
                            checked={signalDirection === 'down'}
                            onChange={() => setSignalDirection('down')}
                          />
                          Crossing Down
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Choose Time Frame</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="time"
                            value="daily"
                            checked={timeFrame === 'daily'}
                            onChange={() => setTimeFrame('daily')}
                          />
                          Daily
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="time"
                            value="hourly"
                            checked={timeFrame === 'hourly'}
                            onChange={() => setTimeFrame('hourly')}
                          />
                          Hourly
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="time"
                            value="15min"
                            checked={timeFrame === '15min'}
                            onChange={() => setTimeFrame('15min')}
                          />
                          15 minutes
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Choose Notification Method</label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={emailNotify}
                          onChange={(e) => setEmailNotify(e.target.checked)}
                        />
                        Email
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between gap-3 mt-6">
                    <button
                      onClick={handleSaveAlert}
                      disabled={isAdding}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium w-full text-center"
                    >
                      {isAdding ? 'Saving...' : 'Save The Alert'}
                    </button>
                    <button
                      onClick={handleClose}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md w-full"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
