'use client'

import ApplicationLogo from '@/components/ApplicationLogo'
import Link from 'next/link'
import NavLink from '@/components/NavLink'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'

const FrontendNavigation = () => {
    const { user } = useAuth()
    const pathname = usePathname()

    return (
        <nav className="relative bg-white border-b border-[#0a0839] shadow-sm h-16 flex items-center">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
                
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/">
                        <ApplicationLogo className="h-10 w-10 text-indigo-600" />
                    </Link>
                </div>

                {/* FrontendNavigation Links */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6 text-sm font-semibold text-[#0a0839]">
                    <NavLink href="/about" active={pathname === '/about'}>
                        About Us
                    </NavLink>
                    <NavLink href="/work" active={pathname === '/work'}>
                        How It Works
                    </NavLink>
                    {/* <NavLink href="/pricing" active={pathname === '/pricing'}>
                        Pricing
                    </NavLink> */}
                    <NavLink href="/faq" active={pathname === '/faq'}>
                        FAQ
                    </NavLink>
                    {/* <NavLink href="/indexes" active={pathname === '/indexes'}>
                        Indexes
                    </NavLink> */}
                    <NavLink href="/plans" active={pathname === '/plans'}>
                        Plans
                    </NavLink>
                    {/* <NavLink href="/notifier" active={pathname === '/notifier'}>
                        Notifier
                    </NavLink>
                    <NavLink href="/watchlist" active={pathname === '/watchlist'}>
                        Watchlist
                    </NavLink> */}
                    <NavLink href="/contact" active={pathname === '/contact'}>
                        Contact Us
                    </NavLink>
                </div>

                {/*Login Button */}
                <div className="flex items-center">
                   { user ?(                       
                    <Link href="/dashboard">
                        <button className="bg-green-500 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-green-600 transition-all duration-150">
                            Dashboard
                        </button>
                    </Link>             
                    ):(                   
                    <Link href="/login">
                        <button className="bg-green-500 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-green-600 transition-all duration-150">
                            Login
                        </button>
                    </Link>
                    ) 
                   }
                </div>
            </div>

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href="/dashboard"
                            active={usePathname() === '/dashboard'}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-10 w-10 fill-current text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </nav>
    )
}

export default FrontendNavigation
