"use client"

import { useState } from "react"
import { Bell, Calendar, User, UserPlus, Globe, TrendingUp, BarChart2, Map, Clock, MessageCircle } from "lucide-react"
import InsightCard from "@/components/InsightCard"
import { useAuth } from "@/hooks/auth"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts"
import StockTable from '@/components/StockTable'
import Notification from '@/components/Notification'
import { getRecentNotifications } from '@/services/stats';
import { useWatchlist } from '@/hooks/watchlist'
import toast, { Toaster } from 'react-hot-toast'
import Header from "@/app/(app)/Header"

const AdminDashboard = () => {
  const { user } = useAuth()
  const [loadingStock, setLoadingStock] = useState(null)
  const { watchlist, isLoading, isError, handleRemoveWatchlist, handleAddWatchlist } = useWatchlist()


  const handleToggleWatchlist = async (stock) => {
    if (!user) {
      toast.error('You must be logged in to manage watchlist')
      return
    }

    setLoadingStock(stock.symbol)

    try {
      const existingEntry = watchlist.find((w) => w.stock_id === stock.id)

      if (existingEntry) {
        await handleRemoveWatchlist(existingEntry.id)
        toast.success(`${stock.name} removed from watchlist`)
      } else {
        await handleAddWatchlist({ stock_id: stock.id })
        toast.success(`${stock.name} added to watchlist`)
      }
    } catch (error) {
      toast.error('Watchlist operation failed')
      console.error(error)
    } finally {
      setLoadingStock(null)
    }
  }
  const dauWauData = [
    { date: "Jul 1", dau: 120, wau: 300 },
    { date: "Jul 2", dau: 150, wau: 310 },
    { date: "Jul 3", dau: 170, wau: 320 },
    { date: "Jul 4", dau: 140, wau: 305 },
    { date: "Jul 5", dau: 180, wau: 330 },
    { date: "Jul 6", dau: 160, wau: 325 },
    { date: "Jul 7", dau: 190, wau: 335 },
  ]

  const kpiData = [
    { icon: <Bell className="w-6 h-6 text-green-500" />, title: "Total Notifications Sent", value: "12,345" },
    { icon: <Calendar className="w-6 h-6 text-green-500" />, title: "Notifications in Last 24h", value: "567" },
    { icon: <User className="w-6 h-6 text-green-500" />, title: "Total Registered Users", value: "8,912" },
    { icon: <UserPlus className="w-6 h-6 text-green-500" />, title: "New Users (Last 7 Days)", value: "324" },
    { icon: <Globe className="w-6 h-6 text-green-500" />, title: "Countries Monitored", value: "38" },
    { icon: <TrendingUp className="w-6 h-6 text-green-500" />, title: "Indices Tracked", value: "25" },
  ]

  const behaviorInsights = [
    { icon: <TrendingUp className="w-6 h-6 text-green-500" />, title: "Most Popular Index", value: "DAX" },
    { icon: <BarChart2 className="w-6 h-6 text-green-500" />, title: "Most Used Indicator", value: "SMA 200" },
    { icon: <Map className="w-6 h-6 text-green-500" />, title: "Most Watched Country", value: "UK" },
    { icon: <Clock className="w-6 h-6 text-green-500" />, title: "Most Active Time Slot", value: "9AM–11AM" },
    { icon: <MessageCircle className="w-6 h-6 text-green-500" />, title: "Top Engaged Users", value: "5 users" },
  ]

  return (
    <>
      <Toaster position="top-right" />
      {user?.role == 1 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <Header
            title="Dashboard Overview"
            subtitle="Monitor your platform's performance and user engagement"
          />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {kpiData.map((item, idx) => (
              <InsightCard key={idx} {...item} />
            ))}
          </div>

          {/* Behavior Insights */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-6 text-[#11193C]">User Behavior Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {behaviorInsights.map((item, idx) => (
                <InsightCard key={idx} {...item} />
              ))}
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-10">
            <h2 className="text-xl font-semibold mb-6 text-[#11193C]">DAU / WAU Trends</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* DAU Chart */}
              <div className="flex-1 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-[#11193C]">DAU Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dauWauData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="dau" stroke="#10B981" name="DAU" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* WAU Chart */}
              <div className="flex-1 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-[#11193C]">WAU Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dauWauData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="wau" stroke="#3B82F6" name="WAU" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-4">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Indices Added per User</span>
                <span className="text-[#11193C] font-semibold">7.4</span>
              </div>
            </div>
          </div>

        </div>
      )}
      {user?.role == 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,65%)_minmax(0,35%)] gap-6 px-4 sm:px-6 lg:px-8 mb-10">
          <div className="overflow-x-auto">
            <Notification title="Recent Notifications" fetchNotifications={getRecentNotifications} />
          </div>
          <div className="overflow-x-auto">
            <StockTable
              title="My Watchlist"
              stocks={watchlist}
              watchlist={watchlist}
              isLoading={isLoading}
              isError={isError}
              handleToggleWatchlist={handleToggleWatchlist}
              loadingStock={loadingStock}
            />
          </div>
        </div>

      ) : (
        <h1>not found</h1>
      )
      }

    </>
  )
}

export default AdminDashboard
