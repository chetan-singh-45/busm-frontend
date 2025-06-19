'use client';

import { useState } from 'react';
import Header from '@/app/(app)/Header';
import { useStocks } from '@/hooks/stocks';
import { useWatchlist } from '@/hooks/watchlist';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/auth';
import StockTable from '@/components/StockTable';

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
      <Header title="Indices" />
      <Toaster position="top-right" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          <StockTable
              stocks={filteredStocks}
              watchlist={watchlist}
              isLoading={loadingStock}
              handleToggleWatchlist={handleToggleWatchlist}
            />

        </div>
      </div>
    </>
  );
};

export default Stock;
