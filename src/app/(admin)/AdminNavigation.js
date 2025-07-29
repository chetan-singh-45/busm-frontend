'use client'

import { useState, useEffect } from 'react'
import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'
import {
    Home, List, LineChart, Bell, Heart, Users, User,
    BellRing, LogOut, Menu, X, ShieldCheck
} from 'lucide-react'
import { getRecentNotifications } from '@/services/stats'
import { useDashboard } from '@/hooks/dashboard'

const AdminNavigation = ({ user, children }) => {
    const { logout } = useAuth()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [notification, setNotification] = useState([]);
    const { stats } = useDashboard()

    const fetchUserNotification = async () => {
        try {
            const notify = await getRecentNotifications();
            const notifications = notify?.data?.data || [];
            setNotification(notifications);
        } catch (err) {
            console.error('Failed to load notification data:', err);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchUserNotification();
        }
    }, [user?.id]);

    const linkClass = (path) =>
        `block px-3 py-2 rounded text-sm font-medium transition ${pathname === path
            ? 'text-green-400 border-b-2 border-green-400'
            : 'text-gray-300 hover:text-white'
        }`

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'block' : 'hidden'
                    }`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside
                className={`fixed md:relative z-50 transform top-0 left-0 transition-transform duration-300 bg-[#0E123A] text-white flex flex-col justify-between
                  w-4/5 max-w-xs md:w-64 h-screen md:min-h-screen
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div>
                    <div className="h-20 flex items-center justify-center border-b border-gray-700">
                        <Link href="/">
                            <ApplicationLogo className="h-10 w-10 text-white" />
                        </Link>
                    </div>

                    <nav className="px-4 py-6 space-y-2 text-sm text-gray-700">
                        <Link href="/admin_dashboard" className={linkClass('/admin_dashboard')}>
                            <div className="flex items-center gap-2">
                                <Home className="w-4 h-4" /> Dashboard
                            </div>
                        </Link>
                        <Link href="/stocks" className={linkClass('/stocks')}>
                            <div className="flex items-center gap-2">
                                <List className="w-4 h-4" /> Indices
                            </div>
                        </Link>
                        <Link href="/alert" className={linkClass('/alert')}>
                            <div className="flex items-center gap-2">
                                <LineChart className="w-4 h-4" /> Setup Alert
                            </div>
                        </Link>
                        <Link href="/notifications" className={linkClass('/notifications')}>
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4" /> Notifications
                            </div>
                        </Link>
                        <Link href="/watchlist" className={linkClass('/watchlist')}>
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4" /> Watchlist
                            </div>
                        </Link>
                        {user?.role == 1 && (
                            <Link href="/users" className={linkClass('/users')}>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Users
                                </div>
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="rounded-full bg-green-500 border-t border-gray-700 px-4 py-2 text-sm text-center">
                    <Link
                        href="/support"
                        className="block text-gray-300 hover:text-white transition"
                    >
                        Help & Support
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-0 h-screen">
                {/* Topbar */}
                <header className="h-16 bg-white border-b px-4 flex items-center justify-between sticky top-0 z-30">
                    <button
                        className="md:hidden p-2 rounded hover:bg-gray-100"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications((prev) => !prev)}
                                className="relative p-2 rounded-full hover:bg-gray-100"
                            >
                                <BellRing className="w-5 h-5 text-gray-700" />
                                {stats?.new_notifications?.length > 0 && (
                                    <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
                                        {stats.new_notifications.length}
                                    </span>
                                )}
                            </button>

                            {showNotifications && stats?.new_notifications && (
                                <div className="absolute right-0 mt-2 w-60 max-w-xs sm:max-w-sm bg-white shadow-lg rounded-md z-50 border">
                                    <div className="p-4 border-b font-semibold text-sm sm:text-base">
                                        Recent Notifications
                                    </div>
                                    <ul className="divide-y text-sm max-h-60 overflow-y-auto">
                                        {stats?.new_notifications.map((notif) => (
                                            <li key={notif.id} className="px-4 py-2 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
                                                <span>
                                                    {notif.stock?.name} crossed {notif.indicator_name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="p-3 border-t text-center">
                                        <Link
                                            href="/notifications"
                                            className="text-blue-600 text-sm hover:underline"
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
                            <Link href="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" /> My Profile
                                </div>
                            </Link>
                            <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500">
                                <div className="flex items-center gap-2">
                                    <Home className="w-4 h-4" /> Home
                                </div>
                            </Link>
                            <Link
                                href={user?.role == 1 ? "/admin_dashboard" : "/dashboard"}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500"
                                >
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> Dashboard  
                             </div>
                            </Link>
                            <Link href="/alert"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500">
                                <div className="flex items-center gap-2">
                                    <BellRing className="w-4 h-4" /> Alert Center
                                </div>
                            </Link>
                            <DropdownButton onClick={logout}>
                                <div className="flex items-center gap-2 text-sm text-red-600 hover:text-green-500">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </div>
                            </DropdownButton>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminNavigation
