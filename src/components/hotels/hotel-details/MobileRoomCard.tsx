"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Check,
  Star,
  Info,
  Bath,
  Bed,
  MapPin,
  Maximize,
  Wind,
  Coffee,
  Tv,
  Wifi,
  User,
} from "lucide-react";
import RoomImageCarousel from "./RoomImageCarousel";
import { IMAGE_BASE_URL } from "@/lib/api/apiClient";
import { calculateRoomPlanPromotionalPricing } from "@/utils/roomPromotionalPricing";
import Modal from "@/components/ui/Modal";
import { CONTACT_INFO } from "@/utils/const";
import GroupEnquiryModal from "@/components/hotels/hotel-details/GroupEnquiryModal";

interface MobileRoomCardProps {
  roomData: any;
  hotel: any;
  images: string[];
  pricingData: any;
  availableRooms: number;
  onRoomSelect: (roomData: any) => void;
  selectedRoomsByKey: { [key: string]: number };
  promotionDetails: any[];
  searchDates: any;
  searchAdults: number;
  isDisabled: boolean;
  disabledMessage?: string;
}

export default function MobileRoomCard({
  roomData,
  hotel,
  images,
  pricingData,
  availableRooms,
  onRoomSelect,
  selectedRoomsByKey,
  promotionDetails,
  searchDates,
  searchAdults,
  isDisabled,
  disabledMessage,
}: MobileRoomCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(true);

  // Get min price for "Starts from"
  const getMinPrice = () => {
    let min = Infinity;
    roomData.plans?.forEach((plan: any) => {
      const planPricing = pricingData[plan.plan_name.toLowerCase()];
      const price = planPricing?.sbr_rate || planPricing?.dbr_rate || 0;
      if (price > 0 && price < min) min = price;
    });
    return min === Infinity ? 0 : min;
  };

  const minPrice = getMinPrice();
  const photoCount = roomData?.images?.length || images.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
      {/* Room Image Section */}
      <div className="relative">
        <RoomImageCarousel
          images={images}
          roomName={roomData.room_name}
          height="h-[200px]"
          photoCount={photoCount}
          className="w-full"
          galleryClass="rounded-none"
          navigation={true}
        />

        {/* Availability Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-10 ${
            availableRooms > 5
              ? "bg-green-500 text-white"
              : availableRooms > 0
                ? "bg-orange-500 text-white"
                : "bg-red-500 text-white"
          }`}
        >
          {availableRooms > 0 ? `${availableRooms} Rooms Left` : "Sold Out"}
        </div>
      </div>

      {/* Main Info Section */}
      <div className="p-3 bg-white">
        <div className="mb-2">
          <h3 className="text-[17px] font-bold text-gray-900 leading-tight">
            {roomData.room_name || roomData.costume_room_name}
          </h3>
        </div>
        
        {/* Quick specs like Desktop */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-800 font-medium mb-3">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-bold text-gray-900">Beds:</span>
              <Bed size={14} className="text-gray-500" /> {roomData.bed_type || "1 full bed"}
            </div>
            {roomData.bathroom_count && (
               <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Bath size={14} className="text-gray-500" /> {roomData.bathroom_count} Bathroom
               </div>
            )}
        </div>

        {/* Feature Tags stylings */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
           {roomData.facilitiesDetails?.slice(0, 3).map((facility: any, idx: number) => (
             <div key={idx} className="flex items-center gap-1.5 px-2 h-7 border border-gray-200 rounded-md text-[11px] font-medium text-gray-600 bg-white max-w-[110px]">
               <AmenityIcon image={facility.image} name={facility.name} size={12} colorClass="text-gray-400" />
               <span className="truncate">{facility.name}</span>
             </div>
           ))}
           {roomData.facilitiesDetails && roomData.facilitiesDetails.length > 3 && (
             <button
               onClick={() => setShowAmenities(true)}
               className="flex items-center justify-center px-2 h-7 border border-blue-100 rounded-md text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex-shrink-0"
             >
               +{roomData.facilitiesDetails.length - 3} more
             </button>
           )}
        </div>

        <button
           className="text-xs font-bold text-blue-600 underline text-left hover:text-blue-800 mb-4 block"
           onClick={() => setShowDetails(true)}
        >
          Room Details
        </button>

        {/* Plans list (Always Visible) */}
        <div className="space-y-3">
          {roomData.plans?.map((plan: any, planIdx: number) => (
            <MobileBookingOption
               key={plan.id}
               plan={plan}
               roomData={roomData}
               hotel={hotel}
               pricingData={pricingData[plan.plan_name.toLowerCase()]}
               onRoomSelect={onRoomSelect}
               selectedRoomsByKey={selectedRoomsByKey}
               promotionDetails={promotionDetails}
               searchDates={searchDates}
               searchAdults={searchAdults}
               availableRooms={availableRooms}
               isDisabled={isDisabled}
               isLast={planIdx === roomData.plans.length - 1}
            />
          ))}
        </div>

        {/* Details Modal (Bottom Sheet style) */}
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title={`${roomData.room_name || roomData.costume_room_name} - Details`}
          maxWidth="md"
        >
          <div className="animate-fadeIn pb-6">
            {/* Room Photos */}
            {images && images.length > 0 && (
              <div className="mb-6 -mx-6 -mt-2">
                <RoomImageCarousel
                  images={images}
                  roomName={roomData.room_name || roomData.costume_room_name}
                  height="h-[250px] sm:h-[300px]"
                  photoCount={photoCount}
                  className="w-full"
                  galleryClass="rounded-none"
                  navigation={true}
                />
              </div>
            )}

            <div className="px-2">
              <h4 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">
                Room Basics
              </h4>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <div className="flex items-center gap-1.5">
                  <Bed size={14} className="text-orange-500" />{" "}
                  {roomData.bed_type || "Double Bed"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath size={14} className="text-orange-500" />{" "}
                  {roomData.bathroom_count || 1} Bathroom
                </div>
                {roomData.room_view && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-orange-500" />{" "}
                    {roomData.room_view}
                  </div>
                )}
              </div>

              {roomData.description && (
                <>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">
                    Description
                  </h4>
                  <p className="text-[13px] text-gray-600 leading-relaxed mb-6">
                    {roomData.description}
                  </p>
                </>
              )}

              <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                Room Amenities
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-2">
                {roomData.facilitiesDetails?.map((facility: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 border border-orange-100">
                        <AmenityIcon image={facility.image} name={facility.name} size={10} colorClass="text-orange-500" />
                      </div>
                      <span className="text-[13px] text-gray-700">
                        {facility.name}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Modal>

        {/* Amenities Modal */}
        <Modal
          isOpen={showAmenities}
          onClose={() => setShowAmenities(false)}
          title={`Amenities`}
          maxWidth="md"
        >
          <div className="animate-fadeIn mt-2 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
              {roomData.facilitiesDetails?.map((facility: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 bg-gray-50/50">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm">
                      <AmenityIcon image={facility.image} name={facility.name} size={14} colorClass="text-gray-400" />
                    </div>
                    <span className="text-[14px] font-medium text-gray-800">
                      {facility.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

// Internal helper for Enquiry/Contact/Services sections
export const MobileRateAddons = ({ hotel }: { hotel: any }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryType, setEnquiryType] = useState<"group" | "single">("group");

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="my-2 space-y-2">
      {/* Contact Information */}
      <div className="border border-gray-100 bg-gray-50/50 rounded-xl overflow-hidden transition-all duration-300">
        <button
          onClick={() => toggleSection('contact')}
          className="w-full flex items-center justify-between p-3.5 text-[14px] font-bold text-gray-900"
        >
          <span>Contact Information</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSection === 'contact' ? "rotate-180" : ""}`}
          />
        </button>
        {openSection === 'contact' && (
          <div className="px-3.5 pb-3.5 animate-fadeIn space-y-2">
             <div className="flex flex-col">
               <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Numbers</span>
               <span className="text-[13px] text-gray-700 font-medium">{CONTACT_INFO.mobile1}, {CONTACT_INFO.mobile2}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Addresses</span>
               <span className="text-[13px] text-gray-700 font-medium">{CONTACT_INFO.email1}, {CONTACT_INFO.email2}</span>
             </div>
          </div>
        )}
      </div>

      {/* Services Available */}
      {hotel?.servicedetails && hotel.servicedetails.length > 0 && (
        <div className="border border-gray-100 bg-gray-50/50 rounded-xl overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleSection('services')}
            className="w-full flex items-center justify-between p-3.5 text-[14px] font-bold text-gray-900"
          >
            <span>Services Available</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSection === 'services' ? "rotate-180" : ""}`}
            />
          </button>
          {openSection === 'services' && (
            <div className="px-3.5 pb-3.5 animate-fadeIn">
              <div className="grid grid-cols-1 gap-2.5">
                {hotel.servicedetails.map((service: any, idx: number) => (
                  <div key={idx} className="flex flex-col border-b border-gray-100 last:border-0 pb-1.5 last:pb-0">
                    <span className="text-[13px] font-bold text-gray-800 leading-tight mb-0.5">{service.serviceType}</span>
                    {service.openTime && (
                      <span className="text-[11px] text-gray-500 font-medium">🕒 {service.openTime} - {service.closeTime}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Send Enquiry */}
      <div className="border border-gray-100 bg-gray-50/50 rounded-xl p-3.5">
        <h5 className="text-[14px] font-bold text-gray-900 mb-3">Send Enquiry</h5>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => { setEnquiryType("group"); setShowEnquiryModal(true); }}
            className="bg-[#FF9530] hover:bg-[#e8851c] text-white py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
          >
            Group
          </button>
          <button
            onClick={() => { setEnquiryType("single"); setShowEnquiryModal(true); }}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
          >
            Single
          </button>
        </div>
      </div>

      <GroupEnquiryModal 
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        hotelName={hotel?.name || ""}
        hotelId={hotel?.id || 0}
        enquiryType={enquiryType}
      />
    </div>
  );
};

function MobileBookingOption({
  plan,
  roomData,
  hotel,
  pricingData,
  onRoomSelect,
  selectedRoomsByKey,
  promotionDetails,
  searchDates,
  searchAdults,
  availableRooms,
  isDisabled,
  isLast,
}: any) {
  if (!pricingData) return null;

  const baseAdults = roomData.base_adults || 1;
  const maximumOccupancy = roomData.maximum_occupancy || baseAdults;
  const adultOptions = [];
  for (let i = baseAdults; i <= maximumOccupancy; i++) {
    adultOptions.push(i);
  }

  const [selectedAdults, setSelectedAdults] = useState(
    searchAdults >= baseAdults && searchAdults <= maximumOccupancy
      ? searchAdults
      : baseAdults
  );
  const [showPriceInfo, setShowPriceInfo] = useState(false);
  const [showInclusions, setShowInclusions] = useState(false);

  const pricing = calculatePriceForAdultCount(
    selectedAdults,
    pricingData,
    roomData,
    promotionDetails,
    searchDates
  );

  const key = `${roomData.id}-${plan.plan || plan.id}-${selectedAdults}`;
  const currentSelection = selectedRoomsByKey[key] || 0;
  // Calculate remaining by getting total available minus selected (this needs refinement if we select multiple adult types, but following existing logic)
  const remainingWithCurrent = availableRooms + currentSelection;
  const taxAmount = Math.round(pricing.totalPrice * 0.12);


  return (
    <div className={`p-3 rounded-xl border bg-white shadow-sm flex flex-col gap-1 transition-all duration-200 ${currentSelection > 0 ? "border-blue-600 ring-1 ring-blue-600" : "border-gray-200"}`}>
      {/* Plan Header & Features */}
      <div>
        <h4 className="flex-1 text-[15px] font-bold text-gray-900 leading-tight">
          Room {plan.plan_items?.length > 0 && ` with ${plan.plan_items?.[0]?.name}`} {plan.plan_items?.length > 1 && `| ${plan.plan_items?.[1]?.name}`} {plan.plan_items?.length > 2 && (
            <span onClick={() => setShowInclusions(true)} className="text-orange-500 cursor-pointer hover:underline whitespace-nowrap text-[14px]">
              + {plan.plan_items?.length - 2} more
            </span>
          )}
        </h4>
        <div className="text-xs text-green-700 font-medium mt-1.5 flex flex-col gap-1.5">
          {plan.plan_items?.slice(0, 3).map((item: any, idx: number) => (
             <span key={idx} className="flex items-center gap-1.5">
               <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               {item.name}
             </span>
          ))}
        </div>
      </div>

      {/* Pricing display */}
      <div className="pt-2">
        <div className="text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
          <span>Price for 1 night:</span>
        </div>
        <div className="flex items-center gap-2">
           {pricing?.hasPromotion && (
            <span className="text-sm line-through text-red-500 font-bold">
              ₹{pricing.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xl font-black text-gray-900 leading-none">
            ₹{pricing.totalPrice.toLocaleString()}
          </span>
          <button 
            onClick={() => setShowPriceInfo(true)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="View price details"
          >
            <Info size={14} className="text-gray-400" />
          </button>
        </div>
        <div className="text-[10px] text-gray-500 mt-1">
          +₹{taxAmount} taxes and fees
        </div>
      </div>

      {/* New Enquiry and Info Sections - MOVED to the end of room list */}
      {/* <MobileRateAddons hotel={hotel} /> */}

      {currentSelection === 0 ? (
          <button
            onClick={() => {
              onRoomSelect({
                roomId: roomData.id,
                roomName: roomData.room_name,
                planName: plan.plan_name,
                planId: plan.plan || plan.id,
                planFeatures: plan.plan_items?.map((f: any) => f.name) || [],
                quantity: 1, // Start with 1 room
                pricePerNight: pricing.totalPrice,
                isExtraBed: selectedAdults > baseAdults,
                adults: selectedAdults,
              });
            }}
            disabled={isDisabled || availableRooms <= 0}
            className={`w-full py-2.5 rounded-xl font-bold text-white text-sm shadow-sm transition-colors mt-1 ${
              isDisabled || availableRooms <= 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            Reserve
          </button>
      ) : (


        <div className="mt-1 space-y-3">

          {/* Guest Selector */}
          <div>
            <div className="text-[12px] font-bold text-gray-900 mb-1.5">
              Select number of guests
            </div>
            <div className="flex flex-wrap gap-2">
              {adultOptions.map((adultCount) => (
                <label
                  key={adultCount}
                  className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
                    selectedAdults === adultCount
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-400 bg-white hover:border-gray-500"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                      selectedAdults === adultCount
                        ? "border-blue-600 bg-white"
                        : "border-gray-500 bg-white"
                    }`}
                  >
                    {selectedAdults === adultCount && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: Math.min(adultCount, 5) }).map((_, i) => (
                      <svg key={i} className={`w-[14px] h-[14px] ${selectedAdults === adultCount ? "text-gray-900 fill-gray-900" : "text-gray-800 fill-gray-800"}`} viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    ))}
                    {adultCount > 5 && (
                      <span className="text-xs font-bold text-gray-600 ml-1">
                        +{adultCount - 5}
                      </span>
                    )}
                  </div>
                  
                  <input
                    type="radio"
                    className="hidden"
                    name={`guests-${roomData.id}-${plan.id}`}
                    checked={selectedAdults === adultCount}
                    onChange={() => {
                      if (currentSelection > 0) {
                        // 1. CLEAR the old selected configuration
                        onRoomSelect({
                          roomId: roomData.id,
                          roomName: roomData.room_name,
                          planName: plan.plan_name,
                          planId: plan.plan || plan.id,
                          planFeatures: plan.plan_items?.map((f: any) => f.name) || [],
                          quantity: 0,
                          pricePerNight: pricing.totalPrice,
                          isExtraBed: selectedAdults > baseAdults,
                          adults: selectedAdults,
                        });

                        // 2. SET the new configuration to the same active quantity
                        const newPricing = calculatePriceForAdultCount(
                          adultCount,
                          pricingData,
                          roomData,
                          promotionDetails,
                          searchDates
                        );
                        // Make sure we dispatch the add sequence after the remove executes.
                        // Since setSelectedRooms uses a callback approach in the parent,
                        // consecutive calls process sequentially.
                        setTimeout(() => {
                           onRoomSelect({
                             roomId: roomData.id,
                             roomName: roomData.room_name,
                             planName: plan.plan_name,
                             planId: plan.plan || plan.id,
                             planFeatures: plan.plan_items?.map((f: any) => f.name) || [],
                             quantity: currentSelection,
                             pricePerNight: newPricing.totalPrice,
                             isExtraBed: adultCount > baseAdults,
                             adults: adultCount,
                           });
                        }, 0);
                      }
                      
                      setSelectedAdults(adultCount);
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
          
          {/* Reservation Summary & Quantity Selector */}
          <div className="pt-2 flex flex-col gap-1 border-t border-gray-100 mt-2">
            <div className="flex justify-between items-center">
               {/* Left: Pricing */}
               <div className="text-left flex-1">
                  <div className="flex items-center justify-start gap-1.5">
                    {pricing?.hasPromotion && (
                      <span className="text-sm line-through text-red-500 font-bold">
                        ₹{(pricing.originalPrice * currentSelection).toLocaleString()}
                      </span>
                    )}
                    <span className="text-[17px] font-black text-gray-900 leading-none">
                      ₹{(pricing.totalPrice * currentSelection).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    +₹{taxAmount * currentSelection} taxes and fees
                  </div>
               </div>

               {/* Right: Quantity Counter Tool */}
               <div className="w-[120px] flex flex-col items-end shrink-0">
                  <div className="flex items-center border border-orange-400 rounded-lg overflow-hidden h-9 bg-white transition-colors duration-200 focus-within:border-orange-500 shadow-sm w-full">
                    <button
                      onClick={() => {
                        const newQty = Math.max(0, currentSelection - 1);
                        if (newQty === 0) {
                          setSelectedAdults(baseAdults);
                        }
                        
                        onRoomSelect({
                          roomId: roomData.id,
                          roomName: roomData.room_name,
                          planName: plan.plan_name,
                          planId: plan.plan || plan.id,
                          planFeatures: plan.plan_items?.map((f: any) => f.name) || [],
                          quantity: newQty,
                          pricePerNight: pricing.totalPrice,
                          isExtraBed: newQty === 0 ? false : selectedAdults > baseAdults,
                          adults: newQty === 0 ? baseAdults : selectedAdults,
                        });
                      }}
                      disabled={currentSelection === 0}
                      className={`w-9 h-full flex items-center justify-center transition-colors ${
                        currentSelection === 0
                          ? "text-orange-300 bg-white cursor-not-allowed"
                          : "text-orange-600 hover:bg-orange-50 active:bg-orange-100"
                      }`}
                    >
                      {currentSelection === 1 ? (
                        <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      )}
                    </button>
                    <div className="flex-1 flex items-center justify-center text-[14px] font-black h-full text-orange-900 select-none border-x border-orange-100 bg-orange-50/50">
                      {currentSelection}
                    </div>
                    <button
                      onClick={() => {
                        onRoomSelect({
                          roomId: roomData.id,
                          roomName: roomData.room_name,
                          planName: plan.plan_name,
                          planId: plan.plan || plan.id,
                          planFeatures: plan.plan_items?.map((f: any) => f.name) || [],
                          quantity: currentSelection + 1,
                          pricePerNight: pricing.totalPrice,
                          isExtraBed: selectedAdults > baseAdults,
                          adults: selectedAdults,
                        });
                      }}
                      disabled={
                        isDisabled ||
                        remainingWithCurrent <= currentSelection ||
                        currentSelection >= 10
                      }
                      className={`w-9 h-full flex items-center justify-center transition-colors ${
                        isDisabled || remainingWithCurrent <= currentSelection || currentSelection >= 10
                          ? "text-orange-300 bg-white cursor-not-allowed"
                          : "text-orange-600 hover:bg-orange-50 active:bg-orange-100"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  {remainingWithCurrent === 0 && (
                    <div className="text-[10px] font-bold text-orange-500 mt-1 w-full text-right">
                      Sold out
                    </div>
                  )}
               </div>
            </div>
           </div>
         </div>
      )}

      {/* Price Details Modal */}
      <Modal
        isOpen={showPriceInfo}
        onClose={() => setShowPriceInfo(false)}
        title="Price Details"
        maxWidth="md"
      >
        <div className="animate-fadeIn mt-2 pb-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between text-[13px] text-gray-600">
              <span>Base Price (1 Night)</span>
              <span className="font-semibold text-gray-900">₹{pricing.originalPrice.toLocaleString()}</span>
            </div>
            
            {pricing?.hasPromotion && (
              <>
                <div className="flex justify-between text-[13px] text-green-600">
                  <span>Discount ({pricing.promotionData?.discountPercentage || 0}%)</span>
                  <span className="font-semibold">-₹{(pricing.originalPrice - pricing.totalPrice).toLocaleString()}</span>
                </div>
                
                <div className="w-full h-[1px] bg-gray-200 my-1"></div>
                
                <div className="flex justify-between text-[13px] text-gray-600">
                  <span>Discounted Price</span>
                  <span className="font-semibold text-gray-900">₹{pricing.totalPrice.toLocaleString()}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between text-[13px] text-gray-600">
              <span>Taxes & Fees</span>
              <span className="font-semibold text-gray-900">+₹{taxAmount.toLocaleString()}</span>
            </div>
            
            <div className="w-full h-px bg-gray-200 my-1"></div>
            
            <div className="flex justify-between text-[15px] font-bold text-gray-900">
              <span>Total After Taxes</span>
              <span>₹{(pricing.totalPrice + taxAmount).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex gap-2">
            <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p>This is the final calculated price for 1 night based on your selected plan and current occupancy rate. Total stay pricing will multiply by nights selected during booking.</p>
          </div>
        </div>
      </Modal>

      {/* Inclusions Modal */}
      <Modal
        isOpen={showInclusions}
        onClose={() => setShowInclusions(false)}
        title="Inclusions"
        maxWidth="md"
      >
        <div className="animate-fadeIn mt-2 pb-4">
          <div className="flex flex-col gap-3">
             {plan.plan_items?.map((item: any, idx: number) => (
               <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-green-100 bg-green-50/50 text-green-800 font-medium text-[13px]">
                 <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                 {item.name}
               </div>
             ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Pricing calculation helper
function calculatePriceForAdultCount(
  adultCount: number,
  pricingData: any,
  roomData: any,
  promotionDetails: any[],
  searchDates: any,
) {
  const singleBedRate = pricingData?.sbr_rate || 0;
  const doubleBedRate = pricingData?.dbr_rate || 0;
  const extraBedRate = pricingData?.extra_bed_rate || 0;

  let baseRate = 0;
  let baseAdultsCovered = 0;

  if (adultCount >= 2 && doubleBedRate > 0) {
    baseRate = doubleBedRate;
    baseAdultsCovered = 2;
  } else if (singleBedRate > 0) {
    baseRate = singleBedRate;
    baseAdultsCovered = 1;
  } else {
    baseRate = doubleBedRate || singleBedRate || 0;
    baseAdultsCovered = roomData.base_adults || 1;
  }

  const extraAdults = Math.max(0, adultCount - baseAdultsCovered);
  const totalPrice = Math.round(baseRate + extraAdults * extraBedRate);

  const promotionalPricing = calculateRoomPlanPromotionalPricing(
    totalPrice,
    roomData.id,
    pricingData.plan,
    promotionDetails,
    searchDates?.checkIn,
    searchDates?.checkOut,
  );

  return {
    totalPrice: promotionalPricing.hasPromotion
      ? promotionalPricing.discountedPrice
      : totalPrice,
    originalPrice: promotionalPricing.hasPromotion
      ? promotionalPricing.originalPrice
      : totalPrice,
    hasPromotion: promotionalPricing.hasPromotion,
    promotionData: promotionalPricing,
  };
}

function AmenityIcon({ 
  image, 
  name, 
  size = 12, 
  colorClass = "text-gray-400" 
}: { 
  image?: string; 
  name: string; 
  size?: number;
  colorClass?: string;
}) {
  const [error, setError] = useState(false);

  if (!image || error) {
    return <Check size={size} className={`${colorClass} flex-shrink-0`} />;
  }

  return (
    <div className="flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <Image 
        src={`${IMAGE_BASE_URL}${image}`} 
        alt={name} 
        width={size} 
        height={size} 
        className="object-contain opacity-70" 
        onError={() => setError(true)} 
      />
    </div>
  );
}
