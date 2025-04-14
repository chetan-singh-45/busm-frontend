import useSWR from 'swr'
import { getPortfolio, createPortfolio } from '@/services/portfolio'

export const useAllPortfolio = () => {
  const fetcher = async () => {
    const { data } = await getPortfolio()
    return data
  }

  const { data, error, mutate, isLoading } = useSWR('/api/portfolios', fetcher)

const handleCreatePortfolio = async (portfolio) => {
    try {
        await createPortfolio(portfolio)
        mutate()
    } catch (err) {
        throw err.response?.data?.message || 'Create failed'
    }
}

const handleUpdatePortfolio = async (portfolio, id) => {
    try {
        await updatePortfolio(portfolio, id)
        mutate()
    } catch (err) {
        throw err.response?.data?.message || 'Update failed'
    }
}

const handleDeletePortfolio = async (id) => {
    try {
        await deletePortfolio(id)
        mutate()
    } catch (err) {
        throw err.response?.data?.message || 'Delete failed'
    }
}

return {
    portfolios: data,
    isLoading: isLoading && !data,
    isError: error,
    handleCreatePortfolio,
    handleUpdatePortfolio,
    handleDeletePortfolio
}
}
