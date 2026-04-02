"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData } from "@/lib/features/booking/bookingSlice"
import { getMemberOnlyPromotions } from "@/services/api"
import { Star, Gift, CheckCircle, Info } from "lucide-react"
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

const MemberOnlyPromotion = () => {
  const dispatch = useAppDispatch()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [promotion, setPromotion] = useState<MemberPromotion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const memberOnlyPromotion = bookingFormData.memberOnlyPromotion
  const pricingSummary = bookingFormData.pricingSummary

  // Fetch member-only promotion when component mounts
  useEffect(() => {
    const fetchMemberPromotion = async () => {
      if (typeof window === 'undefined') return
      
      const accessToken = localStorage.getItem("spodia_access_token")
      if (!accessToken || !bookingFormData.hotelId) return

      setIsLoading(true)
      try {
        const response = await getMemberOnlyPromotions(bookingFormData.hotelId)
        const data = response.data
        
        if (data.status === "success" && data.records && data.records.length > 0) {
          const memberPromo = data.records[0] // Only one item in array
          setPromotion(memberPromo)
          
          // Automatically validate and apply if eligible
          const validation = validatePromotion(memberPromo)
          if (validation.isValid) {
            applyPromotion(memberPromo, true) // true = silent application
          }
        }
      } catch (error) {
        console.error("Failed to fetch member-only promotion:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemberPromotion()
  }, [bookingFormData.hotelId])

  const validatePromotion = (promo: MemberPromotion): { isValid: boolean; message: string } => {
    const selectedRooms = bookingFormData.rooms || []

    // Check if promotion applies to selected rooms and plans
    const promoRoomIds = promo.promotion_rooms.map(pr => pr.rooms)
    const hasMatchingRoom = selectedRooms.some((room: any) => {
      const roomMatches = promoRoomIds.includes(room.roomId)
      if (!roomMatches) return false

      // Check if plan matches
      const promotionRoom = promo.promotion_rooms.find(pr => pr.rooms === room.roomId)
      if (promotionRoom && room.planId) {
        return promotionRoom.plans.includes(room.planId)
      }
      return true
    })

    if (!hasMatchingRoom) {
      return {
        isValid: false,
        message: "Member promotion not applicable to selected rooms or plans"
      }
    }

    return { isValid: true, message: "Member-only promotion applied!" }
  }

  const calculateDiscount = (promo: MemberPromotion): number => {
    const subtotal = pricingSummary?.subtotal || 0
    
    if (promo.type_of_offer === "Percentage") {
      return (subtotal * promo.rate_or_percentage) / 100
    } else {
      return promo.rate_or_percentage
    }
  }

  const applyPromotion = (promo: MemberPromotion, silent: boolean = false) => {
    const validation = validatePromotion(promo)
    
    if (!validation.isValid) {
      if (!silent) {
        toast.error(validation.message)
      }
      return
    }

    const discountAmount = calculateDiscount(promo)
    
    // Calculate new total considering existing coupon discount
    let baseTotal = pricingSummary?.total || 0
    const existingMemberDiscount = pricingSummary?.memberOnlyDiscount || 0
    
    // Add back existing member discount to get base
    if (existingMemberDiscount > 0) {
      baseTotal = baseTotal + existingMemberDiscount
    }
    
    const newTotal = Math.max(0, baseTotal - discountAmount)

    // Update pricing summary with member-only discount
    const updatedPricingSummary = {
      subtotal: pricingSummary?.subtotal || 0,
      totalTax: pricingSummary?.totalTax || 0,
      totalDeductions: pricingSummary?.totalDeductions || 0,
      taxDetails: pricingSummary?.taxDetails || [],
      totalPromotionalDiscount: pricingSummary?.totalPromotionalDiscount || 0,
      couponDiscount: pricingSummary?.couponDiscount || 0,
      memberOnlyDiscount: discountAmount,
      total: newTotal
    }

    // Update booking form data
    dispatch(updateBookingFormData({
      memberOnlyPromotion: {
        id: promo.id,
        name: promo.name,
        type_of_offer: promo.type_of_offer,
        rate_or_percentage: promo.rate_or_percentage,
        discount_amount: discountAmount,
        promotion_amenities_details: promo.promotion_amenities_details,
        promotion_terms_conditions_details: promo.promotion_terms_conditions_details
      },
      pricingSummary: updatedPricingSummary
    }))

    if (!silent) {
      toast.success(validation.message)
    }
  }

  // Don't show if no access token (not logged in) or no promotion available
  if (typeof window === 'undefined') return null
  const accessToken = localStorage.getItem("spodia_access_token")
  if (!accessToken || !promotion) return null

  return (
    <div className="border-t pt-4 mt-4">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-purple-600 fill-purple-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-purple-900">Member-Only Offer</h4>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            
            <p className="text-xs text-purple-700 mb-2">{promotion.name}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">
                {promotion.type_of_offer === "Percentage" 
                  ? `${promotion.rate_or_percentage}% OFF` 
                  : `₹${promotion.rate_or_percentage} OFF`}
              </span>
            </div>

            {memberOnlyPromotion && (
              <div className="bg-white/60 rounded-lg p-2 mb-3">
                <p className="text-xs font-semibold text-green-700">
                  You're saving ₹{Math.round(memberOnlyPromotion.discount_amount).toLocaleString()}
                </p>
              </div>
            )}

            {/* Benefits Section */}
            {/* {(promotion.promotion_amenities_details.length > 0 || 
              promotion.promotion_terms_conditions_details.length > 0) && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                <Info className="w-3 h-3" />
                {showDetails ? "Hide" : "View"} Benefits & Terms
              </button>
            )} */}

            
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberOnlyPromotion
