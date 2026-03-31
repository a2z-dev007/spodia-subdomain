/**
 * Utility functions to build the final booking payload
 * This matches the exact structure required by the payment success API
 */

import { format } from 'date-fns'
import { PriceDetail } from '@/types/roomInventory'
import { calculateRoomPlanPromotionalPricing } from './roomPromotionalPricing'

interface SelectedRoom {
  roomId: number
  roomName: string
  planName: string
  planId?: number
  planFeatures: string[]
  quantity: number
  pricePerNight: number
  childPrice?: number
  isExtraBed: boolean
  adults: number
}

interface BookingFormData {
  hotelId: string
  hotelName: string
  hotelLocation: string
  hotelImages: string[]
  hotelRating: number
  checkInDate: string
  checkOutDate: string
  adults: number
  children: number
  rooms: SelectedRoom[]
  hotelPrice: number
  childPrice: number
  totalPrice: number
  discount: number
  finalPrice: number
  tax: number
  serviceCharge: number
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  mobile?: string
  specialRequests?: string
  notes?: string
  houseNumber?: string
  street?: string
  countryId?: string
  stateId?: string
  cityId?: string
  hasGST?: boolean
  gstNumber?: string
  companyName?: string
  gstPhone?: string
  gstAddress?: string
  cancellationPolicyId?: number | null
}

interface RoomPlanInfo {
  plan: number
  plan_name: string
  includes: string
  selectedBedType: string
  selectedRoomCount: number
  selectedSGLCount: number
  selectedDBLCount: number
  isDBLExtraBed: boolean
  isSGLExtraBed: boolean
  adults_info: AdultInfo[]
}

interface AdultInfo {
  no_adults: number
  no_of_adults: number
  selectedItem: number
  price_info: PriceInfo[]
  no_of_child: number
  child_age: string
  summary_count: number
}

interface PriceInfo {
  dateS: string
  price_per_qty: number
  child_price: number
  child_info: any[]
  no_of_child: number
  child_age: string
  price_per_day_with_out_child: number
  gross_price: number
  no_of_room: number
  price_per_day: number
  gst_percentage: number
  gst_per_day: number
  total_price: number
  discount_qty: number
  discount: number
  discount_type: string | null
  discount_value: string | null
  service_charge: number
}

interface RoomPayload {
  id: number
  room_name: string
  room_type: string
  plans: RoomPlanInfo[]
  opted_count: number
  room_for_adult: number
  extra_bed_type: string
  no_of_beds: number
  childage: string
}

/**
 * Generate dates array between check-in and check-out
 */
export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const current = new Date(start)
  while (current < end) {
    dates.push(format(current, 'yyyy-MM-dd'))
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

/**
 * Calculate nights between two dates
 */
export const calculateNights = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Build price_info array for each date in the booking
 */
const buildPriceInfo = (
  dates: string[],
  pricePerNight: number,
  childPrice: number,
  noOfRooms: number,
  noOfChild: number,
  childAge: string,
  gstPercentage: number = 12,
  roomId?: number,
  planId?: number,
  promotionDetails?: any[]
): PriceInfo[] => {
  return dates.map(date => {
    let finalPricePerNight = pricePerNight
    let discountAmount = 0
    let discountType: string | null = null
    let discountValue: string | null = null

    // Calculate promotional discount for this specific date
    if (roomId && planId && promotionDetails && promotionDetails.length > 0) {
      const promotionalPricing = calculateRoomPlanPromotionalPricing(
        pricePerNight,
        roomId,
        planId,
        promotionDetails,
        date, // Check if this specific date is within promotion period
        date
      )

      if (promotionalPricing.hasPromotion) {
        // Check if the current date is within the promotion STAY period
        const currentDate = new Date(date)
        const stayStart = promotionalPricing.stayStart ? new Date(promotionalPricing.stayStart) : null
        const stayEnd = promotionalPricing.stayEnd ? new Date(promotionalPricing.stayEnd) : null

        const isWithinStayPeriod = (!stayStart || currentDate >= stayStart) && 
                                   (!stayEnd || currentDate <= stayEnd)

        if (isWithinStayPeriod) {
          finalPricePerNight = promotionalPricing.discountedPrice
          discountAmount = promotionalPricing.savings
          discountType = promotionalPricing.offerType
          discountValue = promotionalPricing.offerType === 'Percentage' 
            ? `${promotionalPricing.discountPercentage}%` 
            : `₹${discountAmount}`
        }
      }
    }

    const grossPrice = finalPricePerNight * noOfRooms
    const gstPerDay = Math.round(grossPrice * (gstPercentage / 100))
    const serviceCharge = Math.round(grossPrice * 0.04)
    const totalPrice = grossPrice + gstPerDay
    
    return {
      dateS: date,
      price_per_qty: finalPricePerNight,
      child_price: childPrice,
      child_info: [],
      no_of_child: noOfChild,
      child_age: childAge,
      price_per_day_with_out_child: grossPrice,
      gross_price: grossPrice,
      no_of_room: noOfRooms,
      price_per_day: grossPrice,
      gst_percentage: gstPercentage,
      gst_per_day: gstPerDay,
      total_price: totalPrice,
      discount_qty: noOfRooms,
      discount: discountAmount * noOfRooms,
      discount_type: discountType,
      discount_value: discountValue,
      service_charge: serviceCharge
    }
  })
}

/**
 * Build adults_info array for a room plan
 */
const buildAdultsInfo = (
  room: SelectedRoom,
  dates: string[],
  childrenCount: number,
  childrenAges: number[],
  promotionDetails?: any[]
): AdultInfo[] => {
  const childAge = childrenAges.length > 0 ? childrenAges.join(',') : ''
  const childPrice = room.childPrice || 0
  
  return [{
    no_adults: room.adults,
    no_of_adults: room.adults * room.quantity,
    selectedItem: room.quantity,
    price_info: buildPriceInfo(
      dates,
      room.pricePerNight,
      childPrice,
      room.quantity,
      childrenCount,
      childAge,
      12, // gstPercentage
      room.roomId,
      room.planId,
      promotionDetails
    ),
    no_of_child: childrenCount,
    child_age: childAge,
    summary_count: 1
  }]
}

/**
 * Build room plans array from selected rooms
 */
const buildRoomPlans = (
  selectedRooms: SelectedRoom[],
  dates: string[],
  childrenCount: number,
  childrenAges: number[],
  roomPricing: PriceDetail[],
  promotionDetails?: any[]
): RoomPlanInfo[] => {
  // Group rooms by plan
  const planMap = new Map<string, SelectedRoom[]>()
  
  selectedRooms.forEach(room => {
    const key = `${room.planId}-${room.planName}`
    if (!planMap.has(key)) {
      planMap.set(key, [])
    }
    planMap.get(key)!.push(room)
  })
  
  // Build plan info for each unique plan
  const plans: RoomPlanInfo[] = []
  
  planMap.forEach((rooms, key) => {
    const firstRoom = rooms[0]
    const totalRoomCount = rooms.reduce((sum, r) => sum + r.quantity, 0)
    
    plans.push({
      plan: firstRoom.planId || 0,
      plan_name: firstRoom.planName,
      includes: firstRoom.planFeatures.join(','),
      selectedBedType: 'sbr_rate',
      selectedRoomCount: totalRoomCount,
      selectedSGLCount: 0,
      selectedDBLCount: 0,
      isDBLExtraBed: firstRoom.isExtraBed,
      isSGLExtraBed: false,
      adults_info: buildAdultsInfo(firstRoom, dates, childrenCount, childrenAges, promotionDetails)
    })
  })
  
  return plans
}

/**
 * Build the complete rooms payload
 */
export const buildRoomsPayload = (
  bookingData: BookingFormData,
  hotelData: any,
  roomPricing: PriceDetail[],
  childrenAges: number[] = [],
  promotionDetails?: any[]
): RoomPayload[] => {
  const dates = generateDateRange(bookingData.checkInDate, bookingData.checkOutDate)
  
  // Group selected rooms by room ID
  const roomMap = new Map<number, SelectedRoom[]>()
  
  bookingData.rooms.forEach(room => {
    if (!roomMap.has(room.roomId)) {
      roomMap.set(room.roomId, [])
    }
    roomMap.get(room.roomId)!.push(room)
  })
  
  // Build payload for each unique room
  const roomsPayload: RoomPayload[] = []
  
  roomMap.forEach((selectedRooms, roomId) => {
    // Find room details from hotel data
    const roomDetails = hotelData.rooms?.find((r: any) => r.id === roomId)
    
    if (!roomDetails) return
    
    const totalRoomCount = selectedRooms.reduce((sum, r) => sum + r.quantity, 0)
    const totalAdults = selectedRooms.reduce((sum, r) => sum + (r.adults * r.quantity), 0)
    
    roomsPayload.push({
      id: roomId,
      room_name: roomDetails.room_name || roomDetails.costume_room_name,
      room_type: roomDetails.room_type_details?.name || roomDetails.room_name,
      plans: buildRoomPlans(selectedRooms, dates, bookingData.children, childrenAges, roomPricing, promotionDetails),
      opted_count: totalRoomCount,
      room_for_adult: totalAdults,
      extra_bed_type: roomDetails.extra_bed_type || '',
      no_of_beds: roomDetails.no_of_beds || 1,
      childage: childrenAges.join(',')
    })
  })
  
  return roomsPayload
}

/**
 * Build the complete booking payload for payment success API
 */
export const buildBookingPayload = (
  bookingData: BookingFormData,
  hotelData: any,
  roomPricing: PriceDetail[],
  childrenAges: number[] = [],
  razorpayData?: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }
) => {
  const dates = generateDateRange(bookingData.checkInDate, bookingData.checkOutDate)
  const nights = calculateNights(bookingData.checkInDate, bookingData.checkOutDate)
  
  // Get promotion details from booking data
  const promotionDetails = (bookingData as any).promotionDetails || []
  
  // Build rooms payload with promotion details
  const rooms = buildRoomsPayload(bookingData, hotelData, roomPricing, childrenAges, promotionDetails)
  
  // Calculate total promotional discount from all rooms' price_info
  let totalRoomPromotionalDiscount = 0
  rooms.forEach(room => {
    room.plans.forEach(plan => {
      plan.adults_info.forEach(adultInfo => {
        adultInfo.price_info.forEach(priceInfo => {
          totalRoomPromotionalDiscount += priceInfo.discount || 0
        })
      })
    })
  })
  
  // Get additional discounts from pricing summary
  const pricingSummary = (bookingData as any).pricingSummary
  const memberOnlyDiscount = pricingSummary?.memberOnlyDiscount || 0
  const couponDiscount = pricingSummary?.couponDiscount || 0
  
  // Calculate total discount_sum (all promotional discounts combined)
  const totalDiscountSum = totalRoomPromotionalDiscount + memberOnlyDiscount + couponDiscount
  
  // Calculate totals
  const priceSum = bookingData.hotelPrice
  const childPriceSum = bookingData.childPrice
  const priceSumWithoutChildPrice = priceSum
  const discountSum = bookingData.discount
  const gstSum = bookingData.tax
  const serviceCharge = bookingData.serviceCharge
  const totalWithoutServiceCharge = priceSum + childPriceSum + gstSum
  const total = totalWithoutServiceCharge + serviceCharge
  
  // Get city, state, country names from location APIs or booking data
  const locationParts = bookingData.hotelLocation.split(',').map(s => s.trim())
  const city = locationParts[locationParts.length - 3] || ''
  const state = locationParts[locationParts.length - 2] || ''
  const country = locationParts[locationParts.length - 1] || ''
  
  // Collect all unique highlights from selected rooms
  const highlights = Array.from(
    new Set(
      bookingData.rooms.flatMap(room => room.planFeatures)
    )
  )
  
  const payload = {
    // Razorpay data (will be added after payment)
    ...(razorpayData && {
      razorpay_payment_id: razorpayData.razorpay_payment_id,
      razorpay_order_id: razorpayData.razorpay_order_id,
      razorpay_signature: razorpayData.razorpay_signature
    }),
    
    // Pricing summary
    price_sum: priceSum,
    discount_sum: totalDiscountSum, // Total of all promotional discounts (room promotions + member-only + coupon)
    total_price_sum: totalWithoutServiceCharge,
    gst_sum: gstSum,
    
    // Rooms data
    rooms: rooms,
    roomsCount: bookingData.rooms.reduce((sum, r) => sum + r.quantity, 0),
    
    // Detailed pricing
    price: priceSum,
    tax: gstSum,
    discount: discountSum,
    book_price_sum: priceSum + childPriceSum,
    price_sum_without_child_price: priceSumWithoutChildPrice,
    child_price_sum: childPriceSum,
    total_without_service_charge: totalWithoutServiceCharge.toFixed(2),
    serviceCharge: serviceCharge,
    total: total.toFixed(2),
    
    // Highlights
    highlights: highlights,
    
    // Guest information
    fname: bookingData.firstName || '',
    lname: bookingData.lastName || '',
    mobile: (bookingData as any).mobile || bookingData.phone || '',
    message: (bookingData as any).notes || bookingData.specialRequests || '',
    
    // Booking dates
    start_date: format(new Date(bookingData.checkInDate), 'yyyy-MM-dd'),
    end_date: format(new Date(bookingData.checkOutDate), 'yyyy-MM-dd'),
    dates: dates,
    
    // Guest counts
    no_of_child: bookingData.children,
    no_of_adult: bookingData.adults,
    childInfo: childrenAges.join(','),
    total_rooms: bookingData.rooms.reduce((sum, r) => sum + r.quantity, 0),
    no_of_guests: bookingData.adults + bookingData.children,
    
    // Hotel information
    listingid: parseInt(bookingData.hotelId),
    
    // Billing address
    houseNumber: bookingData.houseNumber || '',
    street: bookingData.street || '',
    city: city,
    state: state,
    country: country,
    
    // GST information
    gst: bookingData.hasGST || false,
    gst_number: bookingData.gstNumber || '',
    gst_company_name: bookingData.companyName || '',
    gst_phone_number: bookingData.gstPhone || '',
    gst_address: bookingData.gstAddress || '',
    
    // Cancellation policy
    cancellation_policy: bookingData.cancellationPolicyId || null,
    
    // Booking type
    booking_type: 'b2c'
  }
  
  return payload
}
