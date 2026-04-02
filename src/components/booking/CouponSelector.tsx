"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData } from "@/lib/features/booking/bookingSlice"
import { getHotelOfferPromotions } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Tag, ChevronDown, X, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Coupon {
  id: number
  name: string
  coupon_code: string
  type_of_offer: "Percentage" | "Fixed"
  rate_or_percentage: number
  minimum_order_value: number
  expiry_date: string
  booking_start: string
  booking_end: string
  stay_start: string
  stay_end: string
  promotion_rooms: Array<{
    rooms: number
    room_name: string
    plans: number[]
  }>
}

const CouponSelector = () => {
  const dispatch = useAppDispatch()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const appliedCoupon = bookingFormData.appliedCoupon
  const pricingSummary = bookingFormData.pricingSummary

  // Fetch coupons when component mounts or when user logs in
  useEffect(() => {
    const fetchCoupons = async () => {
      if (typeof window === 'undefined') return
      
      const accessToken = localStorage.getItem("spodia_access_token")
      if (!accessToken || !bookingFormData.hotelId) return

      setIsLoading(true)
      try {
        const response = await getHotelOfferPromotions(bookingFormData.hotelId)
        const data = response.data
        
        if (data.status === "success" && data.records) {
          setCoupons(data.records)
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoupons()
  }, [bookingFormData.hotelId])

  const validateCoupon = (coupon: Coupon): { isValid: boolean; message: string } => {
    const subtotal = pricingSummary?.subtotal || 0
    const selectedRooms = bookingFormData.rooms || []

    // Check minimum order value
    if (subtotal < coupon.minimum_order_value) {
      return {
        isValid: false,
        message: `Minimum order value of ₹${coupon.minimum_order_value.toLocaleString()} required`
      }
    }

    // Check expiry date only
    const today = new Date().toISOString().split('T')[0]
    if (today > coupon.expiry_date) {
      return {
        isValid: false,
        message: "Coupon has expired"
      }
    }

    // Check if coupon applies to selected rooms and plans
    const couponRoomIds = coupon.promotion_rooms.map(pr => pr.rooms)
    const hasMatchingRoom = selectedRooms.some((room: any) => {
      const roomMatches = couponRoomIds.includes(room.roomId)
      if (!roomMatches) return false

      // Check if plan matches
      const promotionRoom = coupon.promotion_rooms.find(pr => pr.rooms === room.roomId)
      if (promotionRoom && room.planId) {
        return promotionRoom.plans.includes(room.planId)
      }
      return true
    })

    if (!hasMatchingRoom) {
      return {
        isValid: false,
        message: "Coupon not applicable to selected rooms or plans"
      }
    }

    return { isValid: true, message: "Coupon applied successfully!" }
  }

  const calculateDiscount = (coupon: Coupon): number => {
    const subtotal = pricingSummary?.subtotal || 0
    
    if (coupon.type_of_offer === "Percentage") {
      return (subtotal * coupon.rate_or_percentage) / 100
    } else {
      return coupon.rate_or_percentage
    }
  }

  const applyCoupon = (coupon: Coupon) => {
    const validation = validateCoupon(coupon)
    
    if (!validation.isValid) {
      toast.error(validation.message)
      return
    }

    const discountAmount = calculateDiscount(coupon)
    
    // If there's an existing coupon, remove its discount first
    let baseTotal = pricingSummary?.total || 0
    if (appliedCoupon && appliedCoupon.discount_amount) {
      baseTotal = baseTotal + appliedCoupon.discount_amount
    }
    
    const newTotal = Math.max(0, baseTotal - discountAmount)

    // Update pricing summary with coupon discount (keep member-only discount)
    const updatedPricingSummary = {
      subtotal: pricingSummary?.subtotal || 0,
      totalTax: pricingSummary?.totalTax || 0,
      totalDeductions: pricingSummary?.totalDeductions || 0,
      taxDetails: pricingSummary?.taxDetails || [],
      totalPromotionalDiscount: pricingSummary?.totalPromotionalDiscount || 0,
      memberOnlyDiscount: pricingSummary?.memberOnlyDiscount || 0,
      couponDiscount: discountAmount,
      total: newTotal
    }

    // Update booking form data
    dispatch(updateBookingFormData({
      appliedCoupon: {
        id: coupon.id,
        name: coupon.name,
        coupon_code: coupon.coupon_code,
        type_of_offer: coupon.type_of_offer,
        rate_or_percentage: coupon.rate_or_percentage,
        minimum_order_value: coupon.minimum_order_value,
        discount_amount: discountAmount
      },
      pricingSummary: updatedPricingSummary
    }))

    toast.success(validation.message)
    setIsOpen(false)
  }

  const removeCoupon = () => {
    if (!appliedCoupon || !pricingSummary) return

    const newTotal = pricingSummary.total + (appliedCoupon.discount_amount || 0)

    const updatedPricingSummary = {
      subtotal: pricingSummary.subtotal,
      totalTax: pricingSummary.totalTax,
      totalDeductions: pricingSummary.totalDeductions,
      taxDetails: pricingSummary.taxDetails,
      totalPromotionalDiscount: pricingSummary.totalPromotionalDiscount,
      memberOnlyDiscount: pricingSummary.memberOnlyDiscount || 0,
      total: newTotal
    }

    dispatch(updateBookingFormData({
      appliedCoupon: null,
      pricingSummary: updatedPricingSummary
    }))

    toast.info("Coupon removed")
  }

  // Don't show if no access token (not logged in)
  if (typeof window === 'undefined') return null
  const accessToken = localStorage.getItem("spodia_access_token")
  if (!accessToken) return null

  // Don't show if no coupons available and not loading
  if (!isLoading && coupons.length === 0 && !appliedCoupon) return null

  return (
    <div className="border-t pt-4 mt-4">
      {appliedCoupon ? (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-800">{appliedCoupon.coupon_code}</p>
                  <p className="text-xs text-green-600">
                    {appliedCoupon.type_of_offer === "Percentage" 
                      ? `${appliedCoupon.rate_or_percentage}% off` 
                      : `₹${appliedCoupon.rate_or_percentage} off`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
                className="h-8 w-8 p-0 text-green-700 hover:text-green-900 hover:bg-green-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-green-700 mt-2">
              You saved ₹{Math.round(appliedCoupon.discount_amount).toLocaleString()}
            </p>
          </div>
          
          {/* Change Coupon Button */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-center h-10 text-sm text-orange-600 border-orange-300 hover:border-orange-400 hover:bg-orange-50"
                disabled={isLoading}
              >
                Change Coupon
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start">
              {coupons.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No coupons available
                </div>
              ) : (
                coupons.map((coupon) => {
                  const validation = validateCoupon(coupon)
                  const isCurrentCoupon = appliedCoupon.id === coupon.id
                  return (
                    <DropdownMenuItem
                      key={coupon.id}
                      onClick={() => !isCurrentCoupon && validation.isValid && applyCoupon(coupon)}
                      disabled={!validation.isValid || isCurrentCoupon}
                      className="flex flex-col items-start p-3 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-semibold text-sm">
                          {coupon.coupon_code}
                          {isCurrentCoupon && <span className="ml-2 text-xs text-green-600">(Applied)</span>}
                        </span>
                        <span className="text-xs font-medium text-green-600">
                          {coupon.type_of_offer === "Percentage" 
                            ? `${coupon.rate_or_percentage}% OFF` 
                            : `₹${coupon.rate_or_percentage} OFF`}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{coupon.name}</p>
                      <p className="text-xs text-gray-500">
                        Min. order: ₹{coupon.minimum_order_value.toLocaleString()}
                      </p>
                      {!validation.isValid && (
                        <p className="text-xs text-red-500 mt-1">{validation.message}</p>
                      )}
                    </DropdownMenuItem>
                  )
                })
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-12 border-dashed border-2 border-orange-300 hover:border-orange-400 hover:bg-orange-50"
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700 font-medium">
                  {isLoading ? "Loading coupons..." : "Apply Coupon"}
                </span>
              </div>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-orange-600" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="start">
            {coupons.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No coupons available
              </div>
            ) : (
              coupons.map((coupon) => {
                const validation = validateCoupon(coupon)
                return (
                  <DropdownMenuItem
                    key={coupon.id}
                    onClick={() => validation.isValid && applyCoupon(coupon)}
                    disabled={!validation.isValid}
                    className="flex flex-col items-start p-3 cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-semibold text-sm">{coupon.coupon_code}</span>
                      <span className="text-xs font-medium text-green-600">
                        {coupon.type_of_offer === "Percentage" 
                          ? `${coupon.rate_or_percentage}% OFF` 
                          : `₹${coupon.rate_or_percentage} OFF`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{coupon.name}</p>
                    <p className="text-xs text-gray-500">
                      Min. order: ₹{coupon.minimum_order_value.toLocaleString()}
                    </p>
                    {!validation.isValid && (
                      <p className="text-xs text-red-500 mt-1">{validation.message}</p>
                    )}
                  </DropdownMenuItem>
                )
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default CouponSelector
