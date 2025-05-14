// import useSWR from 'swr'
// import { getNotificationCount } from '@/services/dashboard'

// export const useNotificationCount = () => {
//     const fetcher = async () => {
//         const { data } = await getNotificationCount()
//         return data
//     }

//     const { data, error, mutate, isLoading } = useSWR('/api/getNotificationCount', fetcher)

//     return {
//         notificationCount: data?.data,
//         isLoading: isLoading && !data,
//         mutate,
//         isError: error,
//     }
// }
