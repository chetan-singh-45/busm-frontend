import useSWR from 'swr'
import { getWatchlist, createWatchlist, deleteWatchlist, historyData } from '@/services/watchlist'

export const useWatchlist = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString()
  const endpoint = `/api/watchlist${queryString ? `?${queryString}` : ''}`

  const fetcher = async () => {
    const { data } = await getWatchlist(filters)
    return data
  }

  const { data, error, mutate, isLoading } = useSWR(endpoint, fetcher)

  const handleAddWatchlist = async (watchlist) => {
    try {
      await createWatchlist(watchlist)
      mutate()
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Addition failed')
    }
  }

  const handleRemoveWatchlist = async (id) => {
    mutate(currentData => {
      if (!currentData) return currentData
      return {
        ...currentData,
        data: currentData.data.filter(stock => stock.id !== id)
      }
    }, false)

    try {
      await deleteWatchlist(id)
      mutate()
    } catch (err) {
      mutate()
      throw new Error(err.response?.data?.message || 'Deletion failed')
    }
  }

  const handleHistoricalData = async (symbol, range) => {
    try {
      const res = await historyData(symbol, range)
      return res
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Data fetch failed')
    }
  }

  return {
    watchlist: data?.data,
    isLoading: isLoading || (!error && !data),
    isError: error,
    handleAddWatchlist,
    handleRemoveWatchlist,
    handleHistoricalData,
  }
}
