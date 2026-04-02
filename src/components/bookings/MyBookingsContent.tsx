"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import BookingCard from "./BookingCard"
import BookingFilters from "./BookingFilters"
import Pagination from "./Pagination"
import { Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Booking, BookingApiResponse, BookingFilters as BookingFiltersType } from "@/types/booking"
import { getRecentReservations } from "@/services/api"

const MyBookingsContent = () => {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState<BookingFiltersType>({
    status: "all",
    dateRange: "all"
  })
  const [showFilters, setShowFilters] = useState(false)

  const recordsPerPage = 10

  useEffect(() => {
    // Only fetch bookings if user is authenticated and not loading
    if (!authLoading && user) {
      fetchBookings()
    }
  }, [currentPage, authLoading, user])

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1)
  }, [filters])

  useEffect(() => {
    // Fetch bookings when filters change (after page reset)
    if (currentPage === 1 && !authLoading && user) {
      fetchBookings()
    }
  }, [filters, currentPage, authLoading, user])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("spodia_access_token")
      
      if (!token) {
        console.error("No access token found")
        // Don't redirect here, let ProtectedRoute handle it
        setLoading(false)
        return
      }

      const response = await getRecentReservations({ 
        page_number: currentPage, 
        number_of_records: recordsPerPage 
      })

      const data: BookingApiResponse = response.data
      
      console.log("API Response:", data) // Debug log
      
      if (data.status === "success") {
        setBookings(data.records || [])
        
        // Handle different possible response structures
        let actualTotalCount = 0
        
        if (data.total_count !== undefined) {
          actualTotalCount = data.total_count
        } else if ((data as any).total_pages && (data as any).current_page) {
          // If API returns total_pages, calculate total count
          actualTotalCount = (data as any).total_pages * recordsPerPage
        } else {
          // Fallback: if we got a full page of records, assume there might be more
          actualTotalCount = data.records.length === recordsPerPage 
            ? (currentPage * recordsPerPage) + 1 // Assume at least one more page
            : (currentPage - 1) * recordsPerPage + data.records.length
        }
        
        setTotalCount(actualTotalCount)
        
        console.log("Pagination Info:", {
          currentPage,
          recordsPerPage,
          totalRecords: data.records.length,
          totalCount: actualTotalCount,
          totalPages: Math.ceil(actualTotalCount / recordsPerPage),
          apiTotalCount: data.total_count,
          apiTotalPages: (data as any).total_pages,
          apiCurrentPage: (data as any).current_page
        })
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  // Apply client-side filtering for now (can be moved to server-side later)
  const filteredBookings = bookings.filter(booking => {
    if (filters.status !== "all" && booking.status !== filters.status) {
      return false
    }
    
    if (filters.dateRange !== "all") {
      const bookingDate = new Date(booking.created)
      const now = new Date()
      
      switch (filters.dateRange) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return bookingDate >= weekAgo
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return bookingDate >= monthAgo
        case "year":
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          return bookingDate >= yearAgo
        default:
          return true
      }
    }
    
    return true
  })

  // Calculate total pages based on total count from API
  const totalPages = Math.ceil(totalCount / recordsPerPage)

  // Show loading if auth is still loading or bookings are loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full w-10 h-10 sm:w-12 sm:h-12 border-b-4 border-[#FF9530] mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (ProtectedRoute will handle redirect)
  if (!user) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage and track all your hotel reservations</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            <span className="text-sm text-gray-600">
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {showFilters && (
          <BookingFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">
            {filters.status !== "all" || filters.dateRange !== "all"
              ? "Try adjusting your filters to see more results."
              : "Start planning your next trip!"}
          </p>
          <Button 
            onClick={() => router.push("/")}
            className="bg-[#FF9530] hover:bg-[#e8851c] text-white"
          >
            Browse Hotels
          </Button>
        </div>
      )}
    </div>
  )
}

export default MyBookingsContent