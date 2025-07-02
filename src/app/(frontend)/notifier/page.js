'use client'

import { useState } from 'react'
import HeadingSection from "@/components/HeadingSection"
import IndexesSidebar from '@/components/IndexesSidebar'
import IndexesTable from '@/components/IndexesTable'
import { Toaster } from 'react-hot-toast'
import { useStocks } from '@/hooks/stocks'

export default function Notifier() {
  const { stocks, isLoading, isError } = useStocks()
  const [selectedRegion, setSelectedRegion] = useState('Europe')
  const [selectedIndexName, setSelectedIndexName] = useState(null)
  
  const formattedData = (stocks || [])
    .map(stock => {
      const price = stock.stock_price
      const changePct = price?.percentage_day?.replace('%', '') ?? null

      return {
        stock:stock,
        id: stock.id,
        name: stock.name,
        last: price?.price ?? null,
        high: price?.high ?? null,
        low: price?.low ?? null,
        changeEUR: price?.price_change_day ? parseFloat(price.price_change_day) : null,
        changePct: changePct ? parseFloat(changePct) : null,
        lastUpdated: price?.date ?? null,
        countryEmoji: stock.country?.emoji ?? '',
        countryName: stock.country?.name ?? '',
        region: stock.country?.region ?? '',
        checked: false,
      }
    })
    .filter(item => item.region === selectedRegion)

  const handleIndexSelect = (index) => {
    setSelectedIndexName(prev => (prev?.id === index?.id ? null : index))
  }

  return (
    <>
      <HeadingSection title="Major World Market Indices" />
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row gap-6">
        <IndexesSidebar
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        <IndexesTable
          data={formattedData}
          isLoading={isLoading}
          isError={isError}
          onSelectIndex={handleIndexSelect}
        />
      </div>
    </>
  )
}
