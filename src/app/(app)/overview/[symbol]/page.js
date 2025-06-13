import OverviewChart from '@/components/OverviewChart'

const OverviewPage = ({ params, searchParams }) => {
  const { symbol } = params
  const range = searchParams.range || '1D'

  return (
    <div className="max-w-5xl mx-auto p-6">
      <OverviewChart symbol={symbol} defaultRange={range} />
    </div>
  )
}

export default OverviewPage
