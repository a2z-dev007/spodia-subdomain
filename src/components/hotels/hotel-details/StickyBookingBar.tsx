"use client"

import React, { useState, useEffect } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { format } from 'date-fns'

interface StickyBookingBarProps {
  selectedRooms: any[]
  onViewSummary: () => void
  onBookNow: () => void
  isVisible: boolean
  isValidationPassed: boolean
  correctHotelPrice?: number // Pass the exact price from parent
  appliedDates: {
    checkIn: Date | null
    checkOut: Date | null
    guests: { adults: number; children: number }
  }
}

const StickyBookingBar = ({ 
  selectedRooms, 
  onViewSummary, 
  onBookNow, 
  isVisible,
  isValidationPassed,
  correctHotelPrice,
  appliedDates 
}: StickyBookingBarProps) => {
  const [isSticky, setIsSticky] = useState(false)
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })

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

  const roomPriceTotal = getRoomPriceTotal()
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
            <div className="flex items-center justify-between">
              {/* Left Side - Selection Info */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedRoomsCount} Room{selectedRoomsCount > 1 ? 's' : ''} Selected
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
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
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Room Total</div>
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{roomPriceTotal.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    (excl. taxes & fees)
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isValidationPassed && hasAccuratePricing && (
                    <button
                      onClick={onViewSummary}
                      className="px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      View Summary
                    </button>
                  )}
                  
                  <button
                    onClick={onBookNow}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    BOOK NOW
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
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
              
              <div className="text-right leading-none">
                <div className="text-base font-bold text-orange-600">
                  ₹{roomPriceTotal.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  excl. taxes
                </div>
              </div>
            </div>

            {/* Bottom Row - Action Buttons */}
            <div className="flex gap-2">
              {isValidationPassed && hasAccuratePricing && (
                <button
                  onClick={onViewSummary}
                  className="flex-1 py-2 text-[13px] border border-orange-500 text-orange-500 font-semibold rounded-md hover:bg-orange-50 transition-colors text-center"
                >
                  View Summary
                </button>
              )}
              
              <button
                onClick={onBookNow}
                className={`${isValidationPassed && hasAccuratePricing ? 'flex-[1.2]' : 'flex-1'} py-2 px-4 text-[13px] bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold rounded-md transition-all duration-200 shadow-md flex items-center justify-center gap-1`}
              >
                BOOK NOW
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default StickyBookingBar