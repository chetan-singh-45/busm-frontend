import useSWR from 'swr'
import {getWatchlist, createWatchlist, deleteWatchlist} from '@/services/watchlist'

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
    try {
        await deleteWatchlist(id)
        mutate('/api/watchlist')
    } catch (err) {
        throw err.response?.data?.message || 'Deletion failed'
    }
}


  return {
      watchlist: data?.data,
      isLoading: isLoading && !data,
      isError: error,
      handleAddWatchlist,
      handleRemoveWatchlist
   }
}
