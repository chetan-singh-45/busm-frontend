'use client'

import { useState, useRef, useEffect } from 'react'
import { useTickets } from '@/hooks/tickets'
import { useAuth } from '@/hooks/auth'

const statusColors = {
  open: 'bg-green-500 text-white',
  pending: 'bg-yellow-400 text-black',
  closed: 'bg-red-500 text-white',
  'in-progress': 'bg-orange-500 text-white',
  resolved: 'bg-green-300 text-black'
}

export default function TicketsPage() {
  const { user } = useAuth()
  const { tickets, getTicketWithReplies, sendReply, changeStatus } = useTickets()

  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replies, setReplies] = useState([])
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const currentUserRole = user?.role == 1 ? 'admin' : 'user'

  const sortReplies = list =>
    [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket)
    const ticketData = await getTicketWithReplies(ticket.id)
    setReplies(sortReplies(ticketData?.data?.ticket_replies || []))
  }

  const handleReply = async () => {
    if (!message.trim() || !selectedTicket) return
    const updatedTicket = await sendReply(selectedTicket.id, { reply: message })
    setReplies(sortReplies(updatedTicket?.data?.ticket_replies || []))
    setMessage('')
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [replies])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-full sm:w-1/3 lg:w-1/4 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Tickets</h2>
        </div>
        <ul className="overflow-y-auto flex-1 p-2 space-y-2">
          {tickets?.map((ticket) => (
            <li
              key={ticket.id}
              onClick={() => handleSelectTicket(ticket)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedTicket?.id === ticket.id
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {/* Avatar Circle */}
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 font-bold text-sm">
                {ticket.name?.[0]?.toUpperCase()}
              </div>

              {/* Ticket info */}
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{ticket.name}</p>
                </div>
                <p className="text-xs truncate opacity-80">{ticket.query}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Section */}
      <section className="flex-1 flex flex-col bg-gray-50">
        {selectedTicket ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              {/* Left: Avatar + Name + Ticket No */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  {selectedTicket.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedTicket.name}</h3>
                </div>
                <span className="ml-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  #{selectedTicket.ticket_no}
                </span>
              </div>

              {/* Right: Status Control */}
              <div className="flex items-center gap-2">
                {user?.role == 1 ? (
                  <select
                    value={selectedTicket?.status || 'open'}
                    onChange={async (e) => {
                      const next = e.target.value
                      try {
                        await changeStatus(selectedTicket.id, next)
                        setSelectedTicket(prev => ({ ...prev, status: next }))
                      } catch (err) {
                        console.error(err)
                      }
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-full capitalize cursor-pointer border-0 focus:ring-2 focus:ring-offset-1 ${statusColors[selectedTicket?.status] || 'bg-gray-300 text-black'}`}
                  >
                    <option value="open" className="bg-green-500 text-white">Open</option>
                    <option value="pending" className="bg-yellow-400 text-black">Pending</option>
                    <option value="closed" className="bg-red-500 text-white">Closed</option>
                  </select>
                ) : (
                  <span className={`${statusColors[selectedTicket?.status] || 'bg-gray-300 text-black'} text-xs px-3 py-1 rounded-full capitalize`}>
                    {selectedTicket?.status}
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollContainerRef}>
              {replies.length === 0 && (
                <p className="text-gray-400 text-center">No replies yet.</p>
              )}
              {replies.map((reply) => {
                const isMine = reply.reply_type == currentUserRole
                return (
                  <div key={reply.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-lg px-4 py-2 shadow ${isMine ? 'bg-green-100' : 'bg-white border'}`}>
                      <p className="text-sm text-gray-800">{reply.reply}</p>
                      <span className="block text-xs text-gray-500 mt-1">
                        {new Date(reply.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t flex gap-2">
              <textarea
                placeholder="Type your reply..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg resize-none h-12 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleReply}
                className="bg-green-500 text-white px-5 rounded-lg hover:bg-green-600 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a ticket to view conversation
          </div>
        )}
      </section>
    </div>
  )
}
