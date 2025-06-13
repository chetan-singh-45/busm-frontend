import useSWR from 'swr'
import { getIndicator, getSMA, storeIndicatorStock, deleteUserAlert, updateUserAlert} from '@/services/indicators'
import { useAuth } from '@/hooks/auth';

export const useAllIndicator = (symbol) => {
  const { user } = useAuth();

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

  //delete user alert
  //  const handleDeleteUserAlert = async (id) => {
  //     try {
  //       await deleteUserAlert(id)
  //       mutate()
  //     } catch (err) {
  //       throw err.response?.data?.message || 'Delete failed'
  //     }
  //   }

  //update user alert
  const handleUpdateUserAlert = async (data, id) => {
    try {
      await updateUserAlert(data, id)
      mutate()
    } catch (err) {
      throw err.response?.data?.message || 'Update failed'
    }
  }

const { data, error, mutate, isLoading } = useSWR('/api/indicators', fetcher)

return {
    indicators: data?.data,
    isLoading: isLoading && !data,
    isError: error,
    smaFetcher,
    createIndicatorStock,
    handleUpdateUserAlert,
  }
}