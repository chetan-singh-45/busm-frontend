import axios from '@/lib/axios'

export const getUsers = () => axios.get('/api/users')
export const createUser = (user) => axios.post('/api/users', user)
export const updateUser = (user, id) => axios.post(`/api/users/update/${id}`, user)
export const deleteUser = (id) => axios.delete(`/api/users/${id}`)
    