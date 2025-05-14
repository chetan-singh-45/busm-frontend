import axios from '@/lib/axios'

export const getAdminStats = () => axios.get('/api/admin/dashboard')