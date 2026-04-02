/**
 * Promotional Pricing Example Component
 * 
 * This component demonstrates how promotional pricing works with sample data.
 * Use this as a reference for understanding the promotional pricing flow.
 */

import React from 'react'
import { calculateRoomPlanPromotionalPricing } from '@/utils/roomPromotionalPricing'
import { PromotionDetail } from '@/types/roomInventory'

// Sample promotion data from API
const samplePromotionDetails: PromotionDetail[] = [
  {
    has_promotion: true,
    type_of_offer: "Fixed",
    promotion_discount: 1020,
    best_promotion: {
      type: "Basic",
      rate_or_percentage: 1020,
      type_of_offer: "Fixed",
      promotion_id: 4,
      details: {
        id: 4,
        created: "2025-11-03T19:12:08.391929Z",
        property: 1,
        promotion_rooms: [
          {
            id: 7,
            basic_promotion: 4,
            rooms: 2,
            room_name: "Deluxe Room",
            plans: [1],
            plan_details: [
              {
                id: 1,
                name: "CP",
                created: "2023-11-18T03:44:24.915341Z",
                created_by: 2
              }
            ]
          },
          {
            id: 8,
            basic_promotion: 4,
            rooms: 839,
            room_name: "Premium Room",
            plans: [2],
            plan_details: [
              {
                id: 2,
                name: "EP",
                created: "2023-11-18T03:44:49.476106Z",
                created_by: 2
              }
            ]
          }
        ],
        deleted: false,
        type_of_offer: "Fixed",
        rate_or_percentage: 1020,
        booking_start: "2025-11-07",
        booking_end: "2025-12-31",
        stay_start: "2025-11-07",
        stay_end: "2025-12-21",
        back_out_start: null,
        back_out_end: null,
        name: "test",
        name_hindi: null,
        status: false,
        status_remark: "Duplicate",
        created_by: 2,
        full_name: "Admin Admin"
      }
    }
  }
]

export default function PromotionalPricingExample() {
  // Example 1: Room with promotion (Deluxe Room, CP Plan)
  const example1 = calculateRoomPlanPromotionalPricing(
    4000,  // Original price
    2,     // Room ID (Deluxe Room)
    1,     // Plan ID (CP)
    samplePromotionDetails
  )

  // Example 2: Room without promotion (Different room)
  const example2 = calculateRoomPlanPromotionalPricing(
    3500,  // Original price
    5,     // Room ID (Different room)
    1,     // Plan ID (CP)
    samplePromotionDetails
  )

  // Example 3: Percentage discount (if API returns percentage)
  const percentagePromotion: PromotionDetail[] = [
    {
      has_promotion: true,
      type_of_offer: "Percentage",
      promotion_discount: 25,
      best_promotion: {
        type: "Basic",
        rate_or_percentage: 25,
        type_of_offer: "Percentage",
        promotion_id: 5,
        details: {
          id: 5,
          property: 1,
          promotion_rooms: [
            {
              id: 9,
              rooms: 3,
              room_name: "Suite Room",
              plans: [1, 2],
              plan_details: []
            }
          ],
          type_of_offer: "Percentage",
          rate_or_percentage: 25,
          booking_start: "2025-11-01",
          booking_end: "2025-12-31",
          stay_start: "2025-11-01",
          stay_end: "2025-12-31",
          name: "25% Off Special"
        }
      }
    }
  ]

  const example3 = calculateRoomPlanPromotionalPricing(
    5000,  // Original price
    3,     // Room ID (Suite Room)
    1,     // Plan ID (CP)
    percentagePromotion
  )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Promotional Pricing Examples
        </h1>
        <p className="text-gray-600 mb-6">
          Demonstrating how promotional discounts are calculated and displayed
        </p>

        {/* Example 1: Fixed Discount with Promotion */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Example 1: Fixed Discount (₹1,020 OFF)
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Room:</span>
              <span className="font-medium">Deluxe Room (ID: 2)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Plan:</span>
              <span className="font-medium">CP (ID: 1)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Has Promotion:</span>
              <span className={`font-bold ${example1.hasPromotion ? 'text-green-600' : 'text-red-600'}`}>
                {example1.hasPromotion ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            
            {example1.hasPromotion && (
              <>
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <span>🎉</span>
                      <span>{example1.discountText}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-xl line-through text-red-500">
                      ₹{example1.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{example1.discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <p className="text-sm text-green-600 font-medium">
                      You save ₹{example1.savings.toLocaleString()} ({example1.discountPercentage}%)
                    </p>
                    {example1.formattedBookingPeriod && (
                      <p className="text-xs text-gray-500">
                        Valid: {example1.formattedBookingPeriod}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Example 2: No Promotion */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Example 2: No Promotion Available
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Room:</span>
              <span className="font-medium">Standard Room (ID: 5)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Plan:</span>
              <span className="font-medium">CP (ID: 1)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Has Promotion:</span>
              <span className={`font-bold ${example2.hasPromotion ? 'text-green-600' : 'text-red-600'}`}>
                {example2.hasPromotion ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{example2.discountedPrice.toLocaleString()}
                </span>
                <p className="text-sm text-gray-600 mt-2">
                  Regular pricing (no promotion applies)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example 3: Percentage Discount */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Example 3: Percentage Discount (25% OFF)
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Room:</span>
              <span className="font-medium">Suite Room (ID: 3)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Plan:</span>
              <span className="font-medium">CP (ID: 1)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Has Promotion:</span>
              <span className={`font-bold ${example3.hasPromotion ? 'text-green-600' : 'text-red-600'}`}>
                {example3.hasPromotion ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            
            {example3.hasPromotion && (
              <>
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <span>🎉</span>
                      <span>{example3.discountText}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-xl line-through text-red-500">
                      ₹{example3.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{example3.discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <p className="text-sm text-green-600 font-medium">
                      You save ₹{example3.savings.toLocaleString()} ({example3.discountPercentage}%)
                    </p>
                    {example3.formattedBookingPeriod && (
                      <p className="text-xs text-gray-500">
                        Valid: {example3.formattedBookingPeriod}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Code Example */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Code Usage
          </h2>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm">
{`import { calculateRoomPlanPromotionalPricing } from '@/utils/roomPromotionalPricing'

const pricing = calculateRoomPlanPromotionalPricing(
  4000,              // originalPrice
  2,                 // roomId
  1,                 // planId
  promotionDetails   // from API
)

if (pricing.hasPromotion) {
  console.log('Discounted:', pricing.discountedPrice)
  console.log('Savings:', pricing.savings)
  console.log('Badge:', pricing.discountText)
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
