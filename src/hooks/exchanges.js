import useSWR from 'swr'
import axios from '@/lib/axios'

export const useAllExchanges = () => {
  const fetcher = async (url) => {
    const { data } = await axios.get(url)
    return data
  }

  const { data, error, mutate } = useSWR('/api/all-exchanges', fetcher)

  return {
    exchanges: data,
    isLoading: !error && !data,
    isError: error,
    mutate, 
  }
}
