"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import BookingCardNew from "./BookingCardNew"
import { Calendar, Search, X, Loader2, Hotel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Booking, BookingApiResponse } from "@/types/booking"
import { getRecentReservations } from "@/services/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MyBookingsContentNew = () => {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const recordsPerPage = 10

  useEffect(() => {
    if (!authLoading && user) {
      fetchBookings()
    }
  }, [currentPage, authLoading, user])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("spodia_access_token")
      
      if (!token) {
        setLoading(false)
        return
      }

      const response = await getRecentReservations({ 
        page_number: currentPage, 
        number_of_records: recordsPerPage 
      })

      const data: BookingApiResponse = response.data
      
      if (data.status === "success") {
        setBookings(data.records || [])
        setTotalCount(data.total_count || data.records.length)
      } else {
        console.error("API returned error status:", data)
        setBookings([])
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error)
      const errorMessage = error?.message || "Failed to load bookings"
      // Show error to user (you can add toast notification here if needed)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  // Filter bookings based on tab and search
  const filteredBookings = bookings.filter(booking => {
    // Tab filter
    if (activeTab !== "all") {
      if (activeTab === "upcoming" && booking.status.toLowerCase() !== "confirmed") return false
      if (activeTab === "completed" && booking.status.toLowerCase() !== "completed") return false
      if (activeTab === "cancelled" && booking.status.toLowerCase() !== "cancelled") return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        booking.listingdetails.name.toLowerCase().includes(query) ||
        booking.booking_number.toLowerCase().includes(query) ||
        booking.listingdetails.city_name?.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Get counts for each tab
  const counts = {
    all: bookings.length,
    upcoming: bookings.filter(b => b.status.toLowerCase() === "confirmed").length,
    completed: bookings.filter(b => b.status.toLowerCase() === "completed").length,
    cancelled: bookings.filter(b => b.status.toLowerCase() === "cancelled").length,
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#078ED8] animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My Bookings
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and track all your hotel reservations in one place
              </p>
            </div>
            <Button
              onClick={() => router.push("/")}
              className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-4 sm:px-6 h-10 sm:h-12 rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base w-full sm:w-auto"
            >
              <Hotel className="w-4 h-4 mr-2" />
              Book New Hotel
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="text"
                placeholder="Search by hotel name, booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 pr-10 h-10 sm:h-12 rounded-full border-gray-200 focus:border-[#078ED8] focus:ring-[#078ED8] text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-full p-1 shadow-sm border border-gray-100 h-auto">
            <TabsTrigger 
              value="all" 
              className="rounded-full data-[state=active]:bg-[#078ED8] data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4 py-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">All</span>
              <span className="sm:hidden">All</span>
              <span className="ml-1">({counts.all})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming"
              className="rounded-full data-[state=active]:bg-green-500 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4 py-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Upcoming</span>
              <span className="sm:hidden">Up</span>
              <span className="ml-1">({counts.upcoming})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="rounded-full data-[state=active]:bg-gray-500 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4 py-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Done</span>
              <span className="ml-1">({counts.completed})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled"
              className="rounded-full data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4 py-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Cancelled</span>
              <span className="sm:hidden">Can</span>
              <span className="ml-1">({counts.cancelled})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 sm:mt-6">
            {filteredBookings.length > 0 ? (
              <div className="">
                {filteredBookings.map((booking) => (
                  <BookingCardNew key={booking.id} booking={booking} onBookingUpdate={fetchBookings} />
                ))}

                {/* Pagination */}
                {totalCount > recordsPerPage && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 py-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="rounded-full px-4 sm:px-6 h-10 text-sm w-full sm:w-auto"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                      {Array.from({ length: Math.ceil(totalCount / recordsPerPage) }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first page, last page, current page, and pages around current
                          const totalPages = Math.ceil(totalCount / recordsPerPage)
                          return page === 1 || 
                                 page === totalPages || 
                                 Math.abs(page - currentPage) <= 1
                        })
                        .map((page, index, array) => {
                          // Add ellipsis if there's a gap
                          const prevPage = array[index - 1]
                          const showEllipsis = prevPage && page - prevPage > 1
                          
                          return (
                            <div key={page} className="flex gap-1 sm:gap-2 items-center">
                              {showEllipsis && (
                                <span className="px-2 py-2 text-gray-400 text-sm">...</span>
                              )}
                              <Button
                                onClick={() => setCurrentPage(page)}
                                variant={currentPage === page ? "default" : "outline"}
                                className={`rounded-full w-9 h-9 sm:w-10 sm:h-10 p-0 text-sm ${
                                  currentPage === page 
                                    ? "bg-[#078ED8] text-white hover:bg-[#0679b8]" 
                                    : ""
                                }`}
                              >
                                {page}
                              </Button>
                            </div>
                          )
                        })}
                    </div>

                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / recordsPerPage), prev + 1))}
                      disabled={currentPage >= Math.ceil(totalCount / recordsPerPage)}
                      variant="outline"
                      className="rounded-full px-4 sm:px-6 h-10 text-sm w-full sm:w-auto"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 bg-white rounded-2xl shadow-sm border border-gray-100 px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? "No bookings found" : "No bookings yet"}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? "Try adjusting your search to find what you're looking for."
                    : "Start planning your next adventure and book your perfect stay!"}
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => router.push("/")}
                    className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-6 sm:px-8 h-10 sm:h-12 rounded-full shadow-lg text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Hotel className="w-4 h-4 mr-2" />
                    Browse Hotels
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default MyBookingsContentNew
