import OverviewChart from '@/components/OverviewChart'

const OverviewPage = ({ params, searchParams }) => {
  const { symbol } = params
  const range = searchParams.range || '1d'

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-lg font-semibold">
        Overview: {symbol.toUpperCase()}
      </h1>
      <OverviewChart symbol={symbol} defaultRange={range} />
    </div>
  )
}

export default OverviewPage
