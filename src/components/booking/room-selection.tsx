'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Bed, Check, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock rooms data
const roomsData = [
  {
    id: '1',
    name: 'Deluxe Ocean View Room',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    bedType: 'King Bed',
    capacity: '2 Adults',
    size: '35 sqm',
    features: ['Ocean View', 'Balcony', 'Mini Bar'],
    price: 148.25,
    available: 3,
  },
  {
    id: '2',
    name: 'Executive Suite',
    image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    bedType: 'King Bed + Sofa Bed',
    capacity: '4 Adults',
    size: '65 sqm',
    features: ['City View', 'Living Area', 'Kitchenette'],
    price: 285.75,
    available: 2,
  },
];

export function RoomSelection() {
  const router = useRouter();
  const [selectedRooms, setSelectedRooms] = useState<{[key: string]: number}>({});

  const updateRoomQuantity = (roomId: string, quantity: number) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedRooms };
      delete newSelected[roomId];
      setSelectedRooms(newSelected);
    } else {
      setSelectedRooms(prev => ({ ...prev, [roomId]: quantity }));
    }
  };

  const getTotalPrice = () => {
    return Object.entries(selectedRooms).reduce((total, [roomId, quantity]) => {
      const room = roomsData.find(r => r.id === roomId);
      return total + (room ? room.price * quantity * 3 : 0); // 3 nights
    }, 0);
  };

  const getTotalRooms = () => {
    return Object.values(selectedRooms).reduce((total, quantity) => total + quantity, 0);
  };

  const handleContinue = () => {
    if (getTotalRooms() > 0) {
      router.push('/booking/guest-info');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Your Rooms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {roomsData.map((room) => (
              <div key={room.id} className="border rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900">{room.name}</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <span>{room.bedType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{room.capacity}</span>
                      </div>
                      <div className="text-gray-600">{room.size}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        ${room.price}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">per night</div>
                      <div className="text-xs text-green-600 mb-4">
                        {room.available} rooms available
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateRoomQuantity(room.id, (selectedRooms[room.id] || 0) - 1)}
                        disabled={!selectedRooms[room.id]}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-8 text-center font-medium">
                        {selectedRooms[room.id] || 0}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateRoomQuantity(room.id, (selectedRooms[room.id] || 0) + 1)}
                        disabled={(selectedRooms[room.id] || 0) >= room.available}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(selectedRooms).map(([roomId, quantity]) => {
              const room = roomsData.find(r => r.id === roomId);
              if (!room) return null;
              
              return (
                <div key={roomId} className="flex justify-between">
                  <div>
                    <div className="font-medium">{room.name}</div>
                    <div className="text-sm text-gray-600">{quantity} room(s) × 3 nights</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${(room.price * quantity * 3).toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
            
            {getTotalRooms() > 0 && (
              <>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Continue to Guest Info
                </Button>
              </>
            )}
            
            {getTotalRooms() === 0 && (
              <div className="text-center text-gray-500 py-8">
                Select rooms to continue
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}