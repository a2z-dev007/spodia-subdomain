/**
 * Custom hook for room occupancy validation
 * Provides easy-to-use validation functions for room selection
 */

import { useMemo } from 'react'
import {
  validateBeforeCheckout,
  validateRoomCapacityDetailed,
  calculateEffectiveAdultCount,
  calculatePaidOccupancy,
  categorizeChildrenByAge,
  getChildPricingCategory,
  type SearchParameters,
  type SelectedRoomForValidation,
  type ValidationResult,
} from '@/utils/roomOccupancyValidation'

export interface UseRoomOccupancyValidationProps {
  searchParams: SearchParameters
  selectedRooms: SelectedRoomForValidation[]
  childrenAges: number[]
}

export function useRoomOccupancyValidation({
  searchParams,
  selectedRooms,
  childrenAges,
}: UseRoomOccupancyValidationProps) {
  // Validate room selection
  const validationResult = useMemo(() => {
    return validateBeforeCheckout(searchParams, selectedRooms, childrenAges)
  }, [searchParams, selectedRooms, childrenAges])

  // Calculate effective adult count
  const effectiveAdultCount = useMemo(() => {
    return calculateEffectiveAdultCount(searchParams.totalAdults, childrenAges)
  }, [searchParams.totalAdults, childrenAges])

  // Calculate total adult capacity from selected rooms
  const totalAdultCapacity = useMemo(() => {
    return selectedRooms
      .filter((room) => room.quantity > 0)
      .reduce((sum, room) => sum + room.adults * room.quantity, 0)
  }, [selectedRooms])

  // Categorize children by age
  const childrenCategories = useMemo(() => {
    return categorizeChildrenByAge(childrenAges)
  }, [childrenAges])

  // Validate individual rooms with detailed feedback
  const roomValidations = useMemo(() => {
    return selectedRooms.map((room) => ({
      roomId: room.roomId,
      roomName: room.roomName,
      validation: validateRoomCapacityDetailed(room, []),
    }))
  }, [selectedRooms])

  // Check if selection meets minimum requirements
  const meetsMinimumRequirements = useMemo(() => {
    return totalAdultCapacity >= effectiveAdultCount
  }, [totalAdultCapacity, effectiveAdultCount])

  // Get child pricing categories
  const childPricingBreakdown = useMemo(() => {
    return childrenAges.map((age) => ({
      age,
      category: getChildPricingCategory(age),
    }))
  }, [childrenAges])

  return {
    // Validation results
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    
    // Capacity calculations
    effectiveAdultCount,
    totalAdultCapacity,
    meetsMinimumRequirements,
    
    // Children categorization
    childrenCategories,
    childPricingBreakdown,
    
    // Room-specific validations
    roomValidations,
    
    // Validation function
    validate: () => validateBeforeCheckout(searchParams, selectedRooms, childrenAges),
  }
}
