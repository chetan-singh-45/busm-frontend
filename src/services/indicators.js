import axios from '@/lib/axios'

export const getIndicator = () => axios.get('/api/indicators')
export const getSMA = (symbol) => axios.get(`/api/getSMA?symbol=${symbol}`)
export const storeIndicatorStock = (indicator) => axios.post('/api/indicators',indicator)
