import { Star, MapPin, Wifi, Car, Utensils, Dumbbell, Waves, Flower2 } from "lucide-react"

interface HotelDetailsProps {
  hotelId: string
}

const HotelDetails = ({ hotelId }: HotelDetailsProps) => {
  const amenities = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Car, label: "Free Parking" },
    { icon: Utensils, label: "Restaurant" },
    { icon: Dumbbell, label: "Fitness Center" },
    { icon: Waves, label: "Swimming Pool" },
    { icon: Flower2, label: "Spa & Wellness" },
  ]

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Grand Plaza Hotel & Spa</h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-600">(1,247 reviews)</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-5 h-5 mr-2" />
          <span>123 Broadway, Manhattan, New York, NY 10001</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About This Hotel</h2>
        <p className="text-gray-600 leading-relaxed">
          Experience luxury at its finest in the heart of Manhattan. Our hotel offers world-class amenities, exceptional
          service, and stunning views of the city skyline. Whether you're here for business or leisure, we provide the
          perfect blend of comfort and sophistication to make your stay unforgettable.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <amenity.icon className="w-5 h-5 text-[#FF9530]" />
              <span className="text-gray-700">{amenity.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HotelDetails
