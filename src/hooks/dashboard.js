import useSWR from 'swr'
import { getAdminStats } from '@/services/dashboard'

export const useDashboard = () => {
    const fetcher = async () => {
        const { data } = await getAdminStats()
        return data
    }
    
    const { data, error, isLoading } = useSWR('/api/admin/dashboard', fetcher)
    
    return {
        stats: data?.data,
        isLoading: isLoading && !data,
        isError: error,
    }
}


