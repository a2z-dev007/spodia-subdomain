import { MapPin, Car, Plane, Train } from "lucide-react"

interface HotelLocationProps {
  hotelId: string
}

const HotelLocation = ({ hotelId }: HotelLocationProps) => {
  const nearbyAttractions = [
    { name: "Times Square", distance: "0.3 miles", walkTime: "5 min walk" },
    { name: "Central Park", distance: "0.8 miles", walkTime: "15 min walk" },
    { name: "Empire State Building", distance: "1.2 miles", walkTime: "20 min walk" },
    { name: "Broadway Theater District", distance: "0.4 miles", walkTime: "7 min walk" },
  ]

  const transportation = [
    { icon: Plane, name: "JFK Airport", distance: "18 miles", time: "45 min by car" },
    { icon: Plane, name: "LaGuardia Airport", distance: "12 miles", time: "35 min by car" },
    { icon: Train, name: "Penn Station", distance: "0.5 miles", time: "10 min walk" },
    { icon: Car, name: "Port Authority", distance: "0.2 miles", time: "5 min walk" },
  ]

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Location & Nearby</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Map Placeholder */}
        <div className="space-y-4">
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive Map</p>
              <p className="text-sm text-gray-500">123 Broadway, Manhattan, NY 10001</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
            <p className="text-gray-700">123 Broadway, Manhattan, New York, NY 10001</p>
          </div>
        </div>

        {/* Nearby Attractions & Transportation */}
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Nearby Attractions</h4>
            <div className="space-y-3">
              {nearbyAttractions.map((attraction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{attraction.name}</p>
                    <p className="text-sm text-gray-600">{attraction.walkTime}</p>
                  </div>
                  <span className="text-sm text-gray-500">{attraction.distance}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Transportation</h4>
            <div className="space-y-3">
              {transportation.map((transport, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <transport.icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{transport.name}</p>
                      <p className="text-sm text-gray-600">{transport.time}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{transport.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelLocation
