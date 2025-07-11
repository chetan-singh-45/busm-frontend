import { useState } from 'react'
import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'
import { Home, List, LineChart, Bell, Heart, Users, User, BellRing, LogOut } from 'lucide-react'

const AdminNavigation = ({ user, children }) => {
    const { logout } = useAuth()
    const pathname = usePathname()
    const [showNotifications, setShowNotifications] = useState(false)


    const linkClass = (path) =>
        `block px-2 py-2 rounded text-sm font-medium transition ${pathname === path
            ? 'text-green-400 border-b-2 border-green-400'
            : 'text-gray-300 hover:text-white'
        }`

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0E123A] text-white flex flex-col justify-between">
                <div>
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-center">
                        <Link href="/dashboard">
                            <ApplicationLogo className="h-10 w-10 text-white" />
                        </Link>
                    </div>

                    {/* AdminNavigation Links */}
                    <nav className="flex flex-col px-4 py-6 space-y-2 text-sm text-gray-700">
                        <Link href="/admin_dashboard" className={linkClass('/admin_dashboard')}>
                            <div className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Dashboard
                            </div>
                        </Link>

                        <Link href="/stocks" className={linkClass('/stocks')}>
                            <div className="flex items-center gap-2">
                                <List className="w-4 h-4" />
                                Indices
                            </div>
                        </Link>

                        <Link href="/alert" className={linkClass('/alert')}>
                            <div className="flex items-center gap-2">
                                <LineChart className="w-4 h-4" />
                                Setup Alert
                            </div>
                        </Link>

                        <Link href="/notifications" className={linkClass('/notifications')}>
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                Notifications
                            </div>
                        </Link>

                        {/* Optional Watchlist (commented out) */}
                        <Link href="/watchlist" className={linkClass('/watchlist')}>
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                Watchlist
                            </div>
                        </Link>

                        {/* Show Users link if admin */}
                        {user?.role === 1 && (
                            <Link href="/users" className={linkClass('/users')}>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Users
                                </div>
                            </Link>
                        )}
                    </nav>

                </div>

                {/* Footer (User Info + Actions) */}
                <div className=" bg-green-500 border-t border-gray-700 px-16 py-2 text-sm">
                    {/* Help & Support */}
                    <Link
                        href="/support"
                        className="block w-full text-center text-gray-300 hover:text-white mb-3 transition">
                        Help & Support
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-100 px-6 flex justify-end items-center">
                    <div className="relative mr-4">

                        <button onClick={() => setShowNotifications(prev => !prev)}
                            className="relative p-2 rounded-full text-black-600 hover:text-gray-900 hover:bg-gray-100">
                            <BellRing className="w-8 h-5" />
                            <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs font-semibold px-1.5 rounded-full">
                                3
                            </span>
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-md border z-50">
                                <div className="p-4 border-b font-semibold text-gray-800">
                                    Recent Notifications
                                </div>
                                <ul className="divide-y text-sm">
                                    <li className="flex items-start gap-2 px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-800">DAX crossed SMA 200</p>
                                            <p className="text-xs text-gray-500">2 minutes ago</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2 px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-800">FTSE 100 RSI signal</p>
                                            <p className="text-xs text-gray-500">5 minutes ago</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2 px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-800">CAC 40 price alert</p>
                                            <p className="text-xs text-gray-500">10 minutes ago</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="p-3 border-t text-center">
                                    <Link
                                        href="/notifications"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        View All Notifications
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                    <Dropdown
                        align="right"
                        width="48"
                        trigger={
                            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                                <img
                                    src={user?.avatar || '/profile.png'}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                {/* <span>{user?.name || 'User'}</span> */}
                                {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg> */}
                            </button>
                        }
                    >
                        <div className="px-4 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'Email'}</p>
                        </div>
                        <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500"
                        >
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                My Profile
                            </div>
                        </Link>

                        <Link
                            href="/alerts"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500"
                        >
                            <div className="flex items-center gap-2">
                                <BellRing className="w-4 h-4" />
                                Alert Center
                            </div>
                        </Link>

                        <DropdownButton onClick={logout}>
                            <div className="flex items-center gap-2 text-sm hover:text-green-500">
                                <LogOut className="w-4 h-4 hover:text-green-500" />
                                Sign Out
                            </div>
                        </DropdownButton>

                    </Dropdown>

                </header>

                {/* Page Content */}
                <main className="p-6 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminNavigation
