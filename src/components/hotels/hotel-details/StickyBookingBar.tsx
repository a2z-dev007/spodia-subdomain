"use client"

import React, { useState, useEffect } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { format } from 'date-fns'
import { mapBookingSummaryToPricing } from '@/utils/mapBookingSummaryToPricing'

interface StickyBookingBarProps {
  selectedRooms: any[]
  onViewSummary: () => void | Promise<void>
  onBookNow: () => void
  onClearBooking?: () => void
  isVisible: boolean
  isValidationPassed: boolean
  correctHotelPrice?: number // Pass the exact price from parent
  appliedDates: {
    checkIn: Date | null
    checkOut: Date | null
    guests: { adults: number; children: number }
  }
  isSaving?: boolean
  bookingId: number | string | null
}

const StickyBookingBar = ({ 
  selectedRooms, 
  onViewSummary, 
  onBookNow, 
  onClearBooking,
  isVisible,
  isValidationPassed,
  correctHotelPrice,
  appliedDates,
  isSaving = false,
  bookingId
}: StickyBookingBarProps) => {
  const [isSticky, setIsSticky] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })

  const isSaved = !!bookingId

  const handleViewSummary = async () => {
    if (isSummaryLoading) return
    setIsSummaryLoading(true)
    try {
      await onViewSummary()
    } catch (error) {
      console.error("Error loading summary:", error)
    } finally {
      setIsSummaryLoading(false)
    }
  }

  // Calculate selected rooms count
  const selectedRoomsCount = selectedRooms.filter(room => room.quantity > 0).length

  // Calculate nights
  const nights = appliedDates.checkIn && appliedDates.checkOut
    ? Math.ceil((appliedDates.checkOut.getTime() - appliedDates.checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 1

  // Calculate room price total using prices already stored in selectedRooms
  // NOTE: room.pricePerNight already contains the promotional/discounted price
  // with blackout dates properly checked
  const getRoomPriceTotal = () => {
    if (selectedRooms.length === 0 || selectedRooms.every(room => room.quantity === 0)) {
      return 0
    }

    console.log('=== STICKY BAR SIMPLE CALCULATION ===')
    console.log('selectedRooms:', selectedRooms)
    console.log('nights:', nights)
    
    // Calculate total using prices already in selectedRooms (which include promotions with blackout dates checked)
    let totalRoomSubtotal = 0

    selectedRooms.forEach((room: any) => {
      if (room.quantity > 0) {
        // room.pricePerNight already contains the promotional/discounted price
        const roomTotal = room.pricePerNight * room.quantity * nights
        
        // Add child price if applicable
        const childTotal = (room.childPrice || 0) * room.quantity * nights
        
        totalRoomSubtotal += roomTotal + childTotal
        
        console.log(`Room ${room.roomId}: pricePerNight=${room.pricePerNight}, childPrice=${room.childPrice || 0}, quantity=${room.quantity}, nights=${nights}, total=${roomTotal + childTotal}`)
      }
    })
    
    return Math.round(totalRoomSubtotal)
  }

  // Room Total = original_hotel_price - promotion_discount (room promos only).
  // Never total_base_price: that also subtracts coupon/member discounts which
  // don't belong in the sticky bar's room price.
  const getApiRoomTotal = (): number | null => {
    if (!isSaved) return null

    const apiSummary = (bookingFormData as any).apiSummary
    if (apiSummary) {
      const pricing = mapBookingSummaryToPricing(apiSummary)
      if (pricing.originalHotelPrice > 0) {
        return pricing.originalHotelPrice - Number(pricing.totalPromotionalDiscount || 0)
      }
    }

    const pricingSummary = (bookingFormData as any).pricingSummary
    if (pricingSummary && Number(pricingSummary.originalHotelPrice || 0) > 0) {
      return Number(pricingSummary.originalHotelPrice) - Number(pricingSummary.totalPromotionalDiscount || 0)
    }

    return null
  }

  const roomPriceTotal = Math.round(getApiRoomTotal() ?? getRoomPriceTotal())
  // Check if we have accurate pricing (to decide whether to show View Summary)
  // Show View Summary if we have per-date pricing data or Redux booking data
  const hasAccuratePricing = (correctHotelPrice && correctHotelPrice > 0) || 
                            ((bookingFormData as any).hotelPrice && (bookingFormData as any).hotelPrice > 0) ||
                            ((bookingFormData as any).perDatePricing && (bookingFormData as any).perDatePricing.length > 0)

  // Handle scroll to show/hide sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const shouldBeSticky = scrollY > 300 // Show sticky after scrolling 300px
      setIsSticky(shouldBeSticky)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't render if no rooms selected or not visible
  if (!isVisible || selectedRoomsCount === 0) {
    return null
  }

  console.log("----------roomPriceTotal--------------------",roomPriceTotal)
  return (
    <>
      {/* Desktop Sticky Bar - Bottom */}
      <div className={`hidden lg:block fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
        isSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="bg-white border-t-2 border-orange-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left Side - Selection Info */}
              <div className="flex items-center gap-4 xl:gap-6 min-w-0">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {selectedRoomsCount} Room{selectedRoomsCount > 1 ? 's' : ''} Selected
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 truncate">
                  {appliedDates.checkIn && appliedDates.checkOut && (
                    <>
                      {format(appliedDates.checkIn, 'MMM dd')} - {format(appliedDates.checkOut, 'MMM dd')} 
                      <span className="mx-2">•</span>
                      {nights} night{nights > 1 ? 's' : ''}
                      <span className="mx-2">•</span>
                      {appliedDates.guests.adults} adult{appliedDates.guests.adults > 1 ? 's' : ''}
                      {appliedDates.guests.children > 0 && (
                        <>, {appliedDates.guests.children} child{appliedDates.guests.children > 1 ? 'ren' : ''}</>
                      )}
                    </>
                  )}
                </div>
              </div>
                  
              {/* Right Side - Price and Actions */}
              <div className="flex items-center gap-3 xl:gap-4 shrink-0">
                <button
                  type="button"
                  onClick={handleViewSummary}
                  disabled={!isValidationPassed || isSummaryLoading || isSaving}
                  className="text-right group disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-lg"
                  aria-label="View price summary"
                >
                  <div className="text-sm text-gray-600">Room Total</div>
                  <div className="text-2xl font-bold text-orange-600 min-w-[70px]">
                    {isSaving ? (
                      <span className="h-6 bg-gray-200 rounded animate-pulse w-16 inline-block"></span>
                    ) : (
                      <>₹{roomPriceTotal.toLocaleString()}</>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    (excl. taxes & fees)
                  </div>
                </button>

                <div className="flex items-center gap-2 xl:gap-3">
                  {/* {isValidationPassed && isSaved && (
                    <button
                      onClick={handleViewSummary}
                      disabled={isSummaryLoading}
                      className="px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed min-w-[150px]"
                    >
                      {isSummaryLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <span>View Summary</span>
                      )}
                    </button>
                  )} */}
                  
                  <button
                    onClick={onBookNow}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm min-w-[130px] xl:px-8 xl:py-3 xl:text-base xl:min-w-[170px] whitespace-nowrap bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4 xl:h-5 xl:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>BOOK NOW</span>
                        <svg className="w-4 h-4 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>

                  {onClearBooking && (
                    <button
                      onClick={onClearBooking}
                      disabled={isSaving}
                      className="px-3.5 py-2 text-sm xl:px-5 xl:py-3 xl:text-base whitespace-nowrap border-2 border-gray-300 text-gray-600 font-bold rounded-lg hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>CLEAR</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar - Bottom */}
      <div className={`lg:hidden fixed bottom-16 left-0 right-0 z-40 transition-all duration-300 ${
        isSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="bg-white border-t border-orange-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="px-3 py-2">
            {/* Top Row - Selection Info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-900">
                  {selectedRoomsCount} Room{selectedRoomsCount > 1 ? 's' : ''} Selected
                </span>
              </div>
              
              <button
                type="button"
                onClick={handleViewSummary}
                disabled={!isValidationPassed || isSummaryLoading || isSaving}
                className="text-right leading-none group disabled:cursor-default focus:outline-none"
                aria-label="View price summary"
              >
                <div className="text-base font-bold text-orange-600">
                  ₹{roomPriceTotal.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  excl. taxes
                </div>
              </button>
            </div>

            {/* Bottom Row - Action Buttons */}
            <div className="flex gap-2">
              {/* {isValidationPassed && isSaved && (
                <button
                  onClick={handleViewSummary}
                  disabled={isSummaryLoading}
                  className="flex-1 py-2 text-[13px] border border-orange-500 text-orange-500 font-semibold rounded-md hover:bg-orange-50 transition-colors text-center flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSummaryLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>View Summary</span>
                  )}
                </button>
              )} */}
              
              <button
                onClick={onBookNow}
                disabled={isSaving}
                className="flex-1 min-w-0 py-2 px-4 text-[13px] whitespace-nowrap bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold rounded-md transition-all duration-200 shadow-md flex items-center justify-center gap-1 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>BOOK NOW</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              {onClearBooking && (
                <button
                  onClick={onClearBooking}
                  disabled={isSaving}
                  aria-label="Clear booking selection"
                  className="shrink-0 py-2 px-3 text-[13px] whitespace-nowrap border border-gray-300 text-gray-600 font-bold rounded-md hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>CLEAR</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default StickyBookingBar