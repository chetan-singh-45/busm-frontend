import useSWR from 'swr'
import { getIndicator, getSMA, storeIndicatorStock } from '@/services/indicators'

export const useAllIndicator = (symbol) => {
  const fetcher = async () => {
    const { data } = await getIndicator()
    return data
  }
    
  const smaFetcher = async () => {
    if (!symbol) return null
      const { data } = await getSMA(symbol)
    return data
  }

  const createIndicatorStock = async (indicator) => {
     try {
         await storeIndicatorStock(indicator)
         mutate()
     } catch (err) {
         throw err.response?.data?.message || 'Create failed'
     }
  }

const { data, error, mutate, isLoading } = useSWR('/api/indicators', fetcher)

return {
    indicators: data?.data,
    isLoading: isLoading && !data,
    isError: error,
    smaFetcher,
    createIndicatorStock
}
}