import axios from '@/lib/axios'

export const getEod = async (symbol, date = 'latest') => {
    const url = `/api/eod/${date}?symbols=${symbol}`
    const response = await axios.get(url)
    return response
}
