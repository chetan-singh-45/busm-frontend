import useSWR from 'swr'
import {getWatchlist, createWatchlist, deleteWatchlist, historyData} from '@/services/watchlist'

export const useWatchlist = () => {
    const fetcher = async () => {
        const { data } = await getWatchlist()
        return data
    }

const { data, error, mutate, isLoading } = useSWR('/api/watchlist', fetcher)

const handleAddWatchlist = async (watchlist) => {
    try {
        await createWatchlist(watchlist)
        mutate()
    } catch (err) {
        throw err.response?.data?.message || 'Addition failed'
    }
}

const handleRemoveWatchlist = async (id) => {
   mutate(currentData => {
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
    throw err.response?.data?.message || 'Deletion failed'
  }
}

const handleHistoricalData = async (symbol,range) => {
    try {
        const res = await historyData(symbol, range)
        return res 
    } catch (err) {
        throw err.response?.data?.message || 'Data fetch failed'
    }
}


  return {
      watchlist: data?.data,
      isLoading: isLoading && !data,
      isError: error,
      handleAddWatchlist,
      handleRemoveWatchlist,
      handleHistoricalData,
   }
}
