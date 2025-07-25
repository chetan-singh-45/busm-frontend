'use client'

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'

import Header from '@/app/(app)/Header'
import Loading from '@/app/(app)/loading'
import { useAllExchanges, useSelectExchange } from '@/hooks/exchanges'
import { useAuth } from '@/hooks/auth'

const Exchanges = () => {

  const { user } = useAuth()
  const { exchanges, isLoading, isError, mutate } = useAllExchanges()
  const selectExchange = useSelectExchange()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const openModal = () => setIsOpen(true)
  const closeModal = () => {
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleSelect = async (exchange) => {
    const selectedExchanges = exchanges?.allExchanges?.filter(e => e.is_selected === 1)
    if (selectedExchanges?.some(e => e.id === exchange.id)) {
      alert('Exchange already selected')
      return
    }

    try {
      await selectExchange(exchange.id)
      mutate()
      closeModal()
    } catch (err) {
      console.log('Error selecting exchange:', err)
    }
  }

  const filteredExchanges = exchanges?.allExchanges?.filter(exchange =>
    exchange.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedExchanges = exchanges?.allExchanges?.filter(e => e.is_selected === 1)

  return (
    <>
      <Header title="Exchanges" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-2xl text-gray-800">Selected Exchanges</h2>
                {
                  user?.role == 1 && 
                <button
                  onClick={openModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  + Add Exchange
                </button>
                }
              </div>

              {isLoading && <Loading />}
              {isError && <div className="text-red-500">Error fetching exchanges</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                { selectedExchanges?.map((exchange) => (
                  <div
                    key={exchange.id}
                    className="rounded-xl border border-gray-200 p-5 shadow hover:shadow-lg transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link href={`/exchanges/${exchange.mic}`}>
                        {exchange.name}
                      </Link>
                    </h3>
                    <p className="underline text-sm text-gray-600 hover:text-gray-900">
                      {exchange.description || 'No description available.'}
                    </p>
                  </div>
                ))}
              </div>

              {selectedExchanges?.length === 0 && (
                <div className="text-center text-gray-500 mt-4">No selected exchanges yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                    Add Exchange
                  </Dialog.Title>

                  <input
                    type="text"
                    placeholder="Search exchanges..."
                    className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {filteredExchanges?.map((exchange) => (
                      <div
                        key={exchange.id}
                        onClick={() => handleSelect(exchange)}
                        className="cursor-pointer border px-4 py-2 rounded-md hover:bg-gray-100"
                      >
                        <div className="font-medium">{exchange.name}</div>
                        <div className="text-sm text-gray-500">{exchange.description}</div>
                        {exchange.is_selected === 1 && (
                          <div className="text-green-500 text-sm mt-1">Selected</div>
                        )}
                      </div>
                    ))}
                    {filteredExchanges?.length === 0 && (
                      <div className="text-gray-500 text-sm">No results found.</div>
                    )}
                  </div>

                  <div className="mt-4 text-right">
                    <button
                      onClick={closeModal}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Exchanges
