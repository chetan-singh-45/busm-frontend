'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/(app)/Header';
import { useStocks } from '@/hooks/stocks';
import { useWatchlist } from '@/hooks/watchlist';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/auth';
import StockTable from '@/components/StockTable';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

const Stock = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStock, setLoadingStock] = useState(null);
  const { stocks } = useStocks();
  const { watchlist, handleAddWatchlist, handleRemoveWatchlist } = useWatchlist({ withoutPricing: true });

  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000)
    return () => clearTimeout(timer)
  }, [])

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
      <Header title="All Indices" subtitle="Browse and manage all available market indices" />
      <Toaster position="top-right" />
      {
        showSkeleton ? (<TableSkeleton />) :
          (<StockTable
            title="All Indices"
            stocks={filteredStocks}
            watchlist={watchlist}
            isLoading={loadingStock}
            handleToggleWatchlist={handleToggleWatchlist}
          />)
      }
    </>
  );
};

export default Stock;
