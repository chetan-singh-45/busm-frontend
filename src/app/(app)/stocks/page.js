'use client';

import { useState } from 'react';
import Header from '@/app/(app)/Header';
import { useStocks } from '@/hooks/stocks';
import { useWatchlist } from '@/hooks/watchlist';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/auth';
import { Star } from 'lucide-react';

const Stock = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStock, setLoadingStock] = useState(null);

  const { stocks } = useStocks();
  const { watchlist, handleAddWatchlist, handleRemoveWatchlist } = useWatchlist({ withoutPricing: true });

  const handleToggleWatchlist = async (stock) => {
    if (!user) {
      toast.error('You must be logged in to manage watchlist');
      return;
    }

    setLoadingStock(stock.symbol);

    try {
      const existingEntry = watchlist.find((w) => w.stock_id === stock.id);

      if (existingEntry) {
        await handleRemoveWatchlist(existingEntry.id);
        toast.success(`${stock.name} removed from watchlist`);
      } else {
        await handleAddWatchlist({ stock_id: stock.id });
        toast.success(`${stock.name} added to watchlist`);
      }
    } catch (error) {
      toast.error('Watchlist operation failed');
      console.error(error);
    } finally {
      setLoadingStock(null);
    }
  };

  const filteredStocks = stocks?.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <>
      <Header title="Stocks" />
      <Toaster position="top-right" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-60 border border-gray-300 rounded-md p-2 text-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Watchlist</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Symbol</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStocks?.length > 0 ? (
                  filteredStocks.map((stock) => {
                    const isInWatchlist = watchlist?.some((w) => w.stock_id === stock.id);

                    return (
                      <tr key={stock.symbol}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleToggleWatchlist(stock)}
                            className="flex items-center gap-2 p-1 rounded-lg hover:scale-105 transition"
                            disabled={loadingStock === stock.symbol}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                isInWatchlist ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill={isInWatchlist ? 'currentColor' : 'none'}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.symbol}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 px-6 py-6">
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stock;
