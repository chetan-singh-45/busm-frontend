import { Mail, MapPin, Phone } from 'lucide-react'
import ApplicationLogo from '@/components/ApplicationLogo'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-2 px-6 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#030332] rounded-3xl shadow-xl px-6 sm:px-10 md:px-16 py-8 text-white space-y-10">
          {/* Top Subscribe Section */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-white">
                Try It Free and Simplify<br />Your Marketing Automation Today!
              </h2>
              <p className="mt-4 text-gray-400 text-base">
                Experience effortless marketing automation with our all-in-one platform. Sign up for a free trial today and streamline your campaigns.
              </p>
            </div>

            <form className="flex w-full max-w-lg md:justify-end mt-6 md:mt-0">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="flex-grow rounded-l-full px-6 py-3 bg-[#1E1E4A] text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-full px-6 py-3 bg-green-600 text-white hover:bg-green-500 font-semibold"
              >
                Try For Free
              </button>
            </form>
          </div>

          <hr className="border-t border-gray-700 my-4" />

          {/* Footer Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Brand Info */}
            <div className="border-r border-gray-700 pr-6">
              <ApplicationLogo className="h-10 w-10 text-green-500" />
              <h2 className="text-xl font-semibold mt-4 text-green-400">TrendNotifier</h2>
              <p className="text-sm mt-3 text-gray-300 leading-relaxed">
                On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire.
              </p>
            </div>

            {/* Contact Info */}
            <div className="border-r border-gray-700 px-6 pl-16">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Contact Information</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-green-500" />
                  <span>4320 Fitch Ave.<br />Baltimore, MD 21236</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-green-500" />
                  000-000-0000
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-green-500" />
                  Info@Trendnotifier.com
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="pl-12">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/about" className="hover:text-green-400">About Us</Link></li>
                <li><Link href="/work" className="hover:text-green-400">How It Works</Link></li>
                <li><Link href="/faq" className="hover:text-green-400">FAQ</Link></li>
                <li><Link href="/plans" className="hover:text-green-400">Plans</Link></li>
                <li><Link href="/notifier" className="hover:text-green-400">Notifier</Link></li>
                <li><Link href="/contact" className="hover:text-green-400">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <hr className="border-t border-gray-700 my-4" />

          <div className="flex justify-between text-sm text-gray-500 pt-2">
            <p>© Copyright 2025 TrendNotifier. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
