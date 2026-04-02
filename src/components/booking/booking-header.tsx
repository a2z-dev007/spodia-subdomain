import { Calendar, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Mock booking data
const bookingData = {
  hotel: {
    name: 'Fairmont Resort, Dubai Marina',
    location: 'Dubai Marina, Dubai, UAE',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  },
  dates: {
    checkIn: '15 Jan 2024',
    checkOut: '18 Jan 2024',
    nights: 3,
  },
  guests: {
    adults: 2,
    children: 0,
  },
};

export function BookingHeader() {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <img
            src={bookingData.hotel.image}
            alt={bookingData.hotel.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {bookingData.hotel.name}
            </h2>
            <div className="flex items-center space-x-1 text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{bookingData.hotel.location}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">{bookingData.dates.checkIn} - {bookingData.dates.checkOut}</div>
                <div className="text-gray-500">{bookingData.dates.nights} nights</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">{bookingData.guests.adults} Adults</div>
                {bookingData.guests.children > 0 && (
                  <div className="text-gray-500">{bookingData.guests.children} Children</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}