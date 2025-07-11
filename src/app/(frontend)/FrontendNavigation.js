'use client'

import { useState } from 'react'
import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import { DropdownButton } from '@/components/DropdownLink'
import NavLink from '@/components/NavLink'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'
import WatchlistPopover from '@/components/WatchlistPopover'
import { useWatchlist } from '@/hooks/watchlist'
import { User, BellRing, LogOut } from 'lucide-react'

const FrontendNavigation = () => {
    const { user, logout } = useAuth()
    const pathname = usePathname()
    const { watchlist } = useWatchlist()

    const [showDropdown, setShowDropdown] = useState(false)

    return (
        <nav className="relative h-16 flex items-center">
            <div className="max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">

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
                    <NavLink href="/notifier" active={pathname === '/notifier'}>
                        Notifier
                    </NavLink>
                    <NavLink href="/plans" active={pathname === '/plans'}>
                        Plans
                    </NavLink>
                    {/* {user && 
                    <NavLink href="/user_alert" active={pathname === '/user_alert'}>
                        Alerts
                    </NavLink>
                    } */}
                    {user &&
                        <NavLink href="/watchlist" active={pathname === '/watchlist'}>
                            Watchlist
                        </NavLink>}
                    <NavLink href="/contact" active={pathname === '/contact'}>
                        Contact Us
                    </NavLink>
                    {user && <div className="relative">
                        <button
                            id="watchlist-button"
                            onClick={() => setShowDropdown(prev => !prev)}
                            className="text-sm text-xs px-4 py-2 rounded hover:bg-gray-100 transition"
                        >
                            My Watchlist
                        </button>

                        {showDropdown && (
                            <WatchlistPopover
                                watchlist={watchlist}
                                onClose={() => setShowDropdown(false)}
                            />
                        )}
                    </div>}
                </div>

                {/*Login Button */}
                {user ?
                    (
                        <header className="h-16 bg-white border-b border-gray-200 px-6 flex justify-end items-center z-10">
                            <Dropdown
                                align="right"
                                width="48"
                                trigger={
                                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                                        <img
                                            src={user?.avatar || '/profile.png'}
                                            alt="Avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{user?.name || 'User'}</span>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                }
                            >
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500"
                                >
                                    <User className="w-4 h-4" />
                                    My Profile
                                </Link>

                                <Link
                                    href="/alerts"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500"
                                >
                                    <BellRing className="w-4 h-4" />
                                    Alert Center
                                </Link>

                                <DropdownButton onClick={logout}>
                                    <div className="flex items-center gap-2 hover:text-green-500">
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </div>
                                </DropdownButton>

                            </Dropdown>
                        </header>
                    ) : (
                        <Link href="/login">
                            <button className="bg-green-500 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-green-600 transition-all duration-150">
                                Login
                            </button>
                        </Link>
                    )
                }
            </div>

            {/* Responsive Navigation Menu */}
            {user && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href="/dashboard"
                            active={pathname === '/dashboard'}>
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
