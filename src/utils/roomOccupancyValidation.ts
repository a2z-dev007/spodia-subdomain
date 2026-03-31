/**
 * Room & Occupancy Validation Logic for Spodia.com
 * 
 * This module ensures that during checkout, the final room selection must match 
 * or exceed the occupancy capacity entered in the initial search.
 */

export interface RoomCapacityData {
    base_adults: number
    maximum_adults: number
    maximum_children: number
    maximum_occupancy: number
}

export interface SelectedRoomForValidation {
    roomId: number
    roomName: string
    quantity: number
    adults: number
    capacityData: RoomCapacityData
}

export interface SearchParameters {
    totalAdults: number
    totalChildren: number
    totalRooms: number
    childrenAges: number[]
}

export interface ValidationResult {
    isValid: boolean
    errors: string[]
}

/**
 * Child Age Policy:
 * - 0-5 years: Free, does not count toward paid occupancy
 * - 6-12 years: Chargeable, counts as extra occupant
 * - 13+ years: Considered adult, counts toward main adult occupancy
 */
export const CHILD_AGE_POLICY = {
    FREE_MAX_AGE: 5,
    CHARGEABLE_MIN_AGE: 6,
    CHARGEABLE_MAX_AGE: 12,
    ADULT_MIN_AGE: 13,
} as const

/**
 * Categorize children by age into free, chargeable, and adult categories
 */
export function categorizeChildrenByAge(childrenAges: number[]): {
    freeChildren: number[]
    chargeableChildren: number[]
    adultsFromChildren: number[]
} {
    const freeChildren: number[] = []
    const chargeableChildren: number[] = []
    const adultsFromChildren: number[] = []

    childrenAges.forEach((age) => {
        if (age <= CHILD_AGE_POLICY.FREE_MAX_AGE) {
            freeChildren.push(age)
        } else if (age >= CHILD_AGE_POLICY.CHARGEABLE_MIN_AGE && age <= CHILD_AGE_POLICY.CHARGEABLE_MAX_AGE) {
            chargeableChildren.push(age)
        } else if (age >= CHILD_AGE_POLICY.ADULT_MIN_AGE) {
            adultsFromChildren.push(age)
        }
    })

    return { freeChildren, chargeableChildren, adultsFromChildren }
}

/**
 * Calculate effective adult count (includes children 13+)
 */
export function calculateEffectiveAdultCount(
    baseAdults: number,
    childrenAges: number[]
): number {
    const { adultsFromChildren } = categorizeChildrenByAge(childrenAges)
    return baseAdults + adultsFromChildren.length
}

/**
 * Calculate paid occupancy count (excludes free children 0-5)
 */
export function calculatePaidOccupancy(
    adults: number,
    childrenAges: number[]
): number {
    const { chargeableChildren, adultsFromChildren } = categorizeChildrenByAge(childrenAges)
    return adults + adultsFromChildren.length + chargeableChildren.length
}

/**
 * Calculate total occupancy including free children
 */
export function calculateTotalOccupancy(
    adults: number,
    childrenAges: number[]
): number {
    return adults + childrenAges.length
}

/**
 * Validate a single room's capacity constraints
 */
