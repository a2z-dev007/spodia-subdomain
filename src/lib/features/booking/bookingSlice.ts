import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { TaxationDetail, DeductionDetail } from "@/utils/taxCalculation"

export interface Booking {
  id: string
  hotelId: string
  hotelName: string
  roomType: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "confirmed" | "pending" | "cancelled"
  guestName: string
  guestEmail: string
  guestPhone: string
  createdAt: string
}

export interface PriceDetail {
  room: number
  plan: number
  sbr_rate: number
  dbr_rate: number
  extra_bed_rate: number
  child_2_5_rate: number
  child_6_10_rate: number
  season_start: string
  season_end: string | null
}

export interface TaxDetail {
  name: string
  rate: number
  amount: number
}

export interface PricingSummary {
  subtotal: number
  totalTax: number
  totalDeductions: number
  total: number
  taxDetails: TaxDetail[]
  totalPromotionalDiscount?: number
  couponDiscount?: number
  memberOnlyDiscount?: number
}

export interface AppliedCoupon {
  id: number
  name: string
  coupon_code: string
  type_of_offer: "Percentage" | "Fixed"
  rate_or_percentage: number
  minimum_order_value: number
  discount_amount: number
}

export interface MemberOnlyPromotion {
  id: number
  name: string
  type_of_offer: "Percentage" | "Fixed"
  rate_or_percentage: number
  discount_amount: number
  promotion_amenities_details: Array<{
    id: number
    name: string
  }>
  promotion_terms_conditions_details: Array<{
    id: number
    title: string
  }>
}

export interface BookingFormData {
  // Step 1: Guest Information
  firstName: string
  lastName: string
  email: string
  mobile: string
  phone?: string
  notes: string
  specialRequests?: string
  
  // Step 2: Review & Policies
  agreeToTerms: boolean
  agreeToBookingTerms: boolean
  
  // Step 3: Payment Information
  houseNumber: string
  street: string
  countryId: string
  stateId: string
  cityId: string
  hasGST: boolean
  gstNumber?: string
  companyName?: string
  gstPhone?: string
  gstAddress?: string
  
  // Hotel & Booking Details
  hotelId?: string
  hotelName?: string
  hotelLocation?: string
  hotelImages?: string[]
  checkInDate?: string
  checkOutDate?: string
  adults?: number
  children?: number
  childrenAges?: number[] // Add children ages array
  rooms?: any[]
  cancellationPolicies?: any[] // Cancellation policies from hotel
  cancellationPolicyId?: number | null // Selected cancellation policy ID
  totalPrice?: number
  discount?: number
  tax?: number
  serviceCharge?: number
  finalPrice?: number
  hotelPrice?: number
  childPrice?: number
  hotelRating?: number
  originalHotelPrice?: number
  discountPercentage?: number
  taxationDetails?: TaxationDetail[]
  deductionDetails?: DeductionDetail[]
  perDatePricing?: PriceDetail[] // Per-date pricing from API
  promotionDetails?: any[] // Promotion details from API
  pricingSummary?: PricingSummary // Calculated pricing summary from modal
  appliedCoupon?: AppliedCoupon | null // Applied coupon details
  memberOnlyPromotion?: MemberOnlyPromotion | null // Applied member-only promotion
  
  // Initial Search Parameters (for validation)
  initialSearchAdults?: number
  initialSearchChildren?: number
  initialSearchRooms?: number
  initialSearchChildrenAges?: number[]
}

interface BookingState {
  bookings: Booking[]
  currentBooking: Partial<Booking> | null
  bookingFormData: BookingFormData
  currentStep: number
  isLoading: boolean
  error: string | null
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  bookingFormData: {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    notes: "",
    agreeToTerms: false,
    agreeToBookingTerms: false,
    houseNumber: "",
    street: "",
    countryId: "",
    stateId: "",
    cityId: "",
    hasGST: false,
  },
  currentStep: 1,
  isLoading: false,
  error: null,
}

// Async thunk for creating a booking
export const createBooking = createAsyncThunk<Booking, Partial<Booking>, { rejectValue: string }>(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Random failure for testing (10% chance)
      if (Math.random() < 0.1) {
        return rejectWithValue("Payment failed. Please try again.")
      }

      const booking: Booking = {
        id: `booking_${Date.now()}`,
        hotelId: bookingData.hotelId || "",
        hotelName: bookingData.hotelName || "",
        roomType: bookingData.roomType || "",
        checkIn: bookingData.checkIn || "",
        checkOut: bookingData.checkOut || "",
        guests: bookingData.guests || 1,
        totalPrice: bookingData.totalPrice || 0,
        status: "confirmed",
        guestName: bookingData.guestName || "",
        guestEmail: bookingData.guestEmail || "",
        guestPhone: bookingData.guestPhone || "",
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        const existingBookings = JSON.parse(localStorage.getItem("spodia_bookings") || "[]")
        existingBookings.push(booking)
        localStorage.setItem("spodia_bookings", JSON.stringify(existingBookings))
      }

      return booking
    } catch (error) {
      return rejectWithValue("Booking failed. Please try again.")
    }
  },
)

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Partial<Booking> | null>) => {
      state.currentBooking = action.payload
    },
    updateCurrentBooking: (state, action: PayloadAction<Partial<Booking>>) => {
      if (state.currentBooking) {
        state.currentBooking = { ...state.currentBooking, ...action.payload }
      }
    },
    updateBookingFormData: (state, action: PayloadAction<Partial<BookingFormData>>) => {
      state.bookingFormData = { ...state.bookingFormData, ...action.payload }
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    nextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    resetBookingForm: (state) => {
      state.bookingFormData = initialState.bookingFormData
      state.currentStep = 1
      state.error = null
    },
    loadBookings: (state) => {
      if (typeof window !== "undefined") {
        const savedBookings = localStorage.getItem("spodia_bookings")
        if (savedBookings) {
          state.bookings = JSON.parse(savedBookings)
        }
      }
    },
    cancelBooking: (state, action: PayloadAction<string>) => {
      const booking = state.bookings.find((b) => b.id === action.payload)
      if (booking) {
        booking.status = "cancelled"
        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("spodia_bookings", JSON.stringify(state.bookings))
        }
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false
        state.bookings.push(action.payload)
        state.currentBooking = null
        state.bookingFormData = initialState.bookingFormData
        state.currentStep = 1
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Booking failed"
      }),
})

export const { 
  setCurrentBooking, 
  updateCurrentBooking, 
  updateBookingFormData,
  setCurrentStep,
  nextStep,
  previousStep,
  resetBookingForm,
  loadBookings, 
  cancelBooking, 
  clearError 
} = bookingSlice.actions
export default bookingSlice.reducer
