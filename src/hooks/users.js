import useSWR from 'swr'
import { getUsers, createUser, updateUser, deleteUser } from '@/services/users'

export const useAllUser = () => {
  const fetcher = async () => {
    const { data } = await getUsers()
    return data
  }

  const { data, error, mutate, isLoading } = useSWR('/api/users', fetcher)

  const handleCreateUser = async (user) => {
    try {
      await createUser(user)
      mutate()
    } catch (err) {
      throw err.response?.data?.message || 'Create failed'
    }
  }

  const handleUpdateUser = async (user, id) => {
    try {
      await updateUser(user, id)
      mutate()
    } catch (err) {
      throw err.response?.data?.message || 'Update failed'
    }
  }

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id)
      mutate()
    } catch (err) {
      throw err.response?.data?.message || 'Delete failed'
    }
  }

  return {
    users: data?.alluser,
    isLoading: isLoading && !data,
    isError: error,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser
  }
}