export function validateRoomCapacity(
    room: SelectedRoomForValidation,
    childrenAgesForRoom: number[]
): ValidationResult {
    const errors: string[] = []
    const { capacityData, adults, quantity, roomName } = room

    // Rule 1: At least one adult is mandatory if base_adults >= 1
    if (capacityData.base_adults >= 1 && adults < capacityData.base_adults) {
        errors.push(
            `${roomName}: Requires at least ${capacityData.base_adults} adult(s). Currently selected: ${adults}`
        )
    }

    // Rule 2: Adults cannot exceed maximum_adults
    // COMMENTED OUT: Allow flexibility in adult count beyond maximum_adults
    // if (adults > capacityData.maximum_adults) {
    //     errors.push(
    //         `${roomName}: Maximum ${capacityData.maximum_adults} adult(s) allowed. Currently selected: ${adults}`
    //     )
    // }

    // Rule 3: Children count cannot exceed maximum_children
    const childrenCount = childrenAgesForRoom.length
    if (childrenCount > capacityData.maximum_children) {
        errors.push(
            `${roomName}: Maximum ${capacityData.maximum_children} children allowed. Currently selected: ${childrenCount}`
        )
    }

    // Rule 4: Total occupancy cannot exceed maximum_occupancy
    // Note: Free children (0-5) do NOT count toward occupancy
    const paidOccupancy = calculatePaidOccupancy(adults, childrenAgesForRoom)
    if (paidOccupancy > capacityData.maximum_occupancy) {
        errors.push(
            `${roomName}: Maximum occupancy is ${capacityData.maximum_occupancy}. Current paid occupancy: ${paidOccupancy}`
        )
    }

    // Rule 5: Cannot book room with 0 adults where base_adults >= 1
    if (capacityData.base_adults >= 1 && adults === 0) {
        errors.push(`${roomName}: Cannot book room without adults`)
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}

/**
 * Main validation function: Validate final room selection against initial search
 */
export function validateRoomSelection(
    searchParams: SearchParameters,
    selectedRooms: SelectedRoomForValidation[],
    childrenAges: number[]
): ValidationResult {
    const errors: string[] = []

    // Validation 1: At least one room must be selected
    if (selectedRooms.length === 0) {
        errors.push('Please select at least one room')
        return { isValid: false, errors }
    }

    // Validation 2: All selected rooms must have quantity > 0
    const validRooms = selectedRooms.filter((room) => room.quantity > 0)
    if (validRooms.length === 0) {
        errors.push('All selected rooms must have a quantity greater than 0')
        return { isValid: false, errors }
    }

    // Validation 3: Calculate total adult capacity from selected rooms
    const totalAdultCapacity = validRooms.reduce(
        (sum, room) => sum + room.adults * room.quantity,
        0
    )

    // Validation 4: Calculate effective adult requirement (includes children 13+)
    const effectiveAdultRequirement = calculateEffectiveAdultCount(
        searchParams.totalAdults,
        childrenAges
    )

    // Validation 5: Final adult capacity must meet or exceed required adults
    if (totalAdultCapacity < effectiveAdultRequirement) {
        errors.push(
            `Selected rooms do not meet the required occupancy capacity. Required: ${effectiveAdultRequirement} adults, Selected capacity: ${totalAdultCapacity} adults`
        )
    }

    // Validation 6: Validate each room's individual capacity constraints
    validRooms.forEach((room) => {
        // For simplicity, we'll validate each room independently
        // In a real scenario, you might distribute children across rooms
        const roomValidation = validateRoomCapacity(room, [])
        if (!roomValidation.isValid) {
            errors.push(...roomValidation.errors)
        }
    })

    // Validation 7: Validate children ages are provided
    if (searchParams.totalChildren > 0) {
        if (childrenAges.length !== searchParams.totalChildren) {
            errors.push(
                `Please provide ages for all ${searchParams.totalChildren} children`
            )
        }

        // Check if any child age is 0 (not selected)
        if (childrenAges.some((age) => age === 0)) {
            errors.push('Please select age for all children')
        }
    }

    // Validation 8: Validate total room count
    const totalSelectedRooms = validRooms.reduce((sum, room) => sum + room.quantity, 0)
    if (totalSelectedRooms === 0) {
        errors.push('Please select at least one room')
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}

/**
 * Validate room selection before proceeding to checkout
 * This is the main function to call before navigation
 */
export function validateBeforeCheckout(
    searchParams: SearchParameters,
    selectedRooms: SelectedRoomForValidation[],
    childrenAges: number[]
): ValidationResult {
    return validateRoomSelection(searchParams, selectedRooms, childrenAges)
}

/**
 * Get child pricing category based on age
 */
export function getChildPricingCategory(age: number): 'free' | 'chargeable' | 'adult' {
    if (age <= CHILD_AGE_POLICY.FREE_MAX_AGE) {
        return 'free'
    } else if (age >= CHILD_AGE_POLICY.CHARGEABLE_MIN_AGE && age <= CHILD_AGE_POLICY.CHARGEABLE_MAX_AGE) {
        return 'chargeable'
    } else {
        return 'adult'
    }
}

/**
 * Calculate child pricing breakdown
 */
export function calculateChildPricing(
    childrenAges: number[],
    childRates: { child_2_5_rate: number; child_6_10_rate: number }
): {
    freeChildrenCount: number
    chargeableChildrenCount: number
    adultsFromChildrenCount: number
    totalChildPrice: number
} {
    const { freeChildren, chargeableChildren, adultsFromChildren } = categorizeChildrenByAge(childrenAges)

    let totalChildPrice = 0
    chargeableChildren.forEach((age) => {
        if (age >= 6 && age <= 10) {
            totalChildPrice += childRates.child_6_10_rate
        } else if (age >= 2 && age <= 5) {
            totalChildPrice += childRates.child_2_5_rate
        }
    })

    return {
        freeChildrenCount: freeChildren.length,
        chargeableChildrenCount: chargeableChildren.length,
        adultsFromChildrenCount: adultsFromChildren.length,
        totalChildPrice,
    }
}

/**
 * Validate room capacity with detailed error messages
 */
export function validateRoomCapacityDetailed(
    room: SelectedRoomForValidation,
    childrenAgesForRoom: number[]
): {
    isValid: boolean
    errors: string[]
    warnings: string[]
    suggestions: string[]
} {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    const { capacityData, adults, quantity, roomName } = room
    const { freeChildren, chargeableChildren, adultsFromChildren } = categorizeChildrenByAge(childrenAgesForRoom)

    // Check base adults requirement
    if (capacityData.base_adults >= 1 && adults < capacityData.base_adults) {
        errors.push(
            `${roomName}: Requires at least ${capacityData.base_adults} adult(s). Currently selected: ${adults}`
        )
        suggestions.push(`Add ${capacityData.base_adults - adults} more adult(s) to ${roomName}`)
    }

    // Check maximum adults
    // COMMENTED OUT: Allow flexibility in adult count beyond maximum_adults
    // if (adults > capacityData.maximum_adults) {
    //     errors.push(
    //         `${roomName}: Maximum ${capacityData.maximum_adults} adult(s) allowed. Currently selected: ${adults}`
    //     )
    //     suggestions.push(`Reduce adults in ${roomName} or select a larger room type`)
    // }

    // Check maximum children
    const childrenCount = childrenAgesForRoom.length
    if (childrenCount > capacityData.maximum_children) {
        errors.push(
            `${roomName}: Maximum ${capacityData.maximum_children} children allowed. Currently selected: ${childrenCount}`
        )
        suggestions.push(`Reduce children count or book an additional room`)
    }

    // Check maximum occupancy (excluding free children)
    const paidOccupancy = calculatePaidOccupancy(adults, childrenAgesForRoom)
    if (paidOccupancy > capacityData.maximum_occupancy) {
        errors.push(
            `${roomName}: Maximum occupancy is ${capacityData.maximum_occupancy}. Current paid occupancy: ${paidOccupancy}`
        )
        suggestions.push(`Consider booking a larger room or splitting guests across multiple rooms`)
    }

    // Warning for free children
    if (freeChildren.length > 0) {
        warnings.push(
            `${roomName}: ${freeChildren.length} child(ren) aged 0-5 will be accommodated free of charge`
        )
    }

    // Warning for chargeable children
    if (chargeableChildren.length > 0 && capacityData.maximum_children === 0) {
        errors.push(
            `${roomName}: This room does not allow children. Please select a different room type`
        )
        suggestions.push(`Upgrade to a room that supports children or book a family suite`)
    }

    // Warning for children counted as adults
    if (adultsFromChildren.length > 0) {
        warnings.push(
            `${roomName}: ${adultsFromChildren.length} child(ren) aged 13+ will be charged as adults`
        )
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
    }
}
