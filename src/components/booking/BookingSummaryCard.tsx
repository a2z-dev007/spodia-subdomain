"use client"

import { useState, useMemo } from "react"
import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Users, Star } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import PriceBreakdownModal from "./PriceBreakdownModal"
import CouponSelector from "./CouponSelector"
import MemberOnlyPromotion from "./MemberOnlyPromotion"

import { Lightbox, useLightbox } from "@/components/ui/Lightbox"
import { formatDate } from "@/utils/roomPromotionalPricing"

const BookingSummaryCard = () => {
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [showBreakdown, setShowBreakdown] = useState(false)
  const { 
    isOpen: isLightboxOpen, 
    images: lightboxImages, 
    currentIndex: lightboxIndex, 
    openLightbox, 
    closeLightbox, 
    setIndex: setLightboxIndex 
  } = useLightbox()

  // Use pricing summary from Redux (calculated by modal)
  const pricingSummary = bookingFormData.pricingSummary || {
    subtotal: 0,
    totalTax: 0,
    totalDeductions: 0,
    total: 0,
    taxDetails: [],
    totalPromotionalDiscount: 0
  }

  const { subtotal, total, taxDetails, totalPromotionalDiscount, couponDiscount, memberOnlyDiscount } = pricingSummary
  const appliedCoupon = bookingFormData.appliedCoupon
  const memberOnlyPromotion = bookingFormData.memberOnlyPromotion

  // Calculate original hotel price (before promotional discount)
  const originalHotelPrice = subtotal + (totalPromotionalDiscount || 0)

  // Calculate nights from check-in and check-out dates
  const nights = useMemo(() => {
    if (bookingFormData.checkInDate && bookingFormData.checkOutDate) {
      const checkIn = new Date(bookingFormData.checkInDate)
      const checkOut = new Date(bookingFormData.checkOutDate)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays || 1
    }
    return 1
  }, [bookingFormData.checkInDate, bookingFormData.checkOutDate])

  // Use calculated values from shared hook
  const bookingData = {
    hotelName: bookingFormData.hotelName || "--",
    location: bookingFormData.hotelLocation || "--",
    images: bookingFormData.hotelImages && bookingFormData.hotelImages.length > 0
      ? bookingFormData.hotelImages
      : [
        "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      ],
    rating: (bookingFormData as any).hotelRating || 0,
    checkIn: bookingFormData.checkInDate || "",
    checkOut: bookingFormData.checkOutDate || "",
    adults: bookingFormData.adults || 0,
    children: bookingFormData.children || 0,
    nights: nights,
    hotelPrice: subtotal,
    childPrice: 0,
    dayBooking: subtotal,
    discount: bookingFormData.discount || 0,
    totalPayment: total,
  }

  return (
    <>
      <Card className="sticky top-24">
        <CardContent className="p-6">
          {/* Hotel Image with "See More" Button */}
          <div className="relative mb-6 group">
            <div 
              className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden cursor-pointer shadow-md transform transition-transform duration-300 group-hover:scale-[1.01]"
              onClick={() => openLightbox(bookingData.images, 0)}
            >
              <Image
                src={bookingData.images[0]}
                alt={bookingData.hotelName}
                fill
                className="object-cover"
                priority
              />
              
              {/* Overlay with See More button */}
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
              
              {bookingData.images.length > 1 && (
                <div className="absolute bottom-4 right-4 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openLightbox(bookingData.images, 0)
                    }}
                    className="bg-white/50 backdrop-blur-md text-gray-900 px-4 py-1 rounded-xl text-xs sm:text-sm font-bold shadow-xl border border-white/50 hover:bg-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <span>{bookingData.images.length}+ See More</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hotel Name & Rating */}
          <div className="flex flex-col gap-1 mb-2">
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{bookingData.hotelName}</h3>
            <div className="flex items-center gap-0.5 my-2">

               {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${i < parseInt(bookingData?.rating || "0") ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-gray-500 mb-6">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
            <span className="line-clamp-2 pt-1 font-medium">{bookingData.location}</span>
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            {/* Check-in/out */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-700">
                    {formatDate(bookingData.checkIn)} → {formatDate(bookingData.checkOut)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Guests */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Guests</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-700">
                    {bookingData.adults} Adult, {bookingData.children} Child
                  </span>
                </div>
              </div>

              {/* Nights */}
              <div className="bg-gray-50 px-4 py-2 rounded-xl text-center">
                <span className="text-lg font-black text-gray-900 block leading-none">{bookingData.nights}</span>
                <span className="text-[9px] uppercase font-black text-gray-400 tracking-tighter">Day Booking</span>
              </div>
            </div>
          </div>

          {/* Price Summary - Matching Modal Format */}
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
            {/* Hotel Price (Original) - Only show when there's a promotional discount */}
            {totalPromotionalDiscount != null && totalPromotionalDiscount !== undefined && Number(totalPromotionalDiscount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Hotel Price</span>
                <span className="font-bold text-gray-900">₹{Math.round(originalHotelPrice).toLocaleString()}</span>
              </div>
            )}

            {/* Promotional Discount - Only show if greater than 0 */}
            {totalPromotionalDiscount != null && totalPromotionalDiscount !== undefined && Number(totalPromotionalDiscount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-semibold">Promotional Discount</span>
                <span className="font-semibold text-green-600">-₹{Math.round(totalPromotionalDiscount).toLocaleString()}</span>
              </div>
            )}

            {/* Subtotal - Only show if different from Hotel Price */}
            {(totalPromotionalDiscount != null && Number(totalPromotionalDiscount) > 0) ? (
              <div className="flex justify-between text-sm pt-1.5 border-t border-gray-100">
                <span className="text-gray-500 font-medium">Subtotal (All Rooms)</span>
                <span className="font-bold text-gray-900">₹{Math.round(subtotal).toLocaleString()}</span>
              </div>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Hotel Price</span>
                <span className="font-bold text-gray-900">₹{Math.round(subtotal).toLocaleString()}</span>
              </div>
            )}

            {/* Tax Details Section */}
            {taxDetails.length > 0 && (
              <div className="pt-2 border-t border-dashed border-gray-200">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 tracking-widest">Taxes & Charges</p>
                {taxDetails.map((tax, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 font-medium italic">
                      {tax?.name}{" "}
                      {tax?.name?.toLowerCase() !== "gst" && (
                        <span className="text-gray-400 not-italic">({tax?.rate}%)</span>
                      )}
                    </span>
                    <span className="font-bold text-gray-900">₹{Math.round(tax?.amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Member-Only Discount */}
            {memberOnlyDiscount && memberOnlyDiscount > 0 && (
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-[#FF9530] font-bold">
                  Member-Only Discount
                </span>
                <span className="font-bold text-[#FF9530]">-₹{Math.round(memberOnlyDiscount).toLocaleString()}</span>
              </div>
            )}

            {/* Coupon Discount */}
            {couponDiscount && couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-blue-500 font-bold">
                  Coupon Discount ({appliedCoupon?.coupon_code})
                </span>
                <span className="font-bold text-blue-500">-₹{Math.round(couponDiscount).toLocaleString()}</span>
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t-2 border-gray-900">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xl font-black text-gray-900">Total</span>
                <span className="text-2xl font-black text-orange-600 tracking-tighter">
                  ₹{Math.round(total).toLocaleString()}
                </span>
              </div>
              
              <Button
                variant="link"
                className="text-blue-500 p-0 h-auto font-bold text-[10px] underline decoration-blue-200 underline-offset-4 w-full"
                onClick={() => setShowBreakdown(true)}
              >
                View Detailed Splitup
              </Button>
            </div>
          </div>

          {/* Member-Only Promotion */}
          <div className="mt-6">
            <MemberOnlyPromotion />
          </div>

          {/* Coupon Selector */}
          <div className="mt-4">
            <CouponSelector />
          </div>

          {/* Payment Protection */}
          <div className="bg-gray-50 rounded-2xl p-5 mt-6 border border-gray-100">
            <h4 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
              <div className="w-2 h-4 bg-green-500 rounded-full" />
              Payment Protection
            </h4>
            <ul className="space-y-3">
              {[
                "Comprehensive Payment Protection",
                "Emergency Booking Assistance",
                "24hr Customer Service"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown Modal */}
      <PriceBreakdownModal
        isOpen={showBreakdown}
        onClose={() => setShowBreakdown(false)}
        bookingData={bookingData}
      />

      {/* Lightbox for Gallery */}
      <Lightbox
        images={lightboxImages}
        isOpen={isLightboxOpen}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
        altText={bookingData.hotelName}
      />
    </>
  )
}

export default BookingSummaryCard
