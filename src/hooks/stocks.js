import useSWR from 'swr'
import axios from '@/lib/axios'

export const useExchageWithTickers = () => {
  const fetcher = async (url) => {
    const { data } = await axios.get(url)
    return data
  }

  const { data, error, mutate } = useSWR('/api/exchageWithTickers', fetcher)

  return {
    stocks: data,
    isLoading: !error && !data,
    isError: error,
    mutate, 
  }
}
