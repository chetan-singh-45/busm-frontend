import useSWR from 'swr'
import { getAllExchanges, selectExchangeAPI , getStocks} from '@/services/exchanges'

export const useAllExchanges = () => {
  const { data, error, mutate } = useSWR('/api/all-exchanges', getAllExchanges)

  return {
    exchanges: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export const useSelectExchange = () => {
  return selectExchangeAPI
}

export const useGetStocks = () =>{
  return getStocks();
}