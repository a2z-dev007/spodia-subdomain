"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import BookingCardNew from "./BookingCardNew"
import { Calendar, Search, X, Hotel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: "smooth" })
      document.body.scrollTop = 0
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.scrollTo(0, 0)
        }
      }, 100)
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchBookings()
    }
  }, [currentPage, activeTab, authLoading, user])

  useEffect(() => {
    if (!loading) {
      scrollToTop()
    }
  }, [currentPage, loading])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("spodia_access_token")
      
      if (!token) {
        setLoading(false)
        return
      }

      let statusParam: string | undefined = undefined
      if (activeTab === "upcoming") statusParam = "confirmed"
      else if (activeTab === "completed") statusParam = "completed"
      else if (activeTab === "cancelled") statusParam = "cancelled"

      const response = await getRecentReservations({ 
        page_number: currentPage, 
        number_of_records: recordsPerPage,
        status: statusParam
      })

      const data: BookingApiResponse = response.data
      
      if (data.status === "success" || (data as any).status === true) {
        const fetchedRecords = data.records || (data as any).data || []
        setBookings(fetchedRecords)

        const total =
          (data as any).total_count ??
          (data as any).total_records ??
          (data as any).total_number_of_records ??
          (data as any).count ??
          (data as any).total ??
          ((data as any).total_pages ? (data as any).total_pages * recordsPerPage : undefined)

        if (total !== undefined && total !== null && total > 0) {
          setTotalCount(Number(total))
        } else {
          // If total count is not returned directly, infer from fetched records length
          if (fetchedRecords.length === recordsPerPage) {
            setTotalCount((currentPage + 1) * recordsPerPage)
          } else {
            setTotalCount((currentPage - 1) * recordsPerPage + fetchedRecords.length)
          }
        }
      } else {
        console.error("API returned error status:", data)
        setBookings([])
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    scrollToTop()
  }

  const handleTabChange = (val: string) => {
    setActiveTab(val)
    setCurrentPage(1)
    scrollToTop()
  }

  // Search filter on fetched bookings
  const filteredBookings = bookings.filter(booking => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        booking.listingdetails?.name?.toLowerCase().includes(query) ||
        booking.booking_number?.toLowerCase().includes(query) ||
        booking.listingdetails?.city_name?.toLowerCase().includes(query)
      )
    }

    return true
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
              <Skeleton className="h-4 w-72 sm:w-96 rounded-lg" />
            </div>
            <Skeleton className="h-10 sm:h-12 w-full sm:w-44 rounded-full" />
          </div>

          {/* Booking Cards Shimmer List */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40 sm:w-56 rounded-md" />
                      <Skeleton className="h-4 w-28 sm:w-36 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-7 w-28 rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-32 rounded-md" />
                  <Skeleton className="h-10 w-28 rounded-full" />
                </div>
              </div>
            ))}
          </div>
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

        {/* Bookings List */}
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCardNew key={booking.id} booking={booking} onBookingUpdate={fetchBookings} />
            ))}

            {/* Pagination */}
            {(totalCount > recordsPerPage || currentPage > 1 || bookings.length === recordsPerPage) && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 py-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-6">
                <Button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="rounded-full px-4 sm:px-6 h-10 text-sm w-full sm:w-auto"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                  {Array.from({ length: Math.ceil(totalCount / recordsPerPage) }, (_, i) => i + 1)
                    .filter(page => {
                      const totalPages = Math.ceil(totalCount / recordsPerPage)
                      return page === 1 || 
                             page === totalPages || 
                             Math.abs(page - currentPage) <= 1
                    })
                    .map((page, index, array) => {
                      const prevPage = array[index - 1]
                      const showEllipsis = prevPage && page - prevPage > 1
                      
                      return (
                        <div key={page} className="flex gap-1 sm:gap-2 items-center">
                          {showEllipsis && (
                            <span className="px-2 py-2 text-gray-400 text-sm">...</span>
                          )}
                          <Button
                            onClick={() => handlePageChange(page)}
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
                  onClick={() => handlePageChange(Math.min(Math.ceil(totalCount / recordsPerPage), currentPage + 1))}
                  disabled={currentPage >= Math.ceil(totalCount / recordsPerPage) && bookings.length < recordsPerPage}
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
              No bookings yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
              Start planning your next adventure and book your perfect stay!
            </p>
            <Button 
              onClick={() => router.push("/")}
              className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-6 sm:px-8 h-10 sm:h-12 rounded-full shadow-lg text-sm sm:text-base w-full sm:w-auto"
            >
              <Hotel className="w-4 h-4 mr-2" />
              Browse Hotels
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookingsContentNew
