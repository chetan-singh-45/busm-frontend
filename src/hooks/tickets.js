// hooks/tickets.js
import useSWR from 'swr'
import { getTickets, createTickets, showTickets, replyTickets, updateTicketStatus } from '@/services/tickets'
import { useAuth } from '@/hooks/auth'

export const useTickets = (page = 1, search = '', status = '') => {
  const { user } = useAuth()

  const fetcher = async () => {
    const { data } = await getTickets({ page, search, status })
    return data
  }

  const { data, error, mutate, isLoading } = useSWR(
    ['/api/tickets', page, search, status],
    fetcher,
    { revalidateOnFocus: false }
  )

  const storeTickets = async (ticket) => {
    await createTickets(ticket)
    mutate()
  }

  const getTicketWithReplies = async (id) => {
    const { data } = await showTickets(id)
    return data
  }

  const sendReply = async (id, reply) => {
    const updated = await replyTickets(reply, id)
    mutate()
    return updated
  }

  const changeStatus = async (id, status) => {
    await updateTicketStatus(id, status)
    mutate()
  }

  return {
    tickets: data?.data || [],
    pagination: data?.data || {},    
    isLoading: isLoading && !data,
    isError: error,
    storeTickets,
    getTicketWithReplies,
    sendReply,
    changeStatus
  }
}
