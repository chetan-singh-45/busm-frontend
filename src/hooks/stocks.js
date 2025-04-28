import useSWR from 'swr'
import { getStocks, createStocks } from '@/services/stock'

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

    return {
        stocks: data?.data,
        isLoading: isLoading && !data,
        isError: error,
        handleAddStocks,
    }
}
