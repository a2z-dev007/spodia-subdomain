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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register("location")}
                placeholder="Where are you going?"
                className={`pl-10 h-12 border-gray-200 w-full rounded-lg ${errors.location ? "border-red-500" : ""}`}
              />
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Check In</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register("checkIn")}
                type="date"
                className={`pl-10 h-12 border-gray-200 w-full rounded-lg ${errors.checkIn ? "border-red-500" : ""}`}
              />
            </div>
            {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Check Out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register("checkOut")}
                type="date"
                className={`pl-10 h-12 border-gray-200 w-full rounded-lg ${errors.checkOut ? "border-red-500" : ""}`}
              />
            </div>
            {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut.message}</p>}
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register("guests")}
                placeholder="2 adults, 2 children"
                className={`pl-10 h-12 border-gray-200 w-full rounded-lg ${errors.guests ? "border-red-500" : ""}`}
              />
            </div>
            {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests.message}</p>}
          </div>

          <div className="flex items-center md:items-center w-full md:w-auto">
            <Button
              type="submit"
              className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-8 h-12 rounded-full text-lg font-medium w-full md:w-auto flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Hotels
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default HotelSearch
