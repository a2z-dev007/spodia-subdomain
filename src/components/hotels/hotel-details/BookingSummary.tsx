"use client"

import React, { useState, useEffect } from 'react';
import { X, Check, Users, Calendar } from 'lucide-react';
import { calculateFinalAmount, TaxationDetail, DeductionDetail } from '@/utils/taxCalculation';
import { useAppSelector } from '@/lib/hooks';

interface SelectedRoom {
  roomId: number;
  roomName: string;
  planName: string;
  planFeatures: string[];
  quantity: number;
  pricePerNight: number;
  // originalPrice?: number; // COMMENTED: Original price before discount - not using fake prices
  // discountPercentage?: number; // COMMENTED: Discount percentage - not calculating fake discounts
  childPrice?: number; // Child price separate from room price
  isExtraBed: boolean;
  adults: number;
}

interface BookingSummaryProps {
  selectedRooms: SelectedRoom[];
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  nights?: number;
  childrenCount?: number;
  roomPricing?: any[]; // Pricing data from API
  taxDetails?: Array<{ name: string; rate: number; amount: number }>; // Tax details from API
  apiCalculatedTotal?: number; // Total from API
  taxationDetails?: TaxationDetail[]; // Taxation details from hotel API
  deductionDetails?: DeductionDetail[]; // Deduction details from hotel API
  onRemoveRoom: (roomId: number, planName: string, isExtraBed: boolean, adults: number) => void;
  onBookNow: () => void;
}

export default function BookingSummary({
  selectedRooms,
  checkInDate,
  checkOutDate,
  nights = 1,
  childrenCount = 0,
  roomPricing = [],
  taxDetails: propTaxDetails,
  apiCalculatedTotal: propApiTotal,
  taxationDetails = [],
  deductionDetails = [],
  onRemoveRoom,
  onBookNow
}: BookingSummaryProps) {
  // Get pricing summary from Redux (set by PriceBreakdownModal)
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const pricingSummary = (bookingFormData as any).pricingSummary

  // State for tax details from API
  const [taxDetails, setTaxDetails] = useState<Array<{ name: string; rate: number; amount: number }>>(propTaxDetails || [])
  const [apiCalculatedTotal, setApiCalculatedTotal] = useState<number>(propApiTotal || 0)
  const [isLoadingTax, setIsLoadingTax] = useState(false)

  // Calculate totals - USE PRICES FROM SELECTEDROOMS (which already include promotions with blackout dates checked)

  // Step 1 & 2: Calculate hotel price - USE room.pricePerNight which already has promotions applied
  let hotelPrice = 0;

  selectedRooms.forEach((room) => {
    // room.pricePerNight already contains the promotional/discounted price with blackout dates checked
    const roomTotal = room.pricePerNight * room.quantity * nights
    hotelPrice += roomTotal
  });

  // Step 5: Calculate total child price separately
  let totalChildPrice = 0;
  selectedRooms.forEach((room, roomIndex) => {
    if (roomIndex < childrenCount && room.childPrice) {
      // room.childPrice already contains the correct child rate
      const childTotal = room.childPrice * room.quantity * nights
      totalChildPrice += childTotal
    }
  });

  // Step 6: Calculate subtotal (hotel + child)
  const subtotal = hotelPrice + totalChildPrice;

  // Calculate TAXES per room (using prices from selectedRooms which already include promotions with blackout dates checked)
  const roomsWithTax = selectedRooms.map((room) => {
    // Calculate room subtotal using stored prices (which already include promotions with blackout dates checked)
    const roomRate = room.pricePerNight
    const roomIndex = selectedRooms.indexOf(room)
    const hasChildInRoom = roomIndex < childrenCount && room.childPrice
    const childRatePerNight = hasChildInRoom ? (room.childPrice || 0) : 0
    
    const roomTotal = roomRate * room.quantity * nights
    const childTotal = childRatePerNight * room.quantity * nights
    
    const roomSubtotal = roomTotal + childTotal
    
    // Calculate tax on the subtotal
    const roomTaxResult = calculateFinalAmount(roomTotal, taxationDetails, [])
    const childTaxResult = childTotal > 0 ? calculateFinalAmount(childTotal, taxationDetails, []) : { totalTax: 0, taxes: [] }
    
    const totalRoomTax = roomTaxResult.totalTax + childTaxResult.totalTax

    // Get aggregated tax details for display
    const aggregatedTaxes: { [key: string]: { name: string; rate: number; amount: number } } = {}
    
    // Add room taxes
    roomTaxResult.taxes.forEach(tax => {
      if (aggregatedTaxes[tax.name]) {
        aggregatedTaxes[tax.name].amount += tax.amount
      } else {
        aggregatedTaxes[tax.name] = { ...tax }
      }
    })
    
    // Add child taxes
    if (childTaxResult.taxes) {
      childTaxResult.taxes.forEach((tax: any) => {
        if (aggregatedTaxes[tax.name]) {
          aggregatedTaxes[tax.name].amount += tax.amount
        } else {
          aggregatedTaxes[tax.name] = { ...tax }
        }
      })
    }

    return {
      ...room,
      roomSubtotal,
      taxes: Object.values(aggregatedTaxes),
      totalTax: totalRoomTax,
      roomTotal: roomSubtotal + totalRoomTax
    }
  })

  // Calculate total tax amount across all rooms
  const totalTaxAmount = roomsWithTax.reduce((sum, room) => sum + room.totalTax, 0)

  // Calculate deductions on TOTAL subtotal (not per room)
  const totalDeductionsResult = calculateFinalAmount(subtotal, [], deductionDetails)
  const totalDeductionAmount = totalDeductionsResult.totalDeductions

  // Combine taxes (aggregated from rooms) and deductions (calculated on total)
  const combinedTaxes: { [key: string]: { name: string; rate: number; amount: number } } = {}

  // Add taxes from all rooms
  roomsWithTax.forEach(room => {
    room.taxes.forEach(tax => {
      if (combinedTaxes[tax.name]) {
        combinedTaxes[tax.name].amount += tax.amount
      } else {
        combinedTaxes[tax.name] = { ...tax }
      }
    })
  })

  // Add deductions calculated on total
  totalDeductionsResult.deductions.forEach(deduction => {
    combinedTaxes[deduction.name] = deduction
  })

  const aggregatedTaxDetails = Object.values(combinedTaxes)

  // Update state with aggregated tax details
  useEffect(() => {
    setTaxDetails(aggregatedTaxDetails)
    setApiCalculatedTotal(subtotal + totalTaxAmount + totalDeductionAmount)
  }, [subtotal, totalTaxAmount, totalDeductionAmount])

  // Extract GST and Service Charge from API response
  const gstDetail = taxDetails.find(t => t.name === "GST")
  const serviceChargeDetail = taxDetails.find(t => t.name === "Service Charge")

  // Use API values or fallback to calculated values
  const tax = gstDetail ? gstDetail.amount : Math.round(subtotal * 0.18)
  const serviceFee = serviceChargeDetail ? serviceChargeDetail.amount : Math.round(subtotal * 0.04)
  const gstRate = gstDetail ? gstDetail.rate : 18
  const serviceFeeRate = serviceChargeDetail ? serviceChargeDetail.rate : 4

  // Total for bottom bar = Just the subtotal (room price after discount, excluding taxes)
  // The modal will show the full total with taxes when opened
  const total = subtotal

  const totalRooms = selectedRooms.reduce((sum, room) => sum + room.quantity, 0);

  // Validation checks
  const hasValidRooms = selectedRooms.length > 0 && totalRooms > 0;
  const hasValidPrice = subtotal > 0;
  const isBookingValid = hasValidRooms && hasValidPrice;

  if (selectedRooms.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <p className="text-lg font-semibold mb-2">No rooms selected yet</p>
        <p className="text-sm">Select rooms from the available options below to continue</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-6">
        <p className="text-orange-50 text-sm">
          {totalRooms} Room{totalRooms > 1 ? 's' : ''} Selected
        </p>
      </div>

      {/* Dates Section */}
      {checkInDate && checkOutDate && (
        <div className="p-4 bg-orange-50 border-b border-orange-100">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-semibold text-gray-900">
                  {checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-semibold text-gray-900">
                  {checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{nights}</div>
              <div className="text-xs text-gray-600">night{nights > 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Rooms List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {roomsWithTax.map((room, index) => (
          <div
            key={`${room.roomId}-${room.planName}-${room.isExtraBed}-${index}`}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors"
          >
            {/* Room Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {room.roomName}
                  {room.isExtraBed && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      + Extra Bed
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  <span className={`inline-block px-2 py-0.5 rounded font-semibold ${room.planName === 'EP' ? 'bg-green-100 text-green-700' :
                    room.planName === 'CP' ? 'bg-blue-100 text-blue-700' :
                      room.planName === 'MAP' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {room.planName}
                  </span>
                </p>
              </div>
              <button
                onClick={() => onRemoveRoom(room.roomId, room.planName, room.isExtraBed, room.adults)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label="Remove room"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Room Details */}
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Users className="w-3 h-3" />
              <span>{room.adults} Adult{room.adults > 1 ? 's' : ''}</span>
              <span className="text-gray-400">•</span>
              <span>{room.quantity} Room{room.quantity > 1 ? 's' : ''}</span>
            </div>

            {/* Features */}
            {room.planFeatures && room.planFeatures.length > 0 && (
              <div className="space-y-1 mb-3">
                {room.planFeatures.slice(0, 2).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Pricing with Tax Breakdown */}
            <div className="pt-3 border-t border-gray-200 space-y-1.5">
              {/* COMMENTED: Show original price if discount exists - Not showing fake original prices
              {room.originalPrice && room.originalPrice > room.pricePerNight && (
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 line-through">
                    ₹{room.originalPrice.toLocaleString()} × {room.quantity} × {nights}
                  </span>
                  <span className="text-xs text-green-600 font-semibold">
                    Save {room.discountPercentage || Math.round(((room.originalPrice - room.pricePerNight) / room.originalPrice) * 100)}%
                  </span>
                </div>
              )}
              */}

              {/* Room Price */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  ₹{room.pricePerNight.toLocaleString()} × {room.quantity} × {nights} night{nights > 1 ? 's' : ''}
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{room.roomSubtotal.toLocaleString()}
                </span>
              </div>

              {/* Tax Breakdown for this room (GST only, not deductions) */}
              {room.taxes.map((tax, taxIdx) => (
                <div key={taxIdx} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {tax.name} ({tax.rate}%)
                  </span>
                  <span className="text-xs text-gray-700">
                    ₹{Math.round(tax.amount).toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Room Total with Tax */}
              <div className="flex items-center justify-between pt-1.5 border-t border-gray-300">
                <span className="text-xs font-semibold text-gray-900">Room Total</span>
                <span className="font-bold text-orange-600">
                  ₹{Math.round(room.roomTotal).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t-2 border-gray-200 p-4 bg-gray-50">
        <div className="space-y-2 mb-3">
          {/* COMMENTED: Show original price if discount exists - Not showing fake original prices
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Original Hotel Price</span>
              <span className="text-gray-500 line-through">₹{originalHotelPrice.toLocaleString()}</span>
            </div>
          )}
          */}

          {/* COMMENTED: Show discount if exists - Not showing fake discounts
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-sm bg-green-50 -mx-2 px-2 py-1.5 rounded">
              <span className="text-green-700 font-medium">
                Discount ({discountPercentage}% OFF)
              </span>
              <span className="font-semibold text-green-700">-₹{totalDiscount.toLocaleString()}</span>
            </div>
          )}
          */}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Hotel Price</span>
            <span className="font-semibold text-gray-900">₹{hotelPrice.toLocaleString()}</span>
          </div>
          {totalChildPrice > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700 font-medium">
                {childrenCount} Child{childrenCount > 1 ? 'ren' : ''} Charges
              </span>
              <span className="font-semibold text-blue-700">₹{totalChildPrice.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-300">
            <span className="text-gray-600">Subtotal (All Rooms)</span>
            <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
          </div>

          {/* Aggregated Tax Details (Sum of all rooms) */}
          {aggregatedTaxDetails.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2 italic">Total Taxes & Charges (All Rooms)</p>
              {aggregatedTaxDetails.map((taxItem, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{taxItem.name} ({taxItem.rate}%)</span>
                  <span className="font-semibold text-gray-900">₹{Math.round(taxItem.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t-2 border-gray-300 mb-4">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-orange-600">
            ₹{total.toLocaleString()}
          </span>
        </div>

        {/* Validation Warning */}
        {!isBookingValid && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Please ensure all rooms have valid quantities and pricing</span>
            </p>
          </div>
        )}

        {/* Book Now Button */}
        <button
          onClick={onBookNow}
          disabled={!isBookingValid}
          className={`w-full font-bold py-4 rounded-xl transition-all duration-200 shadow-lg ${isBookingValid
            ? 'bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white hover:shadow-xl transform hover:-translate-y-0.5'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {isBookingValid ? 'Book Now' : 'Invalid Selection'}
        </button>

        <p className="text-xs text-center text-gray-500 mt-3">
          {isBookingValid ? "You won't be charged yet" : "Please select valid rooms to continue"}
        </p>
      </div>
    </div>
  );
}
