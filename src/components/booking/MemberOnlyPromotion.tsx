"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData } from "@/lib/features/booking/bookingSlice"
import { getMemberOnlyPromotions, updateBookingAndApplyMemberOnlyPromotion, getBookingSummary } from "@/services/api"
import { mapBookingSummaryToPricing } from "@/utils/mapBookingSummaryToPricing"
import { Star, Gift } from "lucide-react"
import { toast } from "sonner"

interface MemberPromotion {
  id: number
  name: string
  type_of_offer: "Percentage" | "Fixed"
  rate_or_percentage: number
  booking_start: string
  booking_end: string
  stay_start: string
  stay_end: string
  promotion_rooms: Array<{
    rooms: number
    room_name: string
    plans: number[]
  }>
  promotion_amenities_details: Array<{
    id: number
    name: string
  }>
  promotion_terms_conditions_details: Array<{
    id: number
    title: string
  }>
}

const memberPromoApplyLocks = new Set<string>()

const MemberOnlyPromotion = () => {
  const dispatch = useAppDispatch()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const accessToken = useAppSelector((state) => state?.auth?.accessToken ?? null)
  const [promotion, setPromotion] = useState<MemberPromotion | null>(null)

  const memberOnlyPromotion = bookingFormData.memberOnlyPromotion
  const hotelId = bookingFormData.hotelId
  const bookingId = bookingFormData.bookingId
  const rooms = bookingFormData.rooms || []

  const validatePromotion = (promo: MemberPromotion): { isValid: boolean; message: string } => {
    const promoRoomIds = promo.promotion_rooms.map((pr) => pr.rooms)
    const hasMatchingRoom = rooms.some((room: any) => {
      const roomMatches = promoRoomIds.includes(room.roomId)
      if (!roomMatches) return false

      const promotionRoom = promo.promotion_rooms.find((pr) => pr.rooms === room.roomId)
      if (promotionRoom && room.planId) {
        return promotionRoom.plans.includes(room.planId)
      }
      return true
    })

    if (!hasMatchingRoom) {
      return {
        isValid: false,
        message: "Member promotion not applicable to selected rooms or plans",
      }
    }

    return { isValid: true, message: "Member-only promotion applied!" }
  }

  const applyPromotionOnBackend = async (promo: MemberPromotion, applyBookingId: string | number) => {
    const lockKey = String(applyBookingId)

    try {
      await updateBookingAndApplyMemberOnlyPromotion(applyBookingId)
      const summaryResponse = await getBookingSummary(applyBookingId)
      const summaryRecords = summaryResponse.data?.records
      if (!summaryRecords) {
        memberPromoApplyLocks.delete(lockKey)
        return
      }

      const pricing = mapBookingSummaryToPricing(summaryRecords)
      const memberDiscount = Number(pricing.memberOnlyDiscount || 0)

      dispatch(
        updateBookingFormData({
          memberOnlyPromotion: {
            id: promo.id,
            name: promo.name,
            type_of_offer: promo.type_of_offer,
            rate_or_percentage: promo.rate_or_percentage,
            discount_amount: memberDiscount,
            promotion_amenities_details: promo.promotion_amenities_details,
            promotion_terms_conditions_details: promo.promotion_terms_conditions_details,
          },
          pricingSummary: pricing,
          apiSummary: summaryRecords,
        })
      )
    } catch (error) {
      memberPromoApplyLocks.delete(lockKey)
      console.error("Failed to apply member-only promotion on backend:", error)
    }
  }

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!accessToken || !hotelId) {
        setPromotion(null)
        return
      }

      try {
        const response = await getMemberOnlyPromotions(hotelId)
        if (cancelled) return

        const data = response.data
        if (data.status !== "success" || !data.records?.length) {
          setPromotion(null)
          return
        }

        const memberPromo = data.records[0] as MemberPromotion
        setPromotion(memberPromo)

        if (!bookingId) return
        if (bookingFormData.memberOnlyPromotion) return

        const lockKey = String(bookingId)
        if (memberPromoApplyLocks.has(lockKey)) return

        const validation = validatePromotion(memberPromo)
        if (!validation.isValid) return

        memberPromoApplyLocks.add(lockKey)
        await applyPromotionOnBackend(memberPromo, bookingId)
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch member-only promotion:", error)
          setPromotion(null)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [hotelId, bookingId, accessToken, bookingFormData.memberOnlyPromotion])

  if (!accessToken || !promotion) return null

  return (
    <div className="border border-purple-100 mt-4 rounded-xl p-5 bg-gradient-to-r from-purple-50/40 to-pink-50/40 space-y-4">
      <div className="flex flex-col gap-2 w-full">
        <h4 className="w-full font-extrabold text-purple-900 text-sm tracking-wide uppercase flex items-center gap-1.5">
          <Star className="w-4 h-4 text-purple-600 fill-purple-500 shrink-0" />
          <span className="min-w-0">Member-Only Offer</span>
        </h4>
        {memberOnlyPromotion && (
          <span className="w-fit text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            Applied Automatically
          </span>
        )}
      </div>

      <div className="relative flex items-start gap-3 p-4 border border-purple-200/60 rounded-xl bg-white/85 shadow-sm">
        <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
          <Gift className="w-4.5 h-4.5 text-purple-600" />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm font-extrabold text-purple-955 leading-snug">{promotion.name}</p>
          <div className="flex gap-2.5 items-center mt-1.5 text-[10px] text-purple-700 font-bold uppercase tracking-wider">
            <span className="text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.2 rounded">
              {promotion.type_of_offer === "Percentage"
                ? `${promotion.rate_or_percentage}% OFF`
                : `₹${promotion.rate_or_percentage} OFF`}
            </span>
          </div>
          {memberOnlyPromotion && (
            <p className="text-xs font-bold text-emerald-600 mt-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              You save ₹{Math.round(memberOnlyPromotion.discount_amount).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberOnlyPromotion
