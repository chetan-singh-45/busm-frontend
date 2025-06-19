'use client';

import { useState } from 'react';
import { useStocks } from '@/hooks/stocks';
import { useWatchlist } from '@/hooks/watchlist';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/auth';
import StockTable from '@/components/StockTable';
import LoginRegisterModal from '@/components/LoginRegisterModal';
import FrontendNavigation from './(frontend)/FrontendNavigation';
import HomeCurvedSection from "@/components/HomeCurvedSection"
import HowItWorks from "@/components/HowItWorks";
import PricingPlans from '@/components/PricingPlans';
import Contact from '@/components/ContactSection';
import FaqAccordion from "@/components/FaqAccordion";
import Footer from '@/components/Footer';
import TrustedCompanies from "@/components/TrustedCompanies";
import FeatureSection  from "@/components/FeatureSection";
import DashboardSection  from "@/components/BrandSection";


const Stock = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStock, setLoadingStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { stocks } = useStocks();
  const { watchlist, handleAddWatchlist, handleRemoveWatchlist } = useWatchlist({ withoutPricing: true });

  const handleToggleWatchlist = async (stock) => {
    if (!user) {
      setIsModalOpen(true);
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
      <FrontendNavigation />
      <Toaster position="top-right" />
      
      <div className="bg-gray-50 text-gray-900 min-h-screen py-8">
      <div className="w-full">
        <HomeCurvedSection
          title="Get notified on technical analysis events on European stock indices"
          subtitle="Instantly rank every technical trade idea based on your optimal options strategy."
        />
        <TrustedCompanies />

        {/* <LoginRegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <StockTable
          stocks={filteredStocks}
          watchlist={watchlist}
          isLoading={loadingStock}
          handleToggleWatchlist={handleToggleWatchlist}
        /> */}
        <DashboardSection />
        <FeatureSection />
        <HomeCurvedSection
            title="The Web's Most Advanced Interactive Financial Charting Platform"
            subtitle="Designed to Transform The Way You See The Markets."
          />
        <HowItWorks />
        <PricingPlans />
        <Contact />

        <div className="max-w-8xl mx-auto text-center bg-white">
          <h2 className="text-4xl font-bold text-[#0a0a35] mb-4">
            Most Common Frequently Ask Questions
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Find the right plan that fits your marketing and sales needs. Whether you're just starting or scaling your business, Saazy has a solution for you.
          </p>
        </div>

        <FaqAccordion />  
        <Footer />
      </div>
    </div>

    </>
  );
};

export default Stock;
