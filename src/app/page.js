'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import FrontendNavigation from '@/app/(frontend)/FrontendNavigation';
import HomeCurvedSection from "@/components/HomeCurvedSection";
import HowItWorks from "@/components/HowItWorks";
import PricingPlans from '@/components/PricingPlans';
import Contact from '@/components/ContactSection';
import FaqAccordion from "@/components/FaqAccordion";
import Footer from '@/components/Footer';
import TrustedCompanies from "@/components/TrustedCompanies";
import FeatureSection from "@/components/FeatureSection";
import DashboardSection from "@/components/BrandSection";
import VideoSection from "@/components/VideoSection";
import LoginRegisterModal from '@/components/LoginRegisterModal';

import { useAuth } from "@/hooks/auth";

const Home = () => {
  const user = useAuth();
  const [showLoginRegisterModal, setShowLoginRegisterModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        setShowLoginRegisterModal(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <>
      <FrontendNavigation />
      <Toaster position="top-right" />

      <div className="bg-gray-50 text-gray-900 min-h-screen py-1">
        <div className="w-full">
          <HomeCurvedSection
            title="Get Notified on Technical Analysis Events on European Stock Indices"
            subtitle="Instantly rank every technical trade idea based on your optimal options strategy."
          />
          <TrustedCompanies />
          <DashboardSection />
          <FeatureSection />
          <VideoSection
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

      {user && (
        <LoginRegisterModal
          isOpen={showLoginRegisterModal}
          onClose={() => setShowLoginRegisterModal(false)}
        />
      )}
    </>
  );
};

export default Home;
