'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Bed, Check, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IMAGE_BASE_URL } from '@/lib/api/apiClient';
import Image from 'next/image';

interface RoomData {
  id: number;
  room_name: string;
  costume_room_name: string;
  description: string;
  bed_type: string;
  base_adults: number;
  maximum_adults: number;
  maximum_children: number;
  maximum_occupancy: number;
  dimensions: string;
  no_of_beds: number;
  extra_bed_allowed: boolean;
  images: Array<{ file: string; cover_photo: boolean }>;
  facilitiesDetails: Array<{ name: string; image: string }>;
  plans: Array<{
    id: number;
    plan_name: string;
    plan_items: Array<{ name: string }>;
    sbr_rate?: number | null;
    dbr_rate?: number | null;
    extra_bed_price?: number | null;
  }>;
  ep_rate: number | null;
  cp_rate: number | null;
  map_rate: number | null;
  ap_rate: number | null;
}

interface RoomsAvailableProps {
  hotelId: string;
}

export function RoomsAvailable({ hotelId }: RoomsAvailableProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState<{ [key: number]: { adults: number; plan: string } }>({});

  useEffect(() => {
    // Fetch hotel details from API
    const fetchRooms = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/hotels/${hotelId}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.listing_detail?.rooms) {
          setRooms(data.listing_detail.rooms);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId]);

  const toggleRoomSelection = (roomId: number, adults: number, plan: string) => {
    setSelectedRooms(prev => {
      const newSelection = { ...prev };
      if (newSelection[roomId]) {
        delete newSelection[roomId];
      } else {
        newSelection[roomId] = { adults, plan };
      }
      return newSelection;
    });
  };

  const handleContinueToBook = () => {
    if (Object.keys(selectedRooms).length > 0) {
      router.push(`/booking/select-room?hotel=${hotelId}`);
    }
  };

  // Generate adult options based on base_adults + maximum_occupancy
  const generateAdultOptions = (baseAdults: number, maximumOccupancy: number) => {
    const options = [];
    const totalMaxAdults = baseAdults + maximumOccupancy;
    
    // Start from base_adults (e.g., 1 for SBR, 2 for DBR)
    for (let i = baseAdults; i <= totalMaxAdults; i++) {
      options.push(i);
    }
    return options;
  };

  // Calculate price based on adults, considering SBR/DBR and extra bed pricing
  const calculatePrice = (
    plan: any,
    adults: number,
    baseAdults: number,
    extraBedAllowed: boolean
  ) => {
    const sbrRate = plan.sbr_rate || 0;
    const dbrRate = plan.dbr_rate || 0;
    const extraBedPrice = plan.extra_bed_price || 1000; // Default to 1000 if not specified
    
    // Determine base rate
    let baseRate = 0;
    let baseAdultsIncluded = baseAdults;
    
    // If DBR is available and adults >= 2, use DBR (covers 2 adults)
    if (dbrRate > 0 && adults >= 2) {
      baseRate = dbrRate;
      baseAdultsIncluded = 2;
    } 
    // Otherwise use SBR if available (covers 1 adult)
    else if (sbrRate > 0) {
      baseRate = sbrRate;
      baseAdultsIncluded = 1;
    }
    // Fallback to any available rate
    else {
      baseRate = dbrRate || sbrRate || 0;
      baseAdultsIncluded = baseAdults;
    }
    
    // Calculate extra adults beyond base
    const extraAdults = Math.max(0, adults - baseAdultsIncluded);
    
    // Calculate total price
    let totalPrice = baseRate;
    
    // Add extra bed charges if extra adults exist and extra bed is allowed
    if (extraAdults > 0 && extraBedAllowed) {
      totalPrice += extraAdults * extraBedPrice;
    }
    
    return totalPrice;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Available Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading rooms...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Available Rooms
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rooms.map((room) => {
          const coverImage = room.images.find(img => img.cover_photo)?.file || room.images[0]?.file;
          const adultOptions = generateAdultOptions(room.base_adults, room.maximum_occupancy);

          return (
            <div
              key={room.id}
              className="border rounded-xl p-6 border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Room Image */}
                <div className="lg:col-span-1">
                  <div className="relative">
                    {coverImage && (
                      <img
                        src={coverImage}
                        alt={room.room_name}
                        className="w-full h-48 lg:h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>

                {/* Room Details */}
                <div className="lg:col-span-3 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {room.costume_room_name || room.room_name}
                    </h3>
                    {room.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {room.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Bed className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{room.bed_type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Max {room.base_adults + room.maximum_occupancy} Adults
                      </span>
                    </div>
                    <div className="text-gray-600">{room.dimensions} sq ft</div>
                  </div>

                  {/* Amenities */}
                  {room.facilitiesDetails && room.facilitiesDetails.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {room.facilitiesDetails.slice(0, 6).map((facility, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            {facility.image ? (
                              <div className="w-3 h-3 flex-shrink-0">
                                <Image
                                  src={`${IMAGE_BASE_URL}${facility.image}`}
                                  alt={facility.name}
                                  width={12}
                                  height={12}
                                  className="w-3 h-3 object-contain"
                                  onError={(e) => {
                                    // Fallback to check icon if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                        parent.innerHTML = '<svg class="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <Check className="h-3 w-3 text-green-500" />
                            )}
                            <span className="text-sm text-gray-600">{facility.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meal Plans with Adult Selection */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Select Meal Plan & Guests</h4>
                    
                    {room.plans.map((plan, planIndex) => (
                      <div key={planIndex} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <Badge className="bg-blue-600 text-white mb-2">
                              {plan.plan_name}
                            </Badge>
                            <div className="text-sm text-gray-600">
                              {plan.plan_items.map(item => item.name).join(', ')}
                            </div>
                          </div>
                        </div>

                        {/* Adult Selection Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-2">ADULTS</th>
                                <th className="text-left py-2 px-2">PRICE/NIGHT</th>
                                <th className="text-right py-2 px-2">SELECT ROOM</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adultOptions.map((adultCount) => {
                                const price = calculatePrice(
                                  plan,
                                  adultCount,
                                  room.base_adults,
                                  room.extra_bed_allowed
                                );
                                const isSelected = selectedRooms[room.id]?.adults === adultCount && 
                                                 selectedRooms[room.id]?.plan === plan.plan_name;

                                // Only show rows where price is available
                                if (price === 0) return null;

                                return (
                                  <tr key={adultCount} className="border-b last:border-0">
                                    <td className="py-3 px-2">
                                      <div className="flex items-center space-x-1">
                                        {Array.from({ length: adultCount }).map((_, i) => (
                                          <Users key={i} className="h-4 w-4 text-gray-600" />
                                        ))}
                                      </div>
                                    </td>
                                    <td className="py-3 px-2">
                                      <div className="font-bold text-lg text-gray-900">
                                        ₹{price.toLocaleString('en-IN')}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        +₹{Math.round(price * 0.12).toLocaleString('en-IN')} Taxes & Fees
                                      </div>
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                      <Button
                                        onClick={() => toggleRoomSelection(room.id, adultCount, plan.plan_name)}
                                        className={`${
                                          isSelected
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-orange-500 hover:bg-orange-600'
                                        }`}
                                      >
                                        {isSelected ? 'Selected' : 'Select'}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>

                  {room.extra_bed_allowed && (
                    <div className="text-sm text-gray-600">
                      <Check className="inline h-4 w-4 text-green-500 mr-1" />
                      Extra bed available on request
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {Object.keys(selectedRooms).length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">
                  {Object.keys(selectedRooms).length} Room{Object.keys(selectedRooms).length > 1 ? 's' : ''} Selected
                </h3>
                <p className="text-gray-600">Ready to proceed with booking</p>
              </div>
              <Button 
                onClick={handleContinueToBook}
                className="bg-primary hover:bg-primary/90"
              >
                Continue to Book
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}