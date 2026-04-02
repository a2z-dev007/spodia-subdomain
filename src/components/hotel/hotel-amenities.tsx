import { 
  Wifi, 
  Waves, 
  Car, 
  Snowflake, 
  UtensilsCrossed, 
  Flower, 
  Dumbbell, 
  Palmtree,
  Bell,
  Users,
  Shirt,
  Plane
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IMAGE_BASE_URL } from '@/lib/api/apiClient';
import Image from 'next/image';

const iconMap = {
  Wifi,
  Waves,
  Car,
  Snowflake,
  UtensilsCrossed,
  Flower,
  Dumbbell,
  Palmtree,
  Bell,
  Users,
  Shirt,
  Plane,
};

interface Amenity {
  name: string;
  icon: keyof typeof iconMap;
  image?: string;
}

interface HotelAmenitiesProps {
  amenities: Amenity[];
}

export function HotelAmenities({ amenities }: HotelAmenitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Hotel Amenities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities.map((amenity, index) => {
            const IconComponent = iconMap[amenity.icon];
            return (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  {amenity.image ? (
                    <div className="w-4 h-4 flex-shrink-0">
                      <Image
                        src={`${IMAGE_BASE_URL}${amenity.image}`}
                        alt={amenity.name}
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          // Fallback to static icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                              parent.innerHTML = '<svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>';
                          }
                        }}
                      />
                    </div>
                  ) : IconComponent ? (
                    <IconComponent className="h-4 w-4 text-primary" />
                  ) : (
                    <Wifi className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {amenity.name}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}