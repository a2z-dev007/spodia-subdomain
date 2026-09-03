/**
 * Utility functions to build the final booking payload for payment success API
 * Matches exact structure required by /listing/payment-success/
 */

import { format } from 'date-fns'
import { PriceDetail } from '@/types/roomInventory'
import { calculateRoomPlanPromotionalPricing } from './roomPromotionalPricing'
import { calculateFinalAmount } from './taxCalculation'

const getMealPlanId = (planName: string): number => {
  const planMap: { [key: string]: number } = {
    'EP': 2,
    'CP': 1,
    'MAP': 4,
    'AP': 3
  }
  return planMap[planName.toUpperCase()] || 1
}

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
  mobileWithCountryCode?: string
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
  gstPhoneWithCountryCode?: string
  gstAddress?: string
  cancellationPolicyId?: number | null
  bookingId?: number | string
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
  discount_value: number | null
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

export const calculateNights = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const buildPriceInfo = (
  dates: string[],
  pricePerNight: number,
  childPrice: number,
  noOfRooms: number,
  noOfChild: number,
  childAge: string,
  taxationDetails: any[] = [],
  roomId?: number,
  planId?: number,
  promotionDetails?: any[],
  perDatePricingData?: any[],
  adults?: number,
  planName?: string,
  deductionDetails: any[] = []
): PriceInfo[] => {
  return dates.map(date => {
    let finalPricePerNight = pricePerNight
    let discountAmount = 0
    let discountType: string | null = null
    let discountValue: number | null = null

    if (perDatePricingData && perDatePricingData.length > 0 && roomId) {
      const numericRoomId = Number(roomId)
      let numericPlanId = Number(planId)
      if (numericPlanId > 10 && planName) {
        numericPlanId = getMealPlanId(planName)
      }

      const pricing = perDatePricingData.find((p: any) =>
        Number(p.room) === numericRoomId &&
        Number(p.plan) === numericPlanId &&
        p.season_start === date
      )

      if (pricing) {
        const sbrRate = pricing.sbr_rate || 0
        const dbrRate = pricing.dbr_rate || 0
        const extraBedRate = pricing.extra_bed_rate || 0
        const numAdults = adults || 1

        if (numAdults === 1) {
          finalPricePerNight = sbrRate
        } else if (numAdults === 2) {
          finalPricePerNight = dbrRate || sbrRate
        } else {
          const baseRate = dbrRate || sbrRate
          finalPricePerNight = baseRate + ((numAdults - 2) * extraBedRate)
        }
      }
    }

    if (roomId && planId && promotionDetails && promotionDetails.length > 0) {
      let numericPlanId = Number(planId)
      if (numericPlanId > 10 && planName) {
        numericPlanId = getMealPlanId(planName)
      }
      const promotionalPricing = calculateRoomPlanPromotionalPricing(
        finalPricePerNight,
        Number(roomId),
        numericPlanId,
        promotionDetails,
        date,
        date
      )

      if (promotionalPricing.hasPromotion) {
        const currentDate = new Date(date)
        const stayStart = promotionalPricing.stayStart ? new Date(promotionalPricing.stayStart) : null
        const stayEnd = promotionalPricing.stayEnd ? new Date(promotionalPricing.stayEnd) : null

        const isWithinStayPeriod = (!stayStart || currentDate >= stayStart) &&
                                   (!stayEnd || currentDate <= stayEnd)

        if (isWithinStayPeriod) {
          discountAmount = promotionalPricing.savings
          discountType = promotionalPricing.offerType
          discountValue = promotionalPricing.offerType === 'Percentage'
            ? promotionalPricing.discountPercentage
            : discountAmount
          finalPricePerNight = promotionalPricing.discountedPrice
        }
      }
    }

    const grossPrice = finalPricePerNight * noOfRooms

    const taxResult = taxationDetails.length > 0
      ? calculateFinalAmount(finalPricePerNight, taxationDetails, [])
      : { totalTax: 0, taxes: [{ rate: 0 }] }
    const gstPercentage = taxResult.taxes[0]?.rate || 0
    const gstPerDay = Math.round(taxResult.totalTax * noOfRooms)
    const totalPrice = grossPrice + gstPerDay
    const deductionResult = deductionDetails && deductionDetails.length > 0
      ? calculateFinalAmount(finalPricePerNight, [], deductionDetails)
      : { totalDeductions: 0 }
    const serviceCharge = Math.round(deductionResult.totalDeductions * noOfRooms)

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

const buildAdultsInfo = (
  room: SelectedRoom,
  dates: string[],
  childrenCount: number,
  childrenAges: number[],
  promotionDetails?: any[],
  taxationDetails?: any[],
  perDatePricingData?: any[],
  deductionDetails?: any[]
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
      taxationDetails || [],
      room.roomId,
      room.planId,
      promotionDetails,
      perDatePricingData,
      room.adults,
      room.planName,
      deductionDetails || []
    ),
    no_of_child: childrenCount,
    child_age: childAge,
    summary_count: 1
  }]
}

const buildRoomPlans = (
  selectedRooms: SelectedRoom[],
  dates: string[],
  childrenCount: number,
  childrenAges: number[],
  roomPricing: PriceDetail[],
  promotionDetails?: any[],
  taxationDetails?: any[],
  perDatePricingData?: any[],
  deductionDetails?: any[]
): RoomPlanInfo[] => {
  const planMap = new Map<string, SelectedRoom[]>()

  selectedRooms.forEach(room => {
    const key = `${room.planId}-${room.planName}`
    if (!planMap.has(key)) {
      planMap.set(key, [])
    }
    planMap.get(key)!.push(room)
  })

  const plans: RoomPlanInfo[] = []

  planMap.forEach((rooms) => {
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
      adults_info: buildAdultsInfo(
        firstRoom,
        dates,
        childrenCount,
        childrenAges,
        promotionDetails,
        taxationDetails,
        perDatePricingData,
        deductionDetails
      )
    })
  })

  return plans
}

export const buildRoomsPayload = (
  bookingData: BookingFormData,
  hotelData: any,
  roomPricing: PriceDetail[],
  childrenAges: number[] = [],
  promotionDetails?: any[],
  taxationDetails?: any[],
  perDatePricingData?: any[],
  deductionDetails?: any[]
): RoomPayload[] => {
  const dates = generateDateRange(bookingData.checkInDate, bookingData.checkOutDate)
  const roomMap = new Map<number, SelectedRoom[]>()

  bookingData.rooms.forEach(room => {
    if (!roomMap.has(room.roomId)) {
      roomMap.set(room.roomId, [])
    }
    roomMap.get(room.roomId)!.push(room)
  })

  const roomsPayload: RoomPayload[] = []

  roomMap.forEach((selectedRooms, roomId) => {
    const roomDetails = hotelData?.rooms?.find((r: any) => r.id === roomId)
    if (!roomDetails) return

    const totalRoomCount = selectedRooms.reduce((sum, r) => sum + r.quantity, 0)
    const totalAdults = selectedRooms.reduce((sum, r) => sum + (r.adults * r.quantity), 0)

    roomsPayload.push({
      id: roomId,
      room_name: roomDetails.room_name || roomDetails.costume_room_name,
      room_type: roomDetails.room_type_details?.name || roomDetails.room_name,
      plans: buildRoomPlans(
        selectedRooms,
        dates,
        bookingData.children,
        childrenAges,
        roomPricing,
        promotionDetails,
        taxationDetails,
        perDatePricingData,
        deductionDetails
      ),
      opted_count: totalRoomCount,
      room_for_adult: totalAdults,
      extra_bed_type: roomDetails.extra_bed_type || '',
      no_of_beds: roomDetails.no_of_beds || 1,
      childage: childrenAges.join(',')
    })
  })

  return roomsPayload
}

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

  const promotionDetails = (bookingData as any).promotionDetails || []
  const taxationDetails = (bookingData as any).taxationDetails || []
  const perDatePricingData = (bookingData as any).perDatePricing || []
  const deductionDetails = (bookingData as any).deductionDetails || []

  const rooms = buildRoomsPayload(
    bookingData,
    hotelData,
    roomPricing,
    childrenAges,
    promotionDetails,
    taxationDetails,
    perDatePricingData,
    deductionDetails
  )
  
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
  
  const pricingSummary = (bookingData as any).pricingSummary
  const memberOnlyDiscount = pricingSummary?.memberOnlyDiscount || 0
  const couponDiscount = pricingSummary?.couponDiscount || 0
  
  const totalDiscountSum = totalRoomPromotionalDiscount + memberOnlyDiscount + couponDiscount
  
  const priceSum = bookingData.hotelPrice
  const childPriceSum = bookingData.childPrice
  const priceSumWithoutChildPrice = priceSum
  const discountSum = totalDiscountSum
  const gstSum = bookingData.tax
  const serviceCharge = bookingData.serviceCharge
  const totalWithoutServiceCharge = priceSum + childPriceSum + gstSum
  const total = totalWithoutServiceCharge + serviceCharge
  
  const locationParts = (bookingData.hotelLocation || '').split(',').map(s => s.trim())
  const city = (bookingData as any).cityName || locationParts[locationParts.length - 3] || ''
  const state = (bookingData as any).stateName || locationParts[locationParts.length - 2] || ''
  const country = (bookingData as any).countryName || locationParts[locationParts.length - 1] || ''
  
  const highlights = Array.from(
    new Set(
      bookingData.rooms.flatMap(room => room.planFeatures || [])
    )
  )

  const appliedCoupon = (bookingData as any).appliedCoupon || null
  const memberOnlyPromotion = (bookingData as any).memberOnlyPromotion || null
  
  const payload = {
    booking_id: bookingData.bookingId ? Number(bookingData.bookingId) : null,

    ...(razorpayData && {
      razorpay_payment_id: razorpayData.razorpay_payment_id,
      razorpay_order_id: razorpayData.razorpay_order_id,
      razorpay_signature: razorpayData.razorpay_signature
    }),
    
    price_sum: priceSum,
    discount_sum: totalDiscountSum,
    total_price_sum: totalWithoutServiceCharge,
    gst_sum: gstSum,
    
    rooms: rooms,
    roomsCount: bookingData.rooms.reduce((sum, r) => sum + r.quantity, 0),
    
    price: priceSum,
    tax: gstSum,
    discount: discountSum,
    book_price_sum: priceSum + childPriceSum,
    price_sum_without_child_price: priceSumWithoutChildPrice,
    child_price_sum: childPriceSum,
    total_without_service_charge: totalWithoutServiceCharge.toFixed(2),
    serviceCharge: serviceCharge,
    total: total.toFixed(2),
    
    coupon_code: appliedCoupon?.coupon_code || '',
    coupon_id: appliedCoupon?.id || null,
    member_only_promotion_id: memberOnlyPromotion?.id || null,
    
    highlights: highlights,
    
    fname: bookingData.firstName || '',
    lname: bookingData.lastName || '',
    email: bookingData.email || '',
    mobile: bookingData.mobileWithCountryCode || bookingData.mobile || bookingData.phone || '',
    message: (bookingData as any).notes || bookingData.specialRequests || '',
    
    start_date: format(new Date(bookingData.checkInDate), 'yyyy-MM-dd'),
    end_date: format(new Date(bookingData.checkOutDate), 'yyyy-MM-dd'),
    dates: dates,
    
    no_of_child: bookingData.children,
    no_of_adult: bookingData.adults,
    childInfo: childrenAges.join(','),
    total_rooms: bookingData.rooms.reduce((sum, r) => sum + r.quantity, 0),
    no_of_guests: bookingData.adults + bookingData.children,
    
    listingid: parseInt(bookingData.hotelId),
    
    houseNumber: bookingData.houseNumber || '',
    street: bookingData.street || '',
    city: city,
    state: state,
    country: country,
    
    gst: bookingData.hasGST || false,
    gst_number: bookingData.gstNumber || '',
    gst_company_name: bookingData.companyName || '',
    gst_phone_number: bookingData.gstPhoneWithCountryCode || bookingData.gstPhone || '',
    gst_address: bookingData.gstAddress || '',
    
    cancellation_policy: bookingData.cancellationPolicyId || null,
    
    booking_type: 'b2c'
  }
  
  return payload
}
