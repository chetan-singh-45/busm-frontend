import axios from '@/lib/axios'

export const getNotificationCount = () => axios.get('/api/getNotificationCount')
export const getStocksCount = () => axios.get('/api/getStocksCount')
export const getExchangesCount = () => axios.get('/api/getExchangesCount')