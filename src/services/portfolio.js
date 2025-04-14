import axios from '@/lib/axios'

export const getPortfolio = () => axios.get('/api/portfolios')
export const createPortfolio = (portfolio) => axios.post('/api/portfolios', portfolio)
