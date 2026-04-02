"use client"

import { Button } from "@/components/ui/button"
import { Users, Bed, Maximize } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface HotelRoomsProps {
  hotelId: string
}

const HotelRooms = ({ hotelId }: HotelRoomsProps) => {
  const rooms = [
    {
      id: 1,
      name: "Standard Room",
      price: 189,
      originalPrice: 250,
      capacity: 2,
      beds: "1 King Bed",
      size: "25 sqm",
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Deluxe Suite",
      price: 289,
      originalPrice: 380,
      capacity: 4,
      beds: "1 King Bed + Sofa Bed",
      size: "45 sqm",
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Kitchenette", "Balcony"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Presidential Suite",
      price: 589,
      originalPrice: 750,
      capacity: 6,
      beds: "2 King Beds",
      size: "85 sqm",
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Full Kitchen", "Living Room", "Balcony"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const router = useRouter()

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>

      <div className="space-y-6">
        {rooms.map((room) => (
          <div key={room.id} className="border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                </div>
              </div>

              <div className="lg:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                    <div className="flex items-center space-x-4 text-gray-600 text-sm mb-3">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{room.capacity} guests</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{room.beds}</span>
                      </div>
                      <div className="flex items-center">
                        <Maximize className="w-4 h-4 mr-1" />
                        <span>{room.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {room.originalPrice > room.price && (
                      <span className="text-gray-500 line-through text-sm">${room.originalPrice}</span>
                    )}
                    <div className="text-2xl font-bold text-gray-900">${room.price}</div>
                    <span className="text-gray-600 text-sm">per night</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      const today = new Date()
                      const tomorrow = new Date(today)
                      tomorrow.setDate(tomorrow.getDate() + 1)

                      const searchParams = new URLSearchParams({
                        hotelId: hotelId,
                        roomId: room.id.toString(),
                        checkIn: today.toISOString().split("T")[0],
                        checkOut: tomorrow.toISOString().split("T")[0],
                        guests: room.capacity.toString(),
                      })
                      router.push(`/booking?${searchParams.toString()}`)
                    }}
                    className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-8 py-2 rounded-full"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HotelRooms
