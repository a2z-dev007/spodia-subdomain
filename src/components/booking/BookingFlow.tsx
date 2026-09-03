"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData } from "@/lib/features/booking/bookingSlice"
import SingleStepBookingForm from "./steps/SingleStepBookingForm"
import BookingSummaryCard from "./BookingSummaryCard"
import BookingHotelDetailsCard from "./BookingHotelDetailsCard"
import LoginModal from "@/components/auth/LoginModal"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import {
  getSelectedRooms,
  getBookingSummary,
  getPropertyById,
  getRoomInventoryAndPricing,
  updateBookingAndApplyMemberOnlyPromotion,
  applyBookingCoupon,
  getMemberOnlyPromotions,
} from "@/services/api"
import { mapBookingSummaryToPricing } from "@/utils/mapBookingSummaryToPricing"
import { format } from "date-fns"

type HydratePayload = Record<string, unknown>

const hydratePromises = new Map<string, Promise<HydratePayload>>()
const authActionLocks = new Set<string>()

function mapBackendSelectionToSelectedRooms(records: any[], hotelData: any, pricing: any[]) {
  const groupedRecords: any[] = []
  records.forEach((rec) => {
    const match = groupedRecords.find(
      (g) => g.room_id === rec.room_id && g.plan_id === rec.plan_id && g.adults === rec.adults
    )
    if (match) {
      match.qty += rec.qty
    } else {
      groupedRecords.push({ ...rec })
    }
  })

  return groupedRecords.map((rec) => {
    const room = hotelData?.rooms?.find((r: any) => r.id === rec.room_id)
    const plan = room?.plans?.find((p: any) => p.plan === rec.plan_id || p.id === rec.plan_id)

    const pricingEntry = pricing?.find((p: any) => p.room === rec.room_id && p.plan === rec.plan_id)
    let pricePerNight = 0
    if (pricingEntry) {
      pricePerNight = rec.adults === 1 ? (pricingEntry.sbr_rate || 0) : (pricingEntry.dbr_rate || pricingEntry.sbr_rate || 0)
    } else {
      pricePerNight = Number(plan?.price) || 0
    }

    return {
      roomId: rec.room_id,
      roomName: room?.room_name || room?.costume_room_name || `Room ${rec.room_id}`,
      planName: plan?.plan_name || "CP",
      planId: rec.plan_id,
      planFeatures: plan?.plan_items?.map((item: any) => item.name) || [],
      quantity: rec.qty,
      pricePerNight: pricePerNight,
      childPrice: pricingEntry?.child_6_10_rate || 0,
      isExtraBed: rec.adults > 2,
      adults: rec.adults,
    }
  })
}

async function fetchBookingHydratePayload(params: {
  bookingId: string
  hotelId: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  childrenAges: number[]
}): Promise<HydratePayload> {
  const { bookingId, hotelId, checkIn, checkOut, adults, children, childrenAges } = params

  const existing = hydratePromises.get(bookingId)
  if (existing) return existing

  const promise = (async () => {
    const hotelResponse = await getPropertyById(hotelId)
    const hotel = hotelResponse?.data?.listing_detail

    if (!hotel) {
      throw new Error("Hotel not found")
    }

    const pricingResponse = await getRoomInventoryAndPricing({
      propertyId: hotelId,
      customerType: null,
      startDate: checkIn,
      endDate: checkOut,
    })
    const perDatePricing = pricingResponse?.data?.price_detail || []
    const promotionDetails = pricingResponse?.data?.promotion_detail || []

    const selectedRoomsResponse = await getSelectedRooms(bookingId)
    const backendRooms = selectedRoomsResponse.data?.records || []

    const summaryResponse = await getBookingSummary(bookingId)
    const summaryRecords = summaryResponse.data?.records

    const mappedRooms = mapBackendSelectionToSelectedRooms(backendRooms, hotel, perDatePricing)

    let parsedCheckInDate = ""
    let parsedCheckOutDate = ""
    try {
      parsedCheckInDate = format(new Date(checkIn), "MM/dd/yyyy")
      parsedCheckOutDate = format(new Date(checkOut), "MM/dd/yyyy")
    } catch {
      const [yi, mi, di] = checkIn.split("-").map(Number)
      parsedCheckInDate = `${mi.toString().padStart(2, "0")}/${di.toString().padStart(2, "0")}/${yi}`
      const [yo, mo, do_] = checkOut.split("-").map(Number)
      parsedCheckOutDate = `${mo.toString().padStart(2, "0")}/${do_?.toString().padStart(2, "0")}/${yo}`
    }

    const hotelImages = hotel.listing_images?.map((img: any) => img.image) || []
    const pricingSummary = summaryRecords ? mapBookingSummaryToPricing(summaryRecords) : undefined

    return {
      bookingId,
      hotelId,
      hotelName: hotel.name,
      apiSummary: summaryRecords,
      hotelLocation: `${hotel.address}, ${hotel.city_name}, ${hotel.state_name}, ${hotel.country_name}`,
      hotelImages,
      hotelRating: parseInt(hotel.star_category || "0"),
      hotelCheckInTime: hotel.check_in_time || hotel.checkin_time || hotel.check_in || null,
      hotelCheckOutTime: hotel.check_out_time || hotel.checkout_time || hotel.check_out || null,
      checkInDate: parsedCheckInDate,
      checkOutDate: parsedCheckOutDate,
      adults,
      children,
      childrenAges,
      rooms: mappedRooms,
      pricingSummary,
      perDatePricing: perDatePricing as any,
      promotionDetails,
      cancellationPolicies: hotel.cancellation_policies || [],
      initialSearchAdults: adults,
      initialSearchChildren: children,
      initialSearchRooms: mappedRooms.reduce((sum, r) => sum + r.quantity, 0),
      initialSearchChildrenAges: childrenAges,
    }
  })()

  hydratePromises.set(bookingId, promise)

  try {
    return await promise
  } catch (error) {
    hydratePromises.delete(bookingId)
    throw error
  }
}

