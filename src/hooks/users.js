import useSWR from 'swr'
import axios from '@/lib/axios'

export const useAllUser = () => {
  const fetcher = async (url) => {
    const { data } = await axios.get(url)
    return data
  }

  const { data, error, mutate } = useSWR('/api/users', fetcher)
  return {
    users: data?.alluser,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export const updateUser = async (user,id) => {
  return axios.post(`/api/users/update/${id}`, user)
}