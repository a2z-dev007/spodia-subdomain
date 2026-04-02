"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Users, Check, ChevronDown, ChevronUp, Trash2, Plus, Minus } from 'lucide-react'
import { PriceDetail, RoomDetail, PromotionDetail } from '@/types/roomInventory'
import Modal from '@/components/ui/Modal'
import { calculateRoomPlanPromotionalPricing } from '@/utils/roomPromotionalPricing'
import { IMAGE_BASE_URL } from '@/lib/api/apiClient'
import { Star } from 'lucide-react'

interface RoomTableProps {
  hotelData: any
  roomPricing?: PriceDetail[]
  roomInventory?: RoomDetail[]
  promotionDetails?: PromotionDetail[]
  isPricingLoading?: boolean
  searchDates?: {
    checkIn: Date | null
    checkOut: Date | null
    guests: { adults: number; children: number }
  }
}

// Room Features Section Component (unchanged logic)
const RoomFeaturesSection = ({ facilities, roomName }: { facilities: any[], roomName: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const initialItemCount = isMobile ? 2 : 5;
  const displayedFacilities = showAll ? facilities : facilities.slice(0, initialItemCount);
  const hasMore = facilities.length > initialItemCount;

  return (
    <>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-800">Features</p>
        {displayedFacilities.map((facility: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
            {facility.image ? (
              <div className="w-3 h-3 flex-shrink-0">
                <Image
                  src={`${IMAGE_BASE_URL}${facility.image}`}
                  alt={facility.name}
                  width={12}
                  height={12}
                  className="w-3 h-3 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                        parent.innerHTML = '<svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
                    }
                  }}
                />
              </div>
            ) : (
              <Star className="w-3 h-3 text-gray-400" />
            )}
            <span className='whitespace-normal'>{facility.name}</span>
          </div>
        ))}
        {hasMore && (
          <>
            {isMobile ? (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-orange-500 hover:text-orange-600 font-medium mt-1"
              >
                +{facilities.length - initialItemCount} more amenities
              </button>
            ) : (
              <button 
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-orange-500 hover:text-orange-600 font-medium mt-1"
              >
                {showAll ? 'Show less' : `+${facilities.length - initialItemCount} more amenities`}
              </button>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${roomName} - All Features`}
        maxWidth="lg"
      >
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          {facilities.map((facility: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
               <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
               <span>{facility.name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default function RoomTable({
  hotelData,
  roomPricing = [],
  roomInventory = [],
  promotionDetails = [],
  isPricingLoading = false,
  searchDates
}: RoomTableProps) {
  const rooms = hotelData?.rooms || []

  // State to track selected room counts for each plan with adult count
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: { count: number, adultCount: number } }>({})

  // Track expanded cards
  const [expandedPlans, setExpandedPlans] = useState<{ [key: string]: boolean }>({})

  const togglePlanExpand = (roomId: number, planId: number) => {
    const key = `${roomId}-${planId}`
    setExpandedPlans(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getRoomPlanPricing = (roomId: number, planId: number): PriceDetail | undefined => {
    return roomPricing.find(p => p.room === roomId && p.plan === planId)
  }

  const getRoomInventory = (roomId: number): { total: number, sold: number, available: number } => {
    const inventory = roomInventory.filter(inv => inv.room === roomId)
    const total = inventory.reduce((sum, inv) => sum + (inv.value || 0), 0)
    const sold = inventory.reduce((sum, inv) => sum + (inv.sold || 0), 0)
    const available = total - sold
    return { total, sold, available }
  }

  const getTotalSelectedForRoomType = (roomId: number): number => {
    let total = 0
    Object.keys(selectedRooms).forEach(key => {
      const [keyRoomId] = key.split('-').map(Number)
      if (keyRoomId === roomId) {
        total += selectedRooms[key].count
      }
    })
    return total
  }

  const getRemainingRoomsForType = (roomId: number): number => {
    const inventory = getRoomInventory(roomId)
    const totalSelected = getTotalSelectedForRoomType(roomId)
    const remaining = inventory.available - totalSelected
    return Math.max(0, remaining)
  }

  const handleRoomSelect = (roomId: number, planId: number, count: number, adultCount: number) => {
    const key = `${roomId}-${planId}-${adultCount}` 
    setSelectedRooms(prev => {
      const newState = { ...prev }
      if (count > 0) {
        newState[key] = { count, adultCount }
      } else {
        delete newState[key]
      }
      return newState
    })
  }

  const getSelectedCount = (roomId: number, planId: number, adultCount: number) => {
    const key = `${roomId}-${planId}-${adultCount}`
    return selectedRooms[key]?.count || 0
  }

  // Get total selected for a specific plan
  const getTotalSelectedForPlan = (roomId: number, planId: number) => {
    let total = 0
    Object.keys(selectedRooms).forEach(key => {
      const [keyRoomId, keyPlanId] = key.split('-').map(Number)
      if (keyRoomId === roomId && keyPlanId === planId) {
        total += selectedRooms[key].count
      }
    })
    return total
  }

  // Check if any row in this plan is selected
  const isPlanSelected = (roomId: number, planId: number) => {
    return getTotalSelectedForPlan(roomId, planId) > 0
  }

  if (isPricingLoading) {
    return (
      <div className="flex items-center justify-center py-12 border rounded-xl bg-white shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600 font-medium">Fetching best rates...</span>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 font-medium">No rooms available for selected dates</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {rooms.map((room: any) => {
        const roomImages = room.images && room.images.length > 0
          ? room.images.map((img: any) => img.file)
          : []

        const roomInventoryAvailable = getRemainingRoomsForType(room.id)

        return (
          <div key={room.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            
            {/* Room Card Desktop/Tablet Header Layout */}
            <div className="flex flex-col md:flex-row border-b border-gray-200">
              
              {/* Left Details */}
              <div className="w-full md:w-2/5 p-4 md:p-6 bg-gray-50 md:border-r border-gray-200">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                    {room.room_name || room.costume_room_name}
                  </h3>
                  
                  {/* Inventory Badge */}
                  <div className="inline-flex flex-col mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${roomInventoryAvailable > 5
                      ? 'bg-green-100 text-green-700'
                      : roomInventoryAvailable > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      {roomInventoryAvailable} Rooms Available
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 font-medium">
                    {room.dimensions || '132'} sq. ft | {room.room_view || 'City View'} | Max {room.maximum_adults || room.base_adults || 2} Adults
                  </p>
                </div>
                
                {/* Images */}
                {roomImages.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {roomImages.slice(0, 3).map((img: string, idx: number) => (
                      <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                          src={img}
                          alt={`Room ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                    {roomImages.length > 3 && (
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-900 flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                         <Image src={roomImages[3]} alt="More" fill className="object-cover opacity-40"/>
                         <span className="text-white text-xs font-bold z-10">+{roomImages.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <RoomFeaturesSection 
                  facilities={room.facilitiesDetails || []} 
                  roomName={room.room_name || room.costume_room_name}
                />
              </div>

              {/* Right Side: Plans (Card Accodions) */}
              <div className="w-full md:w-3/5 p-4 md:p-6 bg-white space-y-4">
                 <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Select Plan & Adults</h4>
                 
                 {room.plans?.map((plan: any) => {
                   const planKey = `${room.id}-${plan.plan}`
                   const isExpanded = expandedPlans[planKey] || false
                   const pricing: PriceDetail | undefined = getRoomPlanPricing(room.id, plan.plan)
                   const sbrRate: number = pricing?.sbr_rate ?? 0 
                   const dbrRate: number = pricing?.dbr_rate ?? 0 
                   const extraBedRate: number = pricing?.extra_bed_rate ?? 0
                   const baseAdults = room.base_adults || 1
                   const maxAdults = room.maximum_adults || baseAdults
                   const numberOfRows = maxAdults - baseAdults + 1

                   const getPriceForAdults = (adultCount: number): number => {
                     if (adultCount === 1) return sbrRate
                     else if (adultCount === 2) return dbrRate || sbrRate
                     else {
                       const baseRate = dbrRate || sbrRate
                       const extraAdults = adultCount - 2
                       return baseRate + (extraAdults * extraBedRate)
                     }
                   }

                   const baseTotalPrice = Math.round(getPriceForAdults(baseAdults))
                   const promotionalPricing = calculateRoomPlanPromotionalPricing(
                      baseTotalPrice,
                      room.id,
                      plan.plan,
                      promotionDetails,
                      searchDates?.checkIn,
                      searchDates?.checkOut
                   )

                   // Map abbreviated plan names to full user-friendly descriptions
                   const getPlanDisplayName = (planName: string) => {
                     switch (planName?.trim().toUpperCase()) {
                       case 'EP': return 'Room Only';
                       case 'CP': return 'Room with Breakfast Included';
                       case 'MAP': return 'Room with Breakfast and Lunch or Dinner Included';
                       case 'AP': return 'Breakfast, Lunch & Dinner Included';
                       default: return planName;
                     }
                   };

                   return (
                     <div key={plan.id} className={`border rounded-xl mt-3 overflow-hidden transition-all duration-300 ${isPlanSelected(room.id, plan.plan) ? 'border-orange-500 shadow-sm' : 'border-gray-200'}`}>
                        {/* Plan Card Header (Always visible) */}
                        <div className="bg-white p-4">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex gap-3">
                                 {/* Plan Badge Icon */}
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isPlanSelected(room.id, plan.plan) ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
                                    {plan.plan_name.substring(0, 2).toUpperCase()}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-gray-900">{getPlanDisplayName(plan.plan_name)}</h4>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                      {plan.plan_items?.slice(0, 2).map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center text-xs text-gray-600">
                                          <Check className="w-3 h-3 text-green-500 mr-1 shrink-0" />
                                          <span className="truncate max-w-[120px]">{item.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="flex flex-col sm:items-end justify-center shrink-0">
                                 {!isExpanded && (
                                   <>
                                      <div className="text-right flex items-end justify-end gap-2 shrink-0">
                                         {promotionalPricing.hasPromotion ? (
                                           <>
                                             <span className="text-sm line-through text-red-500 font-medium">₹{promotionalPricing.originalPrice.toLocaleString()}</span>
                                             <span className="text-xl font-bold text-gray-900">₹{promotionalPricing.discountedPrice.toLocaleString()}</span>
                                           </>
                                         ) : (
                                            <span className="text-xl font-bold text-gray-900">₹{baseTotalPrice.toLocaleString()}</span>
                                         )}
                                      </div>
                                      <p className="text-[10px] text-gray-500 text-right mb-2 mt-0.5">Starts from ({baseAdults} Adult)</p>
                                   </>
                                 )}
                                 
                                 <button 
                                    onClick={() => togglePlanExpand(room.id, plan.plan)}
                                    className={`w-full sm:w-auto px-6 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-1
                                      ${isExpanded ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm'}`}
                                 >
                                    {isExpanded ? (
                                      <>Hide Options <ChevronUp className="w-4 h-4 ml-1"/></>
                                    ) : (
                                      <>Reserve <ChevronDown className="w-4 h-4 ml-1"/></>
                                    )}
                                 </button>
                                 {isPlanSelected(room.id, plan.plan) && !isExpanded && (
                                   <div className="mt-2 text-xs font-bold text-orange-600 flex items-center gap-1 justify-end">
                                      <Check className="w-3 h-3"/> {getTotalSelectedForPlan(room.id, plan.plan)} options selected
                                   </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Expanded Plan View containing Selectors */}
                        {isExpanded && (
                           <div className="bg-gray-50/80 border-t border-gray-100 p-3 sm:p-4 space-y-3">
                              {/* Headers */}
                              <div className="hidden sm:grid grid-cols-12 text-xs font-semibold text-gray-500 px-2 pb-2 border-b border-gray-200">
                                 <div className="col-span-5">Occupancy</div>
                                 <div className="col-span-4 text-center">Price</div>
                                 <div className="col-span-3 text-right">Rooms</div>
                              </div>

                              {Array.from({ length: numberOfRows }, (_, index) => {
                                 const adultCount = baseAdults + index;
                                 const totalPrice = Math.round(getPriceForAdults(adultCount));
                                 const currentSelection = getSelectedCount(room.id, plan.plan, adultCount);
                                 const remainingRooms = getRemainingRoomsForType(room.id) + currentSelection;
                                 const maxSelectable = Math.min(remainingRooms, 10);
                                 
                                 const rowPromoPricing = calculateRoomPlanPromotionalPricing(
                                    totalPrice, room.id, plan.plan, promotionDetails, searchDates?.checkIn, searchDates?.checkOut
                                 )

                                 return (
                                    <div key={adultCount} className={`bg-white rounded-lg p-3 sm:p-4 border shadow-sm transition-all
                                       ${currentSelection > 0 ? 'border-orange-300 ring-1 ring-orange-200 bg-orange-50/30' : 'border-gray-200'}
                                    `}>
                                       <div className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-2 items-center">
                                          
                                          {/* Adults */}
                                          <div className="w-full sm:col-span-5 flex items-center sm:justify-start justify-between">
                                             <div className="flex items-center gap-1.5 font-medium text-gray-700">
                                                <div className="flex items-center bg-gray-100 rounded-md px-2 py-1 gap-1">
                                                   <Users className="w-4 h-4 text-gray-600" />
                                                   <span className="text-sm font-semibold">{adultCount}</span>
                                                </div>
                                                <span className="text-sm">Adult{adultCount > 1 ? 's' : ''}</span>
                                             </div>
                                             {/* Mobile Price View (hidden on desktop) */}
                                             <div className="sm:hidden text-right">
                                                {rowPromoPricing.hasPromotion ? (
                                                  <div className="flex flex-col items-end">
                                                    <span className="text-xs line-through text-red-500">₹{rowPromoPricing.originalPrice.toLocaleString()}</span>
                                                    <span className="text-base font-bold text-gray-900">₹{rowPromoPricing.discountedPrice.toLocaleString()}</span>
                                                  </div>
                                                ) : (
                                                  <span className="text-base font-bold text-gray-900">₹{totalPrice.toLocaleString()}</span>
                                                )}
                                             </div>
                                          </div>

                                          {/* Price Desktop */}
                                          <div className="hidden sm:col-span-4 sm:flex flex-col items-center justify-center">
                                             {rowPromoPricing.hasPromotion ? (
                                                <div className="text-center">
                                                   <div className="text-xs line-through text-red-500 font-medium">₹{rowPromoPricing.originalPrice.toLocaleString()}</div>
                                                   <div className="text-lg font-bold text-gray-900">₹{rowPromoPricing.discountedPrice.toLocaleString()}</div>
                                                   <div className="text-[10px] text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">Save {Math.round((1 - rowPromoPricing.discountedPrice/rowPromoPricing.originalPrice) * 100)}%</div>
                                                </div>
                                             ) : (
                                                <div className="text-lg font-bold text-gray-900 text-center">₹{totalPrice.toLocaleString()}</div>
                                             )}
                                          </div>

                                          {/* Decrement/Increment Counter */}
                                          <div className="w-full sm:col-span-3 flex sm:justify-end justify-center items-center">
                                             <div className="flex flex-col items-end w-full sm:w-auto">
                                                <div className={`flex items-center justify-between border rounded-lg overflow-hidden h-10 w-full sm:w-32 transition-colors ${currentSelection > 0 ? 'border-orange-400 bg-white' : 'border-gray-300 bg-white shadow-sm'}`}>
                                                   
                                                   <button 
                                                      className={`w-10 h-full flex items-center justify-center transition-colors ${currentSelection === 0 ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'text-orange-600 hover:bg-orange-50 active:bg-orange-100'}`}
                                                      disabled={currentSelection === 0}
                                                      onClick={() => handleRoomSelect(room.id, plan.plan, currentSelection - 1, adultCount)}
                                                      aria-label="Decrease quantity"
                                                   >
                                                      {currentSelection === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4 stroke-[3]" />}
                                                   </button>
                                                   
                                                   <div className={`flex-1 flex justify-center text-sm font-bold ${currentSelection > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                                                      {currentSelection}
                                                   </div>
                                                   
                                                   <button 
                                                      className={`w-10 h-full flex items-center justify-center transition-colors hover:bg-gray-50 active:bg-gray-100 ${remainingRooms === 0 && currentSelection === 0 ? 'text-gray-300 cursor-not-allowed bg-gray-50' : currentSelection === maxSelectable ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'text-blue-600'}`}
                                                      disabled={remainingRooms === 0 || currentSelection === maxSelectable}
                                                      onClick={() => handleRoomSelect(room.id, plan.plan, currentSelection + 1, adultCount)}
                                                      aria-label="Increase quantity"
                                                   >
                                                      <Plus className="w-4 h-4 stroke-[3]" />
                                                   </button>
                                                   
                                                </div>
                                                {/* Remaining rooms helper text */}
                                                {(remainingRooms <= 3 && remainingRooms > 0) && (
                                                   <span className="text-[10px] text-red-500 font-semibold mt-1">Only {remainingRooms} left!</span>
                                                )}
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 )
                              })}
                           </div>
                        )}
                     </div>
                   )
                 })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
