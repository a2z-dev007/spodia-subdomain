"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch } from "@/lib/hooks"
import { setSearchFilters, searchHotels } from "@/lib/features/hotels/hotelSlice"
import { hotelSearchSchema, type HotelSearchFormData } from "@/lib/validations/hotel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, Users, Search } from "lucide-react"

const HotelSearch = () => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HotelSearchFormData>({
    resolver: zodResolver(hotelSearchSchema),
    defaultValues: {
      location: "",
      checkIn: "",
      checkOut: "",
      guests: "",
    },
  })

  const onSubmit = (data: HotelSearchFormData) => {
    dispatch(
      setSearchFilters({
        location: data.location,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
      }),
    )
    dispatch(searchHotels())
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("location")}
                placeholder="Where are you going?"
                className={`pl-10 h-12 border-gray-200 ${errors.location ? "border-red-500" : ""}`}
              />
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Check In</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("checkIn")}
                type="date"
                className={`pl-10 h-12 border-gray-200 ${errors.checkIn ? "border-red-500" : ""}`}
              />
            </div>
            {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Check Out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("checkOut")}
                type="date"
                className={`pl-10 h-12 border-gray-200 ${errors.checkOut ? "border-red-500" : ""}`}
              />
            </div>
            {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("guests")}
                placeholder="2 adults, 2 children"
                className={`pl-10 h-12 border-gray-200 ${errors.guests ? "border-red-500" : ""}`}
              />
            </div>
            {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests.message}</p>}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-8 py-3 rounded-full text-lg font-medium"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Hotels
          </Button>
        </div>
      </form>
    </div>
  )
}

export default HotelSearch
