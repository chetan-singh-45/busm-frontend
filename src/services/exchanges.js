import axios from '@/lib/axios'

export const getAllExchanges = async () => {
  const response = await axios.get('/api/all-exchanges')
  return response.data
}

export const selectExchangeAPI = async (exchangeId) => {
  return await axios.post('/api/select-exchange', { exchange_id: exchangeId })
}

export const getStocks = async (mic) => {
    try {
      const res = await axios.get('/api/getStocks/'+mic)
      if (res.success == 'false') { 
        throw new Error(`Error fetching stocks: ${res.statusText}`)
      }
      return res.data.data
    } catch (error) {
      console.error('Failed to fetch stocks:', error)
      return null
    }
  }
