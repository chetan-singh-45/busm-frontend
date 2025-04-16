import useSWR from 'swr'
import { getEod } from '@/services/eod'

export const useEod = (symbol= [], date = 'latest') => {
  
    const shouldFetch = Array.isArray(symbol) && symbol.length > 0

    const fetcher = async () => {
        const { data } = await getEod(symbol, date)
        return data
    }

    const { data, error, mutate, isLoading } = useSWR(shouldFetch ? [symbol, date] : null, fetcher)
    
    return {
        eodData: data?.data,
        isLoading: isLoading && !data,
        isError: error,
        mutate,
     }
}
