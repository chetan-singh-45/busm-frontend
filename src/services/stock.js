import axios from '@/lib/axios'

export const getStocks = (mic) => axios.get('/api/stocks',mic)
// export const getStocks = async (mic) => {
//     try {
//       const res = await axios.get('/api/stocks/'+mic)
//       if (res.success == 'false') { 
//         throw new Error(`Error fetching stocks: ${res.statusText}`)
//       }
//       return res.data.data
//     } catch (error) {
//       console.error('Failed to fetch stocks:', error)
//       return null
//     }
//   }
export const createStocks = (stocks) => axios.post('/api/stocks', stocks)