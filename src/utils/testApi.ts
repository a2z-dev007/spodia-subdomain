import { getRecentReservations } from "@/services/api"

// Utility to test API response structure
export const testBookingsApi = async () => {
  try {
    const response = await getRecentReservations({ page_number: 1, number_of_records: 5 })
    const data = response.data
    
    console.log("API Response Structure:", {
      status: data.status,
      recordsCount: data.records?.length || 0,
      totalCount: data.total_count,
      hasNextPage: data.has_next_page,
      hasPreviousPage: data.has_previous_page,
      currentPage: data.current_page,
      totalPages: data.total_pages,
      fullResponse: data
    })

    return data
  } catch (error) {
    console.error("Error testing API:", error)
    return null
  }
}

// Call this function in browser console to test API response
if (typeof window !== 'undefined') {
  (window as any).testBookingsApi = testBookingsApi
}