"use client"

import { useAppSelector } from "@/lib/hooks"
import DashboardStats from "./DashboardStats"
import RecentBookings from "./RecentBookings"

import ProfileOverview from "./ProfileOverview"

const DashboardContent = () => {
  const { user } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.full_name}!</h1>
        <p className="text-gray-600">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* <DashboardStats /> */}
          <RecentBookings />
          {/* <QuickActions /> */}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ProfileOverview />
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
