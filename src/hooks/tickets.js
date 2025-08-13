import useSWR from 'swr'
import {getTickets, createTickets, showTickets, replyTickets,updateTicketStatus} from '@/services/tickets'
import { useAuth } from '@/hooks/auth';

export const useTickets = () => {
  const { user } = useAuth();

  const fetcher = async () => {
    const { data } = await getTickets()
    return data
  }
    
  const storeTickets = async (ticket) => {
     try {
         await createTickets(ticket)
         mutate()
     } catch (err) {
         throw err.response?.data?.message || 'Create failed'
     }
  }

  const getTicketWithReplies = async (id) => {
    const { data } = await showTickets(id)
    return data 
  }
  
  const sendReply = async (id, reply) => {
    await replyTickets(reply, id)
    mutate()
    return await getTicketWithReplies(id)
  }

  const changeStatus = async (id, status) => {
    await updateTicketStatus(id, status)
    mutate()
  }

const { data, error, mutate, isLoading } = useSWR('/api/tickets', fetcher, {
  revalidateOnFocus: false,      //  Don't refetch when switching tabs
  revalidateOnReconnect: false,  //  Don't refetch on network reconnect
  refreshInterval: 0,            //  No polling
  dedupingInterval: 10000,       //  Optional: prevents repeat calls within 10s
})

return {
    tickets: data?.data,
    isLoading: isLoading && !data,
    isError: error,
    storeTickets,
    getTicketWithReplies,
    sendReply,
    changeStatus
  }
}