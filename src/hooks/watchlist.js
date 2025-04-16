import useSWR from 'swr'
import {getWatchlist, createWatchlist} from '@/services/watchlist'

export const useWatchlist = () => {
    const fetcher = async () => {
        const { data } = await getWatchlist()

        console.log(data.data)

        let wathclist = [
            {
                'stock' : {
                    symbol : 'AAPL'
                },
                'eod' : {

                }
            }
        ]

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

  return {
      watchlist: data?.data,
      isLoading: isLoading && !data,
      isError: error,
      handleAddWatchlist
   }
}
