import axios from '@/lib/axios'

export const getAllExchanges = async () => {
  const response = await axios.get('/api/all-exchanges')
  return response.data
}

export const selectExchangeAPI = async (exchangeId) => {
  return await axios.post('/api/select-exchange', { exchange_id: exchangeId })
}

export const getStocks = async (mic, limit = 100, offset = 0) => {
    try {
      const res = await fetch(
        `http://api.marketstack.com/v2/exchanges/${mic}/tickers?access_key=${process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY}&limit=${limit}&offset=${offset}`
      )
  
      if (!res.ok) {
        throw new Error(`Error fetching stocks: ${res.statusText}`)
      }
  
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Failed to fetch stocks:', error)
      return null
    }
  }
  
  
