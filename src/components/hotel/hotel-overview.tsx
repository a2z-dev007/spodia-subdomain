import { Clock, MapPin, Wifi, Car, UtensilsCrossed, Waves } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Hotel {
  name: string;
  description: string;
  highlights: string[];
  checkIn: string;
  checkOut: string;
  policies: {
    cancellation: string;
    children: string;
    pets: string;
    smoking: string;
  };
}

interface HotelOverviewProps {
  hotel: Hotel;
}

export function HotelOverview({ hotel }: HotelOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Hotel Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <p className="text-gray-600 leading-relaxed">
            {hotel.description}
          </p>
        </div>
        
        {/* Highlights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Hotel Highlights
          </h3>
          <ul className="space-y-2">
            {hotel.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-600">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Check-in & Check-out
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Check-in: {hotel.checkIn}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Check-out: {hotel.checkOut}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Hotel Policies
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">{hotel.policies.cancellation}</p>
              <p className="text-gray-600">{hotel.policies.children}</p>
              <p className="text-gray-600">{hotel.policies.pets}</p>
              <p className="text-gray-600">{hotel.policies.smoking}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}