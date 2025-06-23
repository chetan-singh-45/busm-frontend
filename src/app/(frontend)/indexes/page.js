'use client'

import { useState } from 'react'
import HeadingSection from "@/components/HeadingSection"
import IndexesSidebar from '@/components/IndexesSidebar'
import IndexesTable from '@/components/IndexesTable'
import UserSetAlertModal from '@/components/UserSetAlertModal'
import { Toaster } from 'react-hot-toast'

export default function Indexes() {
  const [selectedRegion, setSelectedRegion] = useState('Europe')
  const [selectedAlertIndex, setSelectedAlertIndex] = useState(null)
  const [selectedIndexName, setSelectedIndexName] = useState(null)

   const data = [
    {
      name: 'FTSE 100',
      last: '8,163.67',
      high: '8,200.00',
      low: '8,120.00',
      changeEUR: 45.23,
      changePct: 0.56,
      lastUpdated: '29/05',
      countryEmoji: '🇬🇧',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'DAX',
      last: '18,492.00',
      high: '18,600.00',
      low: '18,400.00',
      changeEUR: -9.56,
      changePct: -0.05,
      lastUpdated: '29/05',
      countryEmoji: '🇩🇪',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'CAC 40',
      last: '7,925.15',
      high: '7,950.00',
      low: '7,880.00',
      changeEUR: 22.85,
      changePct: 0.29,
      lastUpdated: '29/05',
      countryEmoji: '🇫🇷',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'AEX',
      last: '897.34',
      high: '900.00',
      low: '885.00',
      changeEUR: 5.60,
      changePct: 0.63,
      lastUpdated: '29/05',
      countryEmoji: '🇳🇱',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'BEL 20',
      last: '3,885.20',
      high: '3,900.00',
      low: '3,850.00',
      changeEUR: -12.14,
      changePct: -0.31,
      lastUpdated: '29/05',
      countryEmoji: '🇧🇪',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'BSE SOFIX',
      last: '700.34',
      high: '705.00',
      low: '695.00',
      changeEUR: 1.28,
      changePct: 0.18,
      lastUpdated: '29/05',
      countryEmoji: '🇧🇬',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'SMI',
      last: '11,980.45',
      high: '12,000.00',
      low: '11,950.00',
      changeEUR: 18.92,
      changePct: 0.16,
      lastUpdated: '29/05',
      countryEmoji: '🇨🇭',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'FTSE MIB',
      last: '34,215.77',
      high: '34,300.00',
      low: '34,000.00',
      changeEUR: -35.22,
      changePct: -0.10,
      lastUpdated: '29/05',
      countryEmoji: '🇮🇹',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'IBEX 35',
      last: '11,275.88',
      high: '11,300.00',
      low: '11,200.00',
      changeEUR: 12.80,
      changePct: 0.11,
      lastUpdated: '29/05',
      countryEmoji: '🇪🇸',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'ATX',
      last: '3,500.65',
      high: '3,525.00',
      low: '3,480.00',
      changeEUR: -4.15,
      changePct: -0.12,
      lastUpdated: '29/05',
      countryEmoji: '🇦🇹',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'OMXS30',
      last: '2,415.40',
      high: '2,430.00',
      low: '2,400.00',
      changeEUR: 7.50,
      changePct: 0.31,
      lastUpdated: '29/05',
      countryEmoji: '🇸🇪',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'OMXC20',
      last: '2,240.10',
      high: '2,250.00',
      low: '2,220.00',
      changeEUR: -10.44,
      changePct: -0.46,
      lastUpdated: '29/05',
      countryEmoji: '🇩🇰',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'OMX Helsinki',
      last: '9,780.56',
      high: '9,800.00',
      low: '9,750.00',
      changeEUR: 4.62,
      changePct: 0.05,
      lastUpdated: '29/05',
      countryEmoji: '🇫🇮',
      region: 'Europe',
      checked: false,
    },
    {
      name: 'OSLO OBX',
      last: '1,225.80',
      high: '1,230.00',
      low: '1,215.00',
      changeEUR: -6.38,
      changePct: -0.52,
      lastUpdated: '29/05',
      countryEmoji: '🇳🇴',
      region: 'Europe',
      checked: false,
    },
  ]


  const handleIndexSelect = (index) => {
    setSelectedIndexName(prev =>
      prev?.name === index?.name ? null : index
    )
  }

  const handleCloseModal = () => {
    setSelectedAlertIndex(null)
  }

  return (
    <>
      <HeadingSection title="Major World Market Indices" />

      <div className="flex flex-col sm:flex-row gap-6">
        <IndexesSidebar
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        <IndexesTable
          data={data}
          isLoading={false}
          isError={false}
          selectedIndexName={selectedIndexName?.name}
          onSelectIndex={handleIndexSelect}
        />
      </div>


      <Toaster position="top-right" />
    </>
  )
}
