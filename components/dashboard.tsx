"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, Users, DollarSign, Activity, RefreshCw } from "lucide-react"
import { generateRealtimeData, generateUserData, generateRevenueData, generatePerformanceData } from "@/lib/sample-data"

export function Dashboard() {
  const [realtimeData, setRealtimeData] = useState(generateRealtimeData())
  const [userGrowth, setUserGrowth] = useState(generateUserData())
  const [revenueData, setRevenueData] = useState(generateRevenueData())
  const [performanceData, setPerformanceData] = useState(generatePerformanceData())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(generateRealtimeData())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUserGrowth(generateUserData())
    setRevenueData(generateRevenueData())
    setPerformanceData(generatePerformanceData())
    setIsRefreshing(false)
  }

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"]

  return (
    <section id="dashboard" className="min-h-screen bg-neo-blue-500 dark:bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white dark:text-white mb-6 dark:neo-text-glow leading-tight">
            <span className="block sm:inline">REAL-TIME</span>{" "}
            <span className="block sm:inline-block bg-white dark:bg-neo-blue-600 text-neo-blue-500 dark:text-white px-2 sm:px-4 py-1 sm:py-2 border-4 border-black dark:border-white transform rotate-1 mt-2 sm:mt-0">
              DASHBOARD
            </span>
          </h2>
          <p className="text-xl font-bold text-white mb-8">
            Live analytics and data visualizations showcasing my expertise
          </p>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-black dark:text-white font-black px-6 py-3 border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 disabled:opacity-50 hover:translate-x-[4px] hover:translate-y-[4px] active:translate-x-[6px] active:translate-y-[6px]"
          >
            <RefreshCw className={`inline mr-2 ${isRefreshing ? "animate-spin" : ""}`} size={20} />
            REFRESH DATA
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white dark:bg-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between font-black text-black dark:text-white">
                <span>ACTIVE USERS</span>
                <Users className="text-neo-blue-500" size={24} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black dark:text-white">
                {realtimeData[realtimeData.length - 1]?.users.toLocaleString()}
              </div>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">+12% from last hour</p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-neo-yellow-light dark:bg-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between font-black text-black dark:text-white">
                <span>REVENUE</span>
                <DollarSign className="text-black dark:text-white" size={24} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black dark:text-white">
                ${realtimeData[realtimeData.length - 1]?.revenue.toLocaleString()}
              </div>
              <p className="text-sm font-bold text-green-800 dark:text-green-300">+8% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-neo-green-light dark:bg-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between font-black text-white">
                <span>PERFORMANCE</span>
                <Activity className="text-white" size={24} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">
                {realtimeData[realtimeData.length - 1]?.performance}%
              </div>
              <p className="text-sm font-bold text-green-200">+2% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-neo-red-light dark:bg-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between font-black text-white">
                <span>GROWTH</span>
                <TrendingUp className="text-white" size={24} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{realtimeData[realtimeData.length - 1]?.growth}%</div>
              <p className="text-sm font-bold text-red-200">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-time Line Chart */}
          <Card className="border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="font-black text-xl text-black dark:text-white">REAL-TIME METRICS</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={realtimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" strokeWidth={2} />
                  <XAxis dataKey="time" stroke="#3b82f6" strokeWidth={2} className="font-bold" />
                  <YAxis stroke="#3b82f6" strokeWidth={2} className="font-bold" />
                  <Tooltip
                    contentStyle={{
                      border: "4px solid #3b82f6",
                      backgroundColor: "#1e293b",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#f59e0b"
                    strokeWidth={4}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Growth Area Chart */}
          <Card className="border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="font-black text-xl text-black dark:text-white">USER GROWTH</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" strokeWidth={2} />
                  <XAxis dataKey="month" stroke="#3b82f6" strokeWidth={2} className="font-bold" />
                  <YAxis stroke="#3b82f6" strokeWidth={2} className="font-bold" />
                  <Tooltip
                    contentStyle={{
                      border: "4px solid #3b82f6",
                      backgroundColor: "#1e293b",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Bar Chart */}
          <Card className="border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="font-black text-xl text-black dark:text-white">REVENUE BY QUARTER</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" strokeWidth={2} />
                  <XAxis dataKey="quarter" stroke="#3b82f6" strokeWidth={2} className="font-bold" />
                  <YAxis stroke="#3b82f6" strokeWidth={2} className="font-bold" />
                  <Tooltip
                    contentStyle={{
                      border: "4px solid #3b82f6",
                      backgroundColor: "#1e293b",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" stroke="#3b82f6" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Pie Chart */}
          <Card className="border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="font-black text-xl text-black dark:text-white">PERFORMANCE BREAKDOWN</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      border: "4px solid #3b82f6",
                      backgroundColor: "#1e293b",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
