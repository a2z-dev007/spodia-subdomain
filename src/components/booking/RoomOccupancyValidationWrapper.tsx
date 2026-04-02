/**
 * Room Occupancy Validation Wrapper Component
 * Wraps the booking flow with comprehensive validation
 */

"use client"

import React from 'react'
import { toast } from 'react-toastify'
import {
  validateBeforeCheckout,
  calculateEffectiveAdultCount,
  type SearchParameters,
  type SelectedRoomForValidation,
} from '@/utils/roomOccupancyValidation'

interface RoomOccupancyValidationWrapperProps {
  searchParams: SearchParameters
  selectedRooms: any[]
  childrenAges: number[]
  hotelRooms: any[]
  onValidationSuccess: () => void
  children: React.ReactNode
}

export function RoomOccupancyValidationWrapper({
  searchParams,
  selectedRooms,
  childrenAges,
  hotelRooms,
  onValidationSuccess,
  children,
}: RoomOccupancyValidationWrapperProps) {
  const handleValidateAndProceed = () => {
    // Prepare selected rooms for validation
    const roomsForValidation: SelectedRoomForValidation[] = selectedRooms
      .filter((room) => room.quantity > 0)
      .map((room) => {
        // Find room details from hotel data to get capacity constraints
        const roomDetails = hotelRooms?.find((r: any) => r.id === room.roomId)

        return {
          roomId: room.roomId,
          roomName: room.roomName,
          quantity: room.quantity,
          adults: room.adults,
          capacityData: {
            base_adults: roomDetails?.base_adults || 1,
            maximum_adults: roomDetails?.maximum_adults || 2,
            maximum_children: roomDetails?.maximum_children || 0,
            maximum_occupancy: roomDetails?.maximum_occupancy || 2,
          },
        }
      })

    // Run comprehensive validation
    const validation = validateBeforeCheckout(searchParams, roomsForValidation, childrenAges)

    if (!validation.isValid) {
      // Show all validation errors
      validation.errors.forEach((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      })
      return false
    }

    // Validation passed
    onValidationSuccess()
    return true
  }

  return (
    <div onClick={handleValidateAndProceed}>
      {children}
    </div>
  )
}
