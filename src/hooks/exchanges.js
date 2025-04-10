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
    mutate
  }
}

export const getStocks = async (mic) => {
  return fetch(`http://api.marketstack.com/v2/exchanges/${mic}/tickers?access_key=35f2fc6c10e80ec4d44a2045b602124b`)
}
