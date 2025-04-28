import axios from '@/lib/axios'

export const getWatchlist = () => axios.get('/api/watchlist')
export const createWatchlist = (watchlist) => axios.post('/api/watchlist', watchlist)
export const deleteWatchlist = (id) => axios.delete(`/api/watchlist/${id}`)
export const historyData = (symbol,range) => axios.get(`/api/history?symbol=${symbol}&range=${range}`)