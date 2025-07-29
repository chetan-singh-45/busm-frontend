'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import Dropdown from '@/components/Dropdown';
import { useRouter } from 'next/navigation'

const Notification = ({ title, fetchNotifications }) => {
  const { user } = useAuth();
  const router = useRouter()
  const [userNotification, setUserNotification] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [countries, setCountries] = useState([]);
  const [loadingStockSymbol, setLoadingStockSymbol] = useState(null);

  const handleChartClick = async (symbol) => {
    setLoadingStockSymbol(symbol);
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push(`/overview/${symbol}`);
  };


  const fetchUserNotification = async () => {
    try {
      const notify = await fetchNotifications();
      if (notify) {
        const notifications = notify?.data?.data || [];
        setUserNotification(notifications);

        const uniqueCountries = [
          ...new Set(
            notifications
              .map((n) => n.stock?.country?.name)
              .filter(Boolean)
          ),
        ];
        setCountries(uniqueCountries);
      } else {
        setUserNotification([]);
      }
    } catch (err) {
      console.error('Failed to load notification data:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserNotification();
    }
  }, [user?.id]);

  const filteredNotifications = userNotification.filter((notification) => {
    const name = notification.stock?.name?.toLowerCase() || '';
    const country = notification.stock?.country?.name?.toLowerCase() || '';
    const signal = notification.event_type?.toLowerCase() || '';

    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      country.includes(search.toLowerCase()) ||
      signal.includes(search.toLowerCase());

    const matchesCountry =
      selectedCountry === 'all' ||
      country === selectedCountry.toLowerCase();

    return matchesSearch && matchesCountry;
  });

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h2 className="text-2xl font-semibold mb-4 text-[#11193C]">{title}</h2>

        {/* Header with "Recent Notifications" and "View All" */}
        {/* <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/notifications')}
              className="text-sm px-3 py-1 border border-blue-600 text-blue-700 rounded-lg hover:bg-blue-50 transition"
            >
              View All
            </button>
          </div> */}

        {/* Search and Filter */}
        {/* <div className="mb-4 flex flex-col sm:flex-row gap-4 sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full sm:w-64 border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="relative z-30">
              <Dropdown
                align="left"
                width="48"
                trigger={
                  <button className="inline-flex justify-between w-full sm:w-auto px-4 py-2 text-base border border-gray-300 bg-white rounded-lg hover:bg-gray-100">
                    {selectedCountry === 'all' ? 'All Countries' : selectedCountry}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                }
              >
                <button
                  onClick={() => setSelectedCountry('all')}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${selectedCountry === 'all' ? 'font-semibold text-blue-600' : ''
                    }`}
                >
                  All Countries
                </button>
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country.toLowerCase())}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${selectedCountry.toLowerCase() === country.toLowerCase() ? 'font-semibold text-blue-600' : ''
                      }`}
                  >
                    {country}
                  </button>
                ))}
              </Dropdown>
            </div>
          </div> */}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-white-100 sticky top-0 z-10">
              <tr className='text-sm text-gray-700 uppercase tracking-wide'>
                <th className="px-4 py-3 text-center">Date/Time</th>
                {/* <th className="px-4 py-3 text-center">Country</th> */}
                <th className="px-4 py-3 text-center">Index</th>
                <th className="px-4 py-3 text-center">Signal</th>
                {/* <th className="px-4 py-3 text-center">Direction</th> */}
                {/* <th className="px-4 py-3 text-center">SMA Price</th> */}
                <th className="px-4 py-3 text-center">Signal Details</th>
                {/* <th className="px-4 py-3 text-center">Last Price</th> */}
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No notifications found.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notification) => {
                  const isBullish = notification.event_type.includes('bullish');
                  const badgeClass = isBullish
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700';

                  return (
                    <tr key={notification.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-center">
                        {new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        }).format(new Date(notification.created_at))}
                      </td>
                      {/* <td className="px-4 py-3 text-center">
                          {notification.stock?.country?.emoji}{' '}
                          {notification.stock?.country?.name}
                        </td> */}
                      <td className="px-4 py-3 text-center">
                        {notification.stock?.country?.emoji} {notification.stock?.name}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {notification.indicator_name}
                      </td>
                      {/* <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${notification.prediction === 'up'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                            }`}>
                            {notification.prediction}
                          </span>
                        </td> */}
                      {/* <td className="px-4 py-3 text-center">
                          {parseFloat(notification.sma_price).toFixed(2)}
                        </td> */}
                      <td className="px-4 py-3 text-center leading-relaxed">
                        <div>
                          {notification.event_type
                            .split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </div>
                        {/* <div className="text-sm text-gray-800 font-sm">
                            {notification.indicator_name}
                          </div> */}
                        <div className="text-sm text-gray-800 font-sm">
                          at :{parseFloat(notification.last_price).toFixed(2)}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleChartClick(notification.stock_symbol)}
                            disabled={loadingStockSymbol === notification.stock_symbol}
                            className="inline-flex items-center gap-2 bg-green-400 px-2 py-1 text-xs text-white rounded-md hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingStockSymbol === notification.stock_symbol ? (
                              <>
                                <span>Loading</span>
                                <span className="flex space-x-1 mr-2">
                                  <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                                  <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                                  <span className="w-1 h-1 bg-white rounded-full animate-bounce" />
                                </span>
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>View Chart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Notification;
