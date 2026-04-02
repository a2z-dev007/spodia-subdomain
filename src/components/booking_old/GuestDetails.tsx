// "use client"
// import { useForm, useFieldArray } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useAppSelector, useAppDispatch } from "@/lib/hooks"
// import { updateBookingDetails, nextStep, previousStep } from "@/lib/features/booking/bookingSlice"
// import { guestDetailsSchema, type GuestDetailsFormData } from "@/lib/validations/booking"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { User, Mail, Phone, Plus, Trash2 } from "lucide-react"

// const GuestDetails = () => {
//   const dispatch = useAppDispatch()
//   const { currentBooking } = useAppSelector((state) => state.booking)
//   const { user } = useAppSelector((state) => state.auth)

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     watch,
//     setValue,
//   } = useForm<GuestDetailsFormData>({
//     resolver: zodResolver(guestDetailsSchema),
//     defaultValues: {
//       guests: [
//         {
//           firstName: user?.name.split(" ")[0] || "",
//           lastName: user?.name.split(" ")[1] || "",
//           email: user?.email || "",
//           phone: user?.phone || "",
//           isMainGuest: true,
//         },
//       ],
//       specialRequests: currentBooking?.specialRequests || "",
//     },
//   })

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "guests",
//   })

//   const watchedGuests = watch("guests")
//   const guestsNeeded = currentBooking?.hotelDetails?.guests || 1

//   const onSubmit = (data: GuestDetailsFormData) => {
//     dispatch(updateBookingDetails({ guestDetails: data.guests, specialRequests: data.specialRequests }))
//     dispatch(nextStep())
//   }

//   const handleBack = () => {
//     dispatch(previousStep())
//   }

//   const addGuest = () => {
//     append({
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       isMainGuest: false,
//     })
//   }

//   const removeGuest = (index: number) => {
//     if (fields.length > 1 && !watchedGuests[index]?.isMainGuest) {
//       remove(index)
//     }
//   }

//   const setMainGuest = (index: number) => {
//     fields.forEach((_, i) => {
//       setValue(`guests.${i}.isMainGuest`, i === index)
//     })
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Main Content */}
//       <div className="lg:col-span-2">
//         <div className="bg-white rounded-2xl p-6 shadow-lg">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Information</h2>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Guest Details */}
//             <div className="space-y-6">
//               {fields.map((field, index) => (
//                 <div key={field.id} className="border border-gray-200 rounded-xl p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       Guest {index + 1} {watchedGuests[index]?.isMainGuest && "(Main Guest)"}
//                     </h3>
//                     <div className="flex items-center space-x-2">
//                       {!watchedGuests[index]?.isMainGuest && (
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setMainGuest(index)}
//                           className="text-[#FF9530] border-[#FF9530] hover:bg-[#FF9530] hover:text-white"
//                         >
//                           Set as Main
//                         </Button>
//                       )}
//                       {fields.length > 1 && !watchedGuests[index]?.isMainGuest && (
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => removeGuest(index)}
//                           className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">First Name</label>
//                       <div className="relative">
//                         <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                         <Input
//                           {...register(`guests.${index}.firstName`)}
//                           placeholder="First name"
//                           className={`pl-10 h-12 ${errors.guests?.[index]?.firstName ? "border-red-500" : ""}`}
//                         />
//                       </div>
//                       {errors.guests?.[index]?.firstName && (
//                         <p className="text-red-500 text-xs">{errors.guests[index]?.firstName?.message}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">Last Name</label>
//                       <div className="relative">
//                         <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                         <Input
//                           {...register(`guests.${index}.lastName`)}
//                           placeholder="Last name"
//                           className={`pl-10 h-12 ${errors.guests?.[index]?.lastName ? "border-red-500" : ""}`}
//                         />
//                       </div>
//                       {errors.guests?.[index]?.lastName && (
//                         <p className="text-red-500 text-xs">{errors.guests[index]?.lastName?.message}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">Email</label>
//                       <div className="relative">
//                         <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                         <Input
//                           {...register(`guests.${index}.email`)}
//                           type="email"
//                           placeholder="Email address"
//                           className={`pl-10 h-12 ${errors.guests?.[index]?.email ? "border-red-500" : ""}`}
//                         />
//                       </div>
//                       {errors.guests?.[index]?.email && (
//                         <p className="text-red-500 text-xs">{errors.guests[index]?.email?.message}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">Phone</label>
//                       <div className="relative">
//                         <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                         <Input
//                           {...register(`guests.${index}.phone`)}
//                           type="tel"
//                           placeholder="Phone number"
//                           className={`pl-10 h-12 ${errors.guests?.[index]?.phone ? "border-red-500" : ""}`}
//                         />
//                       </div>
//                       {errors.guests?.[index]?.phone && (
//                         <p className="text-red-500 text-xs">{errors.guests[index]?.phone?.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {fields.length < guestsNeeded && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={addGuest}
//                   className="w-full border-dashed border-2 border-gray-300 hover:border-[#FF9530] hover:text-[#FF9530] py-6"
//                 >
//                   <Plus className="w-5 h-5 mr-2" />
//                   Add Another Guest
//                 </Button>
//               )}
//             </div>

//             {/* Special Requests */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700">Special Requests (Optional)</label>
//               <Textarea
//                 {...register("specialRequests")}
//                 placeholder="Any special requests or preferences..."
//                 className="min-h-24"
//               />
//               <p className="text-xs text-gray-500">
//                 Special requests cannot be guaranteed but the property will do their best to accommodate them.
//               </p>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center justify-between pt-6 border-t">
//               <Button type="button" variant="outline" onClick={handleBack} className="px-8">
//                 Back
//               </Button>
//               <Button type="submit" className="bg-[#FF9530] hover:bg-[#e8851c] text-white px-8">
//                 Continue to Payment
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Booking Summary Sidebar */}
//       <div className="lg:col-span-1">
//         <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
//           <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

//           {currentBooking?.hotelDetails && (
//             <>
//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">
//                     ${currentBooking.hotelDetails.basePrice} × {currentBooking.hotelDetails.nights} nights
//                   </span>
//                   <span className="font-medium">
//                     ${currentBooking.hotelDetails.basePrice * currentBooking.hotelDetails.nights}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Taxes & fees</span>
//                   <span className="font-medium">
//                     ${currentBooking.hotelDetails.taxes + currentBooking.hotelDetails.fees}
//                   </span>
//                 </div>
//                 <div className="border-t pt-4">
//                   <div className="flex justify-between">
//                     <span className="text-lg font-bold text-gray-900">Total</span>
//                     <span className="text-lg font-bold text-gray-900">${currentBooking.hotelDetails.totalPrice}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="text-center">
//                 <p className="text-xs text-gray-500">You won't be charged yet</p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default GuestDetails

export default function GuestDetails() {
  return <div>GuestDetails</div>
}