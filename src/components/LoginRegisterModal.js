'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function LoginRegisterModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative">
       <button onClick={onClose} className="absolute top-4 right-4 text-gray-800 hover:text-black">
          <X className="w-5 h-5" />
        </button>

        <div className="flex">
          <div className="w-1/2 p-4 bg-gray-900 text-white rounded-l-lg">
            <h2 className="text-xl font-bold mb-4">Sign up for <span className="text-yellow-400">FREE</span> and get:</h2>
            <ul className="space-y-2 text-sm">
              <li>🔔 Real-Time Alerts</li>
              <li>📈 Personalized Charts</li>
              <li>📊 Advanced Features</li>
              <li>📱 Fully-Synced Mobile App</li>
            </ul>
          </div>

          <div className="w-1/2 p-4 text-gray-900">
            <h2 className="text-xl font-bold mb-4">Trend Notifier</h2>

            <button
              onClick={() => router.push('/register')}
              className="w-full border py-2 rounded mb-2 hover:bg-gray-100"
            >
              Sign up with Email
            </button>

            <p className="text-sm text-gray-700 mt-2">
              Already have an account?{' '}
              <span onClick={() => router.push('/login')} className="text-blue-600 cursor-pointer">
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