const BookingFlow = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const accessToken = useAppSelector((state) => state?.auth?.accessToken ?? null)
  const prevAccessTokenRef = useRef<string | null>(accessToken)
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginDefaultEmail, setLoginDefaultEmail] = useState("")

  const openLoginModal = (email?: string) => {
    setLoginDefaultEmail(email || bookingFormData.email || user?.email || "")
    setShowLoginModal(true)
  }

  const hasBookingData = bookingFormData &&
    bookingFormData.hotelId &&
    bookingFormData.hotelName &&
    bookingFormData.rooms &&
    bookingFormData.rooms.length > 0

  const [isHydrating, setIsHydrating] = useState(() => {
    const bookingId = searchParams.get("booking_id")
    return !!bookingId
  })

  const bookingIdParam = searchParams.get("booking_id")
  const hotelIdParam = searchParams.get("hotelId")
  const checkInParam = searchParams.get("checkIn")
  const checkOutParam = searchParams.get("checkOut")
  const adultsParam = searchParams.get("adults")
  const childrenParam = searchParams.get("children")
  const childInfoParam = searchParams.get("childInfo")

  useEffect(() => {
    let cancelled = false

    const hydrateState = async () => {
      const bookingId = bookingIdParam
      const hotelId = hotelIdParam
      const checkIn = checkInParam
      const checkOut = checkOutParam
      const adults = Number(adultsParam || 1)
      const children = Number(childrenParam || 0)
      const childInfo = childInfoParam || ""
      const childrenAges = childInfo ? childInfo.split(",").map(Number) : []

      if (!bookingId || !hotelId || !checkIn || !checkOut) {
        setIsHydrating(false)
        return
      }

      try {
        const reduxUpdatePayload = await fetchBookingHydratePayload({
          bookingId,
          hotelId,
          checkIn,
          checkOut,
          adults,
          children,
          childrenAges,
        })

        if (cancelled) return
        dispatch(updateBookingFormData(reduxUpdatePayload))
      } catch (error) {
        if (!cancelled) {
          console.error("Error during booking page state hydration:", error)
        }
      } finally {
        if (!cancelled) {
          setIsHydrating(false)
        }
      }
    }

    if (isHydrating) {
      hydrateState()
    }

    return () => {
      cancelled = true
    }
  }, [
    isHydrating,
    bookingIdParam,
    hotelIdParam,
    checkInParam,
    checkOutParam,
    adultsParam,
    childrenParam,
    childInfoParam,
    dispatch,
  ])

  useEffect(() => {
    if (!isHydrating && !hasBookingData) {
      router.back()
    }
  }, [isHydrating, hasBookingData, router])

  const handleLoginOnBooking = async (bookingId: string | number) => {
    const lockKey = `login_${bookingId}`
    if (authActionLocks.has(lockKey)) return
    authActionLocks.add(lockKey)
    authActionLocks.delete(`logout_${bookingId}`)

    try {
      if (bookingFormData.hotelId) {
        try {
          const promoRes = await getMemberOnlyPromotions(bookingFormData.hotelId)
          if (promoRes?.data?.status === "success" && promoRes.data?.records?.length > 0) {
            await updateBookingAndApplyMemberOnlyPromotion(bookingId)
          }
        } catch (err) {
          console.error("Failed to check/apply member promotion on login:", err)
        }
      }

      const summaryResponse = await getBookingSummary(bookingId)
      const summaryRecords = summaryResponse.data?.records

      if (summaryRecords) {
        const pricing = mapBookingSummaryToPricing(summaryRecords)
        const updatedCouponDiscount = Number(summaryRecords.coupon_promotion || 0)
        const updatedCouponId = summaryRecords.coupon_id

        let newAppliedCoupon = bookingFormData.appliedCoupon || null
        if (updatedCouponDiscount > 0 && updatedCouponId && bookingFormData.appliedCoupon) {
          newAppliedCoupon = {
            ...bookingFormData.appliedCoupon,
            discount_amount: updatedCouponDiscount,
          }
        }

        dispatch(
          updateBookingFormData({
            pricingSummary: pricing,
            apiSummary: summaryRecords,
            ...(newAppliedCoupon ? { appliedCoupon: newAppliedCoupon } : {}),
          })
        )
      }
    } catch (error) {
      console.error("Failed to update booking summary on user login:", error)
    }
  }

  const handleLogoutOnBooking = async (activeBookingId: string | number) => {
    const lockKey = `logout_${activeBookingId}`
    if (authActionLocks.has(lockKey)) return
    authActionLocks.add(lockKey)
    authActionLocks.delete(`login_${activeBookingId}`)

    try {
      await updateBookingAndApplyMemberOnlyPromotion(activeBookingId, true)
      await applyBookingCoupon(activeBookingId, null, true)

      const summaryResponse = await getBookingSummary(activeBookingId)
      const summaryRecords = summaryResponse.data?.records

      if (summaryRecords) {
        const pricing = mapBookingSummaryToPricing(summaryRecords)
        const updatedCouponDiscount = Number(summaryRecords.coupon_promotion || 0)
        const updatedCouponId = summaryRecords.coupon_id

        let newAppliedCoupon = null
        if (updatedCouponDiscount > 0 && updatedCouponId && bookingFormData.appliedCoupon) {
          newAppliedCoupon = {
            ...bookingFormData.appliedCoupon,
            discount_amount: updatedCouponDiscount,
          }
        }

        dispatch(
          updateBookingFormData({
            memberOnlyPromotion: null,
            appliedCoupon: newAppliedCoupon,
            pricingSummary: pricing,
            apiSummary: summaryRecords,
          })
        )
      }
    } catch (error) {
      console.error("Failed to update booking summary on user logout:", error)
    }
  }

  useEffect(() => {
    const wasLoggedIn = Boolean(prevAccessTokenRef.current)
    const isLoggedIn = Boolean(accessToken)
    const activeBookingId = bookingFormData.bookingId || bookingIdParam

    prevAccessTokenRef.current = accessToken

    if (!wasLoggedIn && isLoggedIn && activeBookingId) {
      handleLoginOnBooking(activeBookingId)
    } else if (wasLoggedIn && !isLoggedIn && activeBookingId) {
      handleLogoutOnBooking(activeBookingId)
    }
  }, [accessToken, bookingFormData.bookingId, bookingIdParam])

  if (isHydrating) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Restoring Your Booking...</h2>
          <p className="text-gray-600">Retrieving selection from the secure server.</p>
        </div>
      </div>
    )
  }

  if (!hasBookingData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirecting...</h2>
          <p className="text-gray-600">Taking you back to the previous page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 sm:py-6 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-2">
          <BookingHotelDetailsCard />
        </div>

        <div className="lg:col-span-1 lg:row-span-2 lg:sticky lg:top-24 lg:self-start lg:h-fit">
          <BookingSummaryCard onRequestLogin={() => openLoginModal()} />
        </div>

        <div className="lg:col-span-2">
          <SingleStepBookingForm onRequestLogin={openLoginModal} />
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          toast.success("Logged in successfully", {
            description: "You can now complete your booking.",
          })
          const activeBookingId = bookingFormData.bookingId || bookingIdParam
          if (activeBookingId) {
            handleLoginOnBooking(activeBookingId)
          }
        }}
        defaultEmail={loginDefaultEmail}
      />
    </div>
  )
}

export default BookingFlow
