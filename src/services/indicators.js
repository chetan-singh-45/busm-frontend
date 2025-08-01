import axios from '@/lib/axios'

export const getIndicator = () => axios.get('/api/indicators')
export const getSMA = (symbol) => axios.get(`/api/getSMA?symbol=${symbol}`)
export const storeIndicatorStock = (indicator) => axios.post('/api/indicators',indicator)

//for user alert
export const getUserAlert = (id) => axios.get(`/api/userIndicators/${id}`)
export const deleteUserAlert = (id) => axios.delete(`/api/userIndicator/${id}`)
export const updateUserAlert = (data,id) => axios.post(`/api/userIndicator/${id}`,data)
export const updateUserAlertStatus = (data,id) => axios.post(`/api/alertStatus/${id}`,data)