import axios from '@/lib/axios'

export const getIntraday = async (symbol, date = 'latest') => {
    const url = `/api/intraday/${date}?symbols=${symbol}`
    const response = await axios.get(url)
    return response
}
