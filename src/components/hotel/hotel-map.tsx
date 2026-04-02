'use client';

import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Hotel {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface HotelMapProps {
  hotel: Hotel;
}

export function HotelMap({ hotel }: HotelMapProps) {
  // Mock nearby attractions
  const nearbyAttractions = [
    { name: 'Dubai Marina Mall', distance: '0.2 km', type: 'Shopping' },
    { name: 'Marina Beach', distance: '0.1 km', type: 'Beach' },
    { name: 'Dubai Marina Walk', distance: '0.3 km', type: 'Entertainment' },
    { name: 'Jumeirah Beach Residence', distance: '1.2 km', type: 'Beach' },
    { name: 'The Walk at JBR', distance: '1.5 km', type: 'Shopping' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Location & Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address */}
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{hotel.name}</h3>
            <p className="text-gray-600">{hotel.address}</p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-gray-600">Interactive Map</p>
              <p className="text-sm text-gray-500">
                Lat: {hotel.coordinates.lat}, Lng: {hotel.coordinates.lng}
              </p>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button size="sm" variant="outline" className="bg-white">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Nearby Attractions */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Nearby Attractions</h3>
          <div className="space-y-3">
            {nearbyAttractions.map((attraction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{attraction.name}</h4>
                  <p className="text-sm text-gray-600">{attraction.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{attraction.distance}</p>
                  <p className="text-xs text-gray-500">walking</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-gray-900">Hotel Phone</p>
              <p className="text-gray-600">+971 4 123 4567</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-gray-900">Front Desk</p>
              <p className="text-gray-600">24/7 Available</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}