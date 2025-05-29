import axios from '@/lib/axios'

export const getStocks = (mic) => axios.get('/api/stocks',mic)
export const createStocks = (stocks) => axios.post('/api/stocks', stocks)
export const deleteStock = (id) => axios.delete(`/api/stocks/${id}`)
// export const getIndexInfo = (id) => axios.get(`/api/getIndexInfo/${id}`)