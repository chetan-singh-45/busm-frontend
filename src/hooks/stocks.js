import useSWR from 'swr'
import { getStocks, createStocks, deleteStock } from '@/services/stock'

export const useStocks = () => {
    const fetcher = async () => {
        const { data } = await getStocks()
        return data
    }

    const { data, error, mutate, isLoading } = useSWR('/api/stocks', fetcher)

    const handleAddStocks = async (stocks) => {
        try {
            await createStocks(stocks)
            mutate()
        } catch (err) {
            throw err.response?.data?.message || 'Addition failed'
        }
    }
    const handleDeleteStock = async (id) => {
        mutate('/api/stocks', currentData => ({
          ...currentData,
          data: currentData.data.filter(stock => stock.id !== id)
        }), false)
      
        try {
          await deleteStock(id)
          mutate('/api/stocks')
          mutate('/api/watchlist')
        } catch (err) {
          mutate('/api/stocks')
          mutate('/api/watchlist')
          throw err.response?.data?.message || 'Delete failed'
        }
      }
    return {
        stocks: data?.data,
        isLoading: isLoading && !data,
        isError: error,
        handleAddStocks,
        handleDeleteStock
    }
}
