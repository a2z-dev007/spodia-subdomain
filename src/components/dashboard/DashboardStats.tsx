import { Calendar, MapPin, CreditCard, Star } from "lucide-react"

const DashboardStats = () => {
  const stats = [
    {
      icon: Calendar,
      label: "Total Bookings",
      value: "12",
      change: "+2 this month",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: MapPin,
      label: "Cities Visited",
      value: "8",
      change: "+1 this month",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: CreditCard,
      label: "Total Spent",
      value: "$2,450",
      change: "+$320 this month",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Star,
      label: "Loyalty Points",
      value: "1,250",
      change: "+150 this month",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-xs text-green-600">{stat.change}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats
