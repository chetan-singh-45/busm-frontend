'use client'

import { useState } from 'react';
import { ChevronUp, ChevronDown, Bell, Clock } from 'lucide-react';
import HeadingSection from '@/components/HeadingSection';
import Chart from '@/components/Chart';
import HistoricalData from '@/components/HistoricalData';
import UserSetAlertPopover from '@/components/UserSetAlertPopover'
import AddToWatchlistPopover from '@/components/AddToWatchlistPopover'

export default function UserChart() {
    const current = 913;
    const low = 784.66;
    const high = 952.45;
    const percentage = ((current - low) / (high - low)) * 100;
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState('overview'); 
    const [showAlertPopover, setShowAlertPopover] = useState(false)
    const [showWatchlistPopover, setShowWatchlistPopover] = useState(false)

    const indices = ['Dow Jones', 'S&P 500', 'Nasdaq', 'Russell 2000'];

    return (
        <>
            <HeadingSection title={'Dow Jones Industrial Average'} />

            <section className="bg-white text-[#0a0a35] mt-4 pb-16 rounded-t-[3rem]">
                <div className="max-w-7xl mx-auto px-4 pt-6">
                    <button className="text-[#25C935] mb-2 flex items-center text-sm">
                        ← Back
                    </button>

                    <div className="flex justify-between items-start flex-wrap gap-4">
                        {/* Left */}
                        <div>
                            <div className="flex items-center justify-between flex-wrap gap-4 relative">
                                <h2 className="text-lg font-semibold">Dow Jones Industrial Average</h2>

                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsOpen(!isOpen)}
                                            className="flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm shadow-sm"
                                        >
                                            <span>🇺🇸</span>
                                            <span>America</span>
                                            {isOpen ? (
                                                <ChevronUp className="w-4 h-4 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-600" />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                                                {indices.map((item, index) => (
                                                    <button
                                                        key={index}
                                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                        onClick={() => {
                                                            console.log('Selected index:', item);
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm text-[#0A0A35]">
                                        Currency in <strong>USD</strong>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-4xl font-bold">913.91</span>
                                <span className="text-[#25C935] font-medium flex items-center text-sm">
                                    +4.43 (+0.48%) <ChevronUp size={16} className="ml-1" />
                                </span>
                            </div>

                            <p className="text-xs mt-1 flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-500" />
                                Real-time Data: 03:00:00
                            </p>
                        </div>

                        {/* Right */}
                        <div className="flex gap-6 ml-auto mt-2">
                            <div className="flex flex-col gap-3 items-end">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                       <button onClick={() => setShowAlertPopover(!showAlertPopover)}
                                        className="p-2 bg-white rounded-full hover:shadow"
                                        >
                                            <Bell className="text-[#25C935]" />
                                        </button>
                                        {/* Notification Dot */}
                                        {/* <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#25C935] border-2 border-white rounded-full" /> */}

                                        {/* Popover above the bell */}
                                        {showAlertPopover && (
                                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50">
                                              <UserSetAlertPopover index={{ name: 'Dow Jones Industrial Average' }} onClose={() => setShowAlertPopover(false)}/>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowWatchlistPopover(!showWatchlistPopover)}
                                        className="bg-[#25C935] text-white px-4 py-1.5 rounded-full text-sm font-medium"
                                    >
                                        Add To Watchlist
                                    </button>
                                    {showWatchlistPopover && (
                                        <div className="absolute bottom-12 right-0 z-50">
                                        <AddToWatchlistPopover onClose={() => setShowWatchlistPopover(false)} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 min-w-[260px] w-full">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5 leading-tight">Day’s Range</p>
                                        <div className="flex justify-between text-xs font-medium leading-none">
                                            <span className="text-[#0A0A35]">41,906.16</span>
                                            <span className="text-[#0A0A35]">42,306.08</span>
                                        </div>
                                        <div className="relative mt-1 h-[2px] rounded-full bg-gray-200">
                                            <div
                                                className="absolute top-[8px] flex flex-col items-center left-[60%] transform -translate-x-1/2"
                                            >
                                                <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#0A0A35]" />
                                                <span className="text-[10px] text-[#0A0A35] mt-0.5">${current}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5 leading-tight">52 wk Range</p>
                                        <div className="flex justify-between text-xs font-medium leading-none">
                                            <span className="text-[#0A0A35]">36,611.25</span>
                                            <span className="text-[#0A0A35]">45,087.08</span>
                                        </div>
                                        <div className="relative mt-1 h-[2px] rounded-full bg-gray-200">
                                            <div
                                                className="absolute top-[8px] flex flex-col items-center left-[70%] transform -translate-x-1/2"
                                            >
                                                <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#0A0A35]" />
                                                <span className="text-[10px] text-[#0A0A35] mt-0.5">${current}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-10 bg-[#f9f9f9] rounded-lg p-4">
                        <div className="flex gap-6 border-b border-gray-300 pb-2">
                            <button
                                onClick={() => setTab('overview')}
                                className={`font-semibold text-black border-b-2 ${
                                    tab === 'overview' ? 'border-black' : 'border-transparent'
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setTab('historical')}
                                className={`font-semibold text-black border-b-2 ${
                                    tab === 'historical' ? 'border-black' : 'border-transparent'
                                }`}
                            >
                                Historical data
                            </button>
                        </div>

                        <div className="mt-6">
                            {tab === 'overview' ? (
                                <Chart symbol={'AEX.INDX'} defaultRange={'1D'} />
                            ) : (
                                <HistoricalData />
                            )}
                        </div>
                    </div>

                    {/* Stats Table */}
                    <div className="mt-10 max-w-lg border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody>
                                {[
                                    ['Prev. Close', '918.36'],
                                    ['Open', '919.05'],
                                    ['1-Year Change', '1.63%'],
                                    ['Volume', '9,638,782'],
                                    ['Average Vol. (3m)', '64,315,702'],
                                    ['Day’s Range', '912.91 - 921.17'],
                                    ['52 wk Range', '784.66 - 952.45'],
                                ].map(([label, value]) => (
                                    <tr key={label} className="border-b last:border-b-0">
                                        <td className="px-4 py-2 font-medium text-gray-600">{label}</td>
                                        <td className="px-4 py-2 text-right">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
}
