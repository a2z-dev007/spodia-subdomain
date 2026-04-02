'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Users, 
  Bed, 
  ChevronDown, 
  ChevronUp,
  Maximize2,
  Plus,
  Minus
} from 'lucide-react';
import { IMAGE_BASE_URL } from '@/lib/api/apiClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IMAGES } from '@/assets/images';

interface CompactHotelRoomBookingProps {
  hotelData?: any;
  roomPricing?: any[];
  isPricingLoading?: boolean;
  searchDates?: {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: { adults: number; children: number };
  };
  childrenAges?: number[];
  onRoomSelect?: (roomData: any) => void;
  isDisabled?: boolean;
}

export default function CompactHotelRoomBooking({
  hotelData,
  roomPricing = [],
  isPricingLoading = false,
  searchDates,
  childrenAges = [],
  onRoomSelect,
  isDisabled = false
}: CompactHotelRoomBookingProps) {
  const rooms = hotelData?.rooms || [];
  
  // Initialize with all rooms expanded by default
  const [expandedRooms, setExpandedRooms] = useState<Set<number>>(() => {
    const allRoomIds = new Set<number>();
    rooms.forEach((room: any) => {
      if (room.id) {
        allRoomIds.add(room.id);
      }
    });
    return allRoomIds;
  });
  
  const [selectedRoomsByKey, setSelectedRoomsByKey] = useState<{ [key: string]: number }>({});

  // Calculate nights
  const nights = searchDates?.checkIn && searchDates?.checkOut
    ? Math.ceil((searchDates?.checkOut.getTime() - searchDates?.checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  // Helper function to get pricing for a specific room and plan
  const getRoomPlanPricing = (roomId: number, planId: number) => {
    return roomPricing.find(p => p.room === roomId && p.plan === planId);
  };

  // Toggle room expansion
  const toggleRoomExpansion = (roomId: number) => {
    setExpandedRooms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) {
        newSet.delete(roomId);
      } else {
        newSet.add(roomId);
      }
      return newSet;
    });
  };

  // Handle room selection
  const handleRoomSelection = (roomData: any) => {
    const key = `${roomData.roomId}-${roomData.planId}-${roomData.adults}`;
    
    setSelectedRoomsByKey(prev => {
      const newState = { ...prev };
      if (roomData.quantity > 0) {
        newState[key] = roomData.quantity;
      } else {
        delete newState[key];
      }
      return newState;
    });

    if (onRoomSelect) {
      onRoomSelect(roomData);
    }
  };

  // Get selected quantity for a specific room/plan/adult combination
  const getSelectedQuantity = (roomId: number, planId: number, adults: number): number => {
    const key = `${roomId}-${planId}-${adults}`;
    return selectedRoomsByKey[key] || 0;
  };

  // Loading state
  if (isPricingLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <div className="animate-spin rounded-full w-10 h-10 border-b-4 border-orange-500"></div>
        <span className="text-sm text-gray-600 font-medium">Loading rooms...</span>
      </div>
    );
  }

  // No rooms available
  if (rooms.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">🏨</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Rooms Available</h3>
        <p className="text-gray-600">Room details are not currently available for this property.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
        <h2 className="text-base sm:text-lg font