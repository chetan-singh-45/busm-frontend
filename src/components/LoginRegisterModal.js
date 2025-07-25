'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { X } from 'lucide-react';
import Loading from '@/app/(app)/loading'; 

export default function LoginRegisterModal({ isOpen, onClose }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleNavigation = (path) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
    }, 500); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-800 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 rounded-lg">
            <Loading />
          </div>
        )}

        <div className={`flex ${isLoading ? 'opacity-20 pointer-events-none' : ''}`}>
          {/* Left section */}
          <div className="w-1/2 p-4 bg-gray-900 text-white rounded-l-lg">
            <h2 className="text-xl font-bold mb-4">
              Sign up for <span className="text-yellow-400">FREE</span> and get:
            </h2>
            <ul className="space-y-2 text-sm">
              <li>🔔 Real-Time Alerts</li>
              <li>📈 Personalized Charts</li>
              <li>📊 Advanced Features</li>
              <li>📱 Fully-Synced Mobile App</li>
            </ul>
          </div>

          {/* Right section */}
          <div className="w-1/2 p-4 text-gray-900">
            <h2 className="text-xl font-bold mb-4">Trend Notifier</h2>

            <button
              onClick={() => handleNavigation('/register')}
              className="w-full border py-2 rounded mb-2 hover:bg-gray-100 transition"
            >
              Sign up with Email
            </button>

            <p className="text-sm text-gray-700 mt-2">
              Already have an account?{' '}
              <span
                onClick={() => handleNavigation('/login')}
                className="text-blue-600 cursor-pointer"
              >
                Sign In
              </span>
            </p>

            <p className="text-xs text-gray-600 mt-1">
              By signing up you agree to our{' '}
              <a href="/terms" className="underline">Terms & Conditions</a> and{' '}
              <a href="/privacy" className="underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
