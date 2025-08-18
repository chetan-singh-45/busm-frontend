'use client'

import { useState, useEffect, useRef } from 'react'
import { useTickets } from '@/hooks/tickets'
import { useAuth } from '@/hooks/auth'

const statusColors = {
  open: 'bg-green-500 text-white',
  pending: 'bg-yellow-400 text-black',
  closed: 'bg-red-500 text-white'
}

export default function TicketsPage() {
  const { user } = useAuth()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replies, setReplies] = useState([])
  const [message, setMessage] = useState('')

  const { tickets, pagination, getTicketWithReplies, sendReply, changeStatus } =
    useTickets(page, search, status)
  const messagesEndRef = useRef(null)
  const currentUserRole = user?.role == 1 ? 'admin' : 'user'

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [replies])

  const sortReplies = (list) => [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket)
    const ticketData = await getTicketWithReplies(ticket.id)
    setReplies(sortReplies(ticketData?.data?.ticket_replies || []))
  }

  const handleReply = async () => {
    if (!message.trim()) return
    const updated = await sendReply(selectedTicket.id, { reply: message })
    setReplies(sortReplies(updated?.data?.ticket_replies || []))
    setMessage('')
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-full sm:w-1/3 lg:w-1/4 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">All Tickets</h2>
        </div>
        {/* Filters */}
        <div className="p-4 border-b space-y-3">
          {/* <input
            type="text"
            placeholder="Search tickets..."
            className="w-full border rounded px-3 py-2"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          /> */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Pagination */}
        {pagination.total > pagination.per_page && (
          <div className="flex justify-between items-center p-3 border-t">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {pagination.current_page} of {pagination.last_page}</span>
            <button
              disabled={page >= pagination.last_page}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Ticket List */}
        <ul className="overflow-y-auto flex-1 p-2 space-y-2">
          {tickets?.data?.map((ticket) => (
            <li
              key={ticket.id}
              onClick={() => handleSelectTicket(ticket)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition ${selectedTicket?.id === ticket.id
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-gray-100'
                }`}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 font-bold">
                {ticket.name?.[0]?.toUpperCase()}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{ticket.name}</p>
                <p className="text-xs truncate opacity-80">{ticket.query}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.status] || 'bg-gray-300 text-black'}`}>
                {ticket.status}
              </span>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  {selectedTicket.name?.[0]?.toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-800">{selectedTicket.name}</h3>
                <span className="ml-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  #{selectedTicket.ticket_no}
                </span>
              </div>

              {user?.role == 1 ? (
                <select
                  value={selectedTicket?.status}
                  onChange={async (e) => {
                    const next = e.target.value
                    await changeStatus(selectedTicket.id, next)
                    setSelectedTicket(prev => ({ ...prev, status: next }))
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-full capitalize cursor-pointer border-0 focus:ring-2 ${statusColors[selectedTicket?.status]}`}
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              ) : (
                <span className={`${statusColors[selectedTicket?.status]} text-xs px-3 py-1 rounded-full capitalize`}>
                  {selectedTicket?.status}
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {replies.length === 0 && <p className="text-gray-400 text-center">No replies yet.</p>}
              {replies.map((reply) => {
                const isMine = reply.reply_type == currentUserRole
                return (
                  <div key={reply.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-lg px-4 py-2 shadow ${isMine ? 'bg-green-100' : 'bg-white border'}`}>
                      <p className="text-sm">{reply.reply}</p>
                      <span className="block text-xs text-gray-500 mt-1">
                        {new Date(reply.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Box */}
            <div className="p-4 bg-white border-t flex gap-2">
              <textarea
                placeholder="Type your reply..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg resize-none h-12 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleReply}
                className="bg-green-500 text-white px-5 rounded-lg hover:bg-green-600"
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
