import axios from '@/lib/axios'

export const getAdminStats = () => axios.get('/api/admin/dashboard')
export const getActiveUsers = () => axios.get('/api/admin/active_users')
export const getWeeklyUsers = () => axios.get('/api/admin/weekly_users')

