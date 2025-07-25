'use client'

import { useState } from 'react'
import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import { DropdownButton } from '@/components/DropdownLink'
import NavLink from '@/components/NavLink'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import ResponsiveNavLink from '@/components/ResponsiveNavLink'
import WatchlistPopover from '@/components/WatchlistPopover'
import { useWatchlist } from '@/hooks/watchlist'
import { User, BellRing, LogOut, Menu, X } from 'lucide-react'

const FrontendNavigation = () => {
    const { user, logout } = useAuth()
    const pathname = usePathname()
    const { watchlist } = useWatchlist()

    const [showDropdown, setShowDropdown] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const navItems = [
        { href: '/about', label: 'About Us' },
        { href: '/work', label: 'How It Works' },
        { href: '/faq', label: 'FAQ' },
        { href: '/notifier', label: 'Notifier' },
        { href: '/plans', label: 'Plans' },
        { href: '/contact', label: 'Contact Us' },
    ]

    if (user) {
        navItems.splice(5, 0, { href: '/watchlist', label: 'Watchlist' }) 
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <ApplicationLogo className="h-10 w-10 text-indigo-600" />
                        </Link>
                    </div>

                    {/* Middle: Desktop Nav */}
                    <div className="hidden md:flex space-x-6 ">
                        {navItems.map(item => (
                            <NavLink key={item.href} href={item.href} active={pathname === item.href}>
                                {item.label}
                            </NavLink>
                        ))}

                        {user && (
                            <div className="relative z-50">
                                <button
                                    onClick={() => setShowDropdown(prev => !prev)}
                                    className="text-sm px-4 py-2 rounded hover:bg-gray-100 transition"
                                >
                                    My Watchlist
                                </button>

                                {showDropdown && (
                                    <WatchlistPopover
                                        watchlist={watchlist}
                                        onClose={() => setShowDropdown(false)}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Auth or Login */}
                    <div className="hidden md:flex items-center space-x-4 relative z-50">
                        {user ? (
                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="flex items-center gap-2 text-sm text-gray-700">
                                    <img
                                        src={user?.avatar || '/profile.png'}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                </button>
                            }
                        >
                            <div className="px-4 py-2 border-b">
                                <p className="font-semibold text-sm">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <Link
                                href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500"
                            >
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" /> My Profile
                                </div>
                            </Link>
                            <Link
                                href="/alerts"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500"
                            >
                                <div className="flex items-center gap-2">
                                    <BellRing className="w-4 h-4" /> Alert Center
                                </div>
                            </Link>
                            <DropdownButton onClick={logout}>
                                <div className="flex items-center gap-2 text-sm text-red-600 hover:text-green-500">
                                    <LogOut className="w-4 h-4 hover:text-green-500" />
                                    Sign Out
                                </div>
                            </DropdownButton>
                        </Dropdown>
                        ) : (
                            <Link href="/login">
                                <button className="bg-green-500 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-green-600 transition-all duration-150">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Panel */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2">
                    {navItems.map(item => (
                        <ResponsiveNavLink
                            key={item.href}
                            href={item.href}
                            active={pathname === item.href}
                        >
                            {item.label}
                        </ResponsiveNavLink>
                    ))}

                    {user && (
                        <>
                            <ResponsiveNavLink href="/profile">My Profile</ResponsiveNavLink>
                            <ResponsiveNavLink href="/alerts">Alert Center</ResponsiveNavLink>
                            <button
                                onClick={logout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                            >
                                Sign Out
                            </button>
                        </>
                    )}

                    {!user && (
                        <ResponsiveNavLink href="/login">Login</ResponsiveNavLink>
                    )}
                </div>
            )}
        </nav>
    )
}

export default FrontendNavigation
