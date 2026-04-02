'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Star, Shield, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviews: number;
}

interface BookingSummaryCardProps {
  hotel: Hotel;
}

export function BookingSummaryCard({ hotel }: BookingSummaryCardProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('2024-01-15');
  const [checkOut, setCheckOut] = useState('2024-01-18');
  const [guests, setGuests] = useState({ adults: 2, children: 0 });

  // Mock pricing calculation
  const nights = 3;
  const roomPrice = 148.25;
  const subtotal = roomPrice * nights;
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  const handleReserveNow = () => {
    // Navigate to room selection page
    router.push(`/booking/select-room?hotel=${hotel.id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${guests.adults}&children=${guests.children}`);
  };

  return (
    <div className="sticky top-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Book Your Stay
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hotel Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{hotel.name}</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{hotel.rating}</span>
              </div>
              <span className="text-gray-500 text-sm">({hotel.reviews} reviews)</span>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="checkin" className="text-sm font-medium">Check-in</Label>
                <Input
                  id="checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="checkout" className="text-sm font-medium">Check-out</Label>
                <Input
                  id="checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Guests</Label>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{guests.adults} adults</span>
                  {guests.children > 0 && (
                    <span className="text-sm">, {guests.children} children</span>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">${roomPrice} × {nights} nights</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes & fees</span>
              <span className="font-medium">${taxes.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Booking Button */}
          <Button 
            onClick={handleReserveNow}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Reserve Now
          </Button>

          {/* Trust Indicators */}
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Free cancellation until 24 hours before check-in</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>No payment needed today</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure booking with SSL encryption</span>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center text-sm text-gray-600">
            <p>Need help? Call us at</p>
            <p className="font-medium text-primary">+918800842084</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}