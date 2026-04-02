// "use client"

// import { useState } from "react"
// import { useAppSelector, useAppDispatch } from "@/lib/hooks"
// // import { addBooking, setCurrentStep, nextStep, previousStep } from "@/lib/features/booking/bookingSlice"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { CheckCircle, CreditCard, User, FileText } from "lucide-react"
// import { useRouter } from "next/navigation"

// export default function BookingFlow() {
//   const dispatch = useAppDispatch()
//   const router = useRouter()
//   const { currentBooking, isLoading } = useAppSelector((state) => state.booking)
//   const { user } = useAppSelector((state) => state.auth)

//   const [guestInfo, setGuestInfo] = useState({
//     firstName: user?.name?.split(" ")[0] || "",
//     lastName: user?.name?.split(" ")[1] || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//   })

//   const [paymentInfo, setPaymentInfo] = useState({
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     cardholderName: "",
//   })

//   const [specialRequests, setSpecialRequests] = useState("")

//   const steps = [
//     { number: 1, title: "Review Details", icon: FileText },
//     { number: 2, title: "Guest Information", icon: User },
//     { number: 3, title: "Payment", icon: CreditCard },
//     { number: 4, title: "Confirmation", icon: CheckCircle },
//   ]

//   const handleNext = () => {
//     if (currentStep < 4) {
//       dispatch(nextStep())
//     }
//   }

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       dispatch(previousStep())
//     }
//   }

//   const handleCompleteBooking = () => {
//     const booking = {
//       hotelId: currentBooking?.hotelId || "demo-hotel",
//       guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
//       total: currentBooking?.totalPrice || 299,
//       bookingDate: new Date().toISOString(),
//       confirmationNumber: `SPD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
//     }

//     // dispatch(addBooking(booking))
//     // dispatch(setCurrentStep(4))
//   }

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Review Your Booking</h2>
//             {currentBooking ? (
//               <div className="space-y-4">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-semibold text-lg">{currentBooking.hotelName}</h3>
//                   <p className="text-gray-600">{currentBooking.roomType}</p>
//                   <div className="mt-2 space-y-1">
//                     <p>
//                       <span className="font-medium">Check-in:</span>{" "}
//                       {new Date(currentBooking.checkIn).toLocaleDateString()}
//                     </p>
//                     <p>
//                       <span className="font-medium">Check-out:</span>{" "}
//                       {new Date(currentBooking.checkOut).toLocaleDateString()}
//                     </p>
//                     <p>
//                       <span className="font-medium">Guests:</span> {currentBooking.guests}
//                     </p>
//                     {/*     <p>
//                       <span className="font-medium">Rooms:</span> {currentBooking.rooms}
//                     </p> */}
//                   </div>
//                 </div>
//                 <div className="border-t pt-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-lg font-semibold">Total:</span>
//                     <span className="text-2xl font-bold text-[#078ED8]">${currentBooking.totalPrice}</span>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-gray-50 p-8 rounded-lg text-center">
//                 <h3 className="font-semibold text-lg mb-2">Demo Booking</h3>
//                 <p className="text-gray-600 mb-4">Grand Plaza Hotel - Deluxe Room</p>
//                 <div className="space-y-1 text-sm text-gray-600">
//                   <p>Check-in: {new Date().toLocaleDateString()}</p>
//                   <p>Check-out: {new Date(Date.now() + 86400000).toLocaleDateString()}</p>
//                   <p>Guests: 2</p>
//                   <p>Rooms: 1</p>
//                 </div>
//                 <div className="mt-4 pt-4 border-t">
//                   <div className="flex justify-between items-center">
//                     <span className="font-semibold">Total:</span>
//                     <span className="text-xl font-bold text-[#078ED8]">$299</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )

//       case 2:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Guest Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="firstName">First Name</Label>
//                 <Input
//                   id="firstName"
//                   value={guestInfo.firstName}
//                   onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="lastName">Last Name</Label>
//                 <Input
//                   id="lastName"
//                   value={guestInfo.lastName}
//                   onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={guestInfo.email}
//                   onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   value={guestInfo.phone}
//                   onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="requests">Special Requests (Optional)</Label>
//               <Textarea
//                 id="requests"
//                 value={specialRequests}
//                 onChange={(e) => setSpecialRequests(e.target.value)}
//                 placeholder="Any special requests or preferences..."
//                 rows={3}
//               />
//             </div>
//           </div>
//         )

//       case 3:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Payment Information</h2>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="cardNumber">Card Number</Label>
//                 <Input
//                   id="cardNumber"
//                   placeholder="1234 5678 9012 3456"
//                   value={paymentInfo.cardNumber}
//                   onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="expiryDate">Expiry Date</Label>
//                   <Input
//                     id="expiryDate"
//                     placeholder="MM/YY"
//                     value={paymentInfo.expiryDate}
//                     onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="cvv">CVV</Label>
//                   <Input
//                     id="cvv"
//                     placeholder="123"
//                     value={paymentInfo.cvv}
//                     onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
//                     required
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="cardholderName">Cardholder Name</Label>
//                 <Input
//                   id="cardholderName"
//                   value={paymentInfo.cardholderName}
//                   onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
//                   required
//                 />
//               </div>
//             </div>
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 🔒 Your payment information is secure and encrypted. This is a demo - no actual payment will be
//                 processed.
//               </p>
//             </div>
//           </div>
//         )

//       case 4:
//         return (
//           <div className="space-y-6 text-center">
//             <div className="text-green-600 mb-4">
//               <CheckCircle className="w-16 h-16 mx-auto" />
//             </div>
//             <h2 className="text-2xl font-bold text-green-600">Booking Confirmed!</h2>
//             <div className="bg-green-50 p-6 rounded-lg">
//               <p className="text-lg font-semibold mb-2">Confirmation Number</p>
//               <p className="text-2xl font-bold text-green-600">
//                 SPD{Math.random().toString(36).substr(2, 9).toUpperCase()}
//               </p>
//             </div>
//             <div className="space-y-2 text-gray-600">
//               <p>✅ Booking confirmation sent to {guestInfo.email}</p>
//               <p>✅ Hotel has been notified</p>
//               <p>✅ You can manage your booking in your dashboard</p>
//             </div>
//             <div className="flex gap-4 justify-center">
//               <Button onClick={() => router.push("/dashboard")} variant="outline">
//                 View Dashboard
//               </Button>
//               <Button onClick={() => router.push("/hotels")} className="bg-[#078ED8] hover:bg-[#0679b8]">
//                 Book Another Hotel
//               </Button>
//             </div>
//           </div>
//         )

//       default:
//         return null
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto py-8">
//       {/* Progress Steps */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           {steps.map((step, index) => (
//             <div key={step.number} className="flex items-center">
//               <div
//                 className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
//                   currentStep >= step.number
//                     ? "bg-[#078ED8] border-[#078ED8] text-white"
//                     : "border-gray-300 text-gray-500"
//                 }`}
//               >
//                 <step.icon className="w-5 h-5" />
//               </div>
//               <div className="ml-3 hidden md:block">
//                 <p className={`text-sm font-medium ${currentStep >= step.number ? "text-[#078ED8]" : "text-gray-500"}`}>
//                   {step.title}
//                 </p>
//               </div>
//               {index < steps.length - 1 && (
//                 <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? "bg-[#078ED8]" : "bg-gray-300"}`} />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Step Content */}
//       <Card>
//         <CardContent className="p-8">{renderStepContent()}</CardContent>
//       </Card>

//       {/* Navigation Buttons */}
//       {currentStep < 4 && (
//         <div className="flex justify-between mt-8">
//           <Button onClick={handlePrevious} disabled={currentStep === 1} variant="outline">
//             Previous
//           </Button>
//           <Button
//             onClick={currentStep === 3 ? handleCompleteBooking : handleNext}
//             disabled={isLoading}
//             className="bg-[#078ED8] hover:bg-[#0679b8]"
//           >
//             {currentStep === 3 ? "Complete Booking" : "Next"}
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }

export default function BookingFlow() {
    return <div>BookingFlow</div>
}