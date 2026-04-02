  // "use client"

  // import { useAppSelector, useAppDispatch } from "@/lib/hooks"
  // // import { nextStep } from "@/lib/features/booking/bookingSlice"
  // import { Button } from "@/components/ui/button"
  // import { Calendar, Users, MapPin, Star, Wifi, Car, Utensils, Dumbbell } from "lucide-react"
  // import Image from "next/image"

  // const BookingDetails = () => {
  //   const dispatch = useAppDispatch()
  //   const { currentBooking } = useAppSelector((state) => state.booking)

  //   if (!currentBooking?.hotelDetails) return null

  //   const { hotelDetails } = currentBooking

  //   const amenities = [
  //     { icon: Wifi, label: "Free WiFi" },
  //     { icon: Car, label: "Free Parking" },
  //     { icon: Utensils, label: "Restaurant" },
  //     { icon: Dumbbell, label: "Fitness Center" },
  //   ]

  //   const handleContinue = () => {
  //     // dispatch(nextStep())
  //   }

  //   return (
  //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  //       {/* Main Content */}
  //       <div className="lg:col-span-2 space-y-6">
  //         {/* Hotel Information */}
  //         <div className="bg-white rounded-2xl p-6 shadow-lg">
  //           <div className="flex items-start space-x-4">
  //             <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
  //               <Image
  //                 src="/placeholder.svg?height=96&width=96"
  //                 alt={hotelDetails.hotelName}
  //                 fill
  //                 className="object-cover"
  //               />
  //             </div>
  //             <div className="flex-1">
  //               <h2 className="text-2xl font-bold text-gray-900 mb-2">{hotelDetails.hotelName}</h2>
  //               <div className="flex items-center text-gray-600 mb-3">
  //                 <MapPin className="w-4 h-4 mr-1" />
  //                 <span>Manhattan, New York</span>
  //               </div>
  //               <div className="flex items-center mb-4">
  //                 <div className="flex items-center">
  //                   {[...Array(5)].map((_, i) => (
  //                     <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
  //                   ))}
  //                 </div>
  //                 <span className="ml-2 text-sm text-gray-600">(1,247 reviews)</span>
  //               </div>
  //               <div className="flex flex-wrap gap-3">
  //                 {amenities.map((amenity, index) => (
  //                   <div key={index} className="flex items-center space-x-1 text-sm text-gray-600">
  //                     <amenity.icon className="w-4 h-4" />
  //                     <span>{amenity.label}</span>
  //                   </div>
  //                 ))}
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Room Information */}
  //         <div className="bg-white rounded-2xl p-6 shadow-lg">
  //           <h3 className="text-xl font-bold text-gray-900 mb-4">Room Details</h3>
  //           <div className="flex items-start space-x-4">
  //             <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
  //               <Image
  //                 src="/placeholder.svg?height=64&width=80"
  //                 alt={hotelDetails.roomName}
  //                 fill
  //                 className="object-cover"
  //               />
  //             </div>
  //             <div className="flex-1">
  //               <h4 className="font-semibold text-gray-900 mb-2">{hotelDetails.roomName}</h4>
  //               <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
  //                 <div className="flex items-center">
  //                   <Users className="w-4 h-4 mr-1" />
  //                   <span>{hotelDetails.guests} guests</span>
  //                 </div>
  //                 <div className="flex items-center">
  //                   <Calendar className="w-4 h-4 mr-1" />
  //                   <span>{hotelDetails.nights} nights</span>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Booking Dates */}
  //         <div className="bg-white rounded-2xl p-6 shadow-lg">
  //           <h3 className="text-xl font-bold text-gray-900 mb-4">Stay Details</h3>
  //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //             <div>
  //               <label className="text-sm font-medium text-gray-700 block mb-2">Check-in</label>
  //               <div className="p-3 bg-gray-50 rounded-lg">
  //                 <p className="font-semibold text-gray-900">
  //                   {new Date(hotelDetails.checkIn).toLocaleDateString("en-US", {
  //                     weekday: "short",
  //                     month: "short",
  //                     day: "numeric",
  //                   })}
  //                 </p>
  //                 <p className="text-sm text-gray-600">After 3:00 PM</p>
  //               </div>
  //             </div>
  //             <div>
  //               <label className="text-sm font-medium text-gray-700 block mb-2">Check-out</label>
  //               <div className="p-3 bg-gray-50 rounded-lg">
  //                 <p className="font-semibold text-gray-900">
  //                   {new Date(hotelDetails.checkOut).toLocaleDateString("en-US", {
  //                     weekday: "short",
  //                     month: "short",
  //                     day: "numeric",
  //                   })}
  //                 </p>
  //                 <p className="text-sm text-gray-600">Before 11:00 AM</p>
  //               </div>
  //             </div>
  //             <div>
  //               <label className="text-sm font-medium text-gray-700 block mb-2">Duration</label>
  //               <div className="p-3 bg-gray-50 rounded-lg">
  //                 <p className="font-semibold text-gray-900">{hotelDetails.nights} nights</p>
  //                 <p className="text-sm text-gray-600">{hotelDetails.guests} guests</p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Cancellation Policy */}
  //         <div className="bg-white rounded-2xl p-6 shadow-lg">
  //           <h3 className="text-xl font-bold text-gray-900 mb-4">Cancellation Policy</h3>
  //           <div className="space-y-3 text-sm text-gray-600">
  //             <p>✅ Free cancellation until 24 hours before check-in</p>
  //             <p>⚠️ 50% refund if cancelled within 24 hours of check-in</p>
  //             <p>❌ No refund for no-shows</p>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Booking Summary Sidebar */}
  //       <div className="lg:col-span-1">
  //         <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
  //           <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

  //           <div className="space-y-4 mb-6">
  //             <div className="flex justify-between">
  //               <span className="text-gray-600">
  //                 ${hotelDetails.basePrice} × {hotelDetails.nights} nights
  //               </span>
  //               <span className="font-medium">${hotelDetails.basePrice * hotelDetails.nights}</span>
  //             </div>
  //             <div className="flex justify-between">
  //               <span className="text-gray-600">Taxes & fees</span>
  //               <span className="font-medium">${hotelDetails.taxes + hotelDetails.fees}</span>
  //             </div>
  //             <div className="border-t pt-4">
  //               <div className="flex justify-between">
  //                 <span className="text-lg font-bold text-gray-900">Total</span>
  //                 <span className="text-lg font-bold text-gray-900">${hotelDetails.totalPrice}</span>
  //               </div>
  //             </div>
  //           </div>

  //           <Button
  //             onClick={handleContinue}
  //             className="w-full bg-[#FF9530] hover:bg-[#e8851c] text-white py-3 rounded-full"
  //           >
  //             Continue to Guest Details
  //           </Button>

  //           <div className="mt-4 text-center">
  //             <p className="text-xs text-gray-500">You won't be charged yet</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // export default BookingDetails

  export default function BookingDetails() {
    return <div>BookingDetails</div>
  }