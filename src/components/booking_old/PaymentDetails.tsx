"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingDetails, previousStep, processPayment, createBooking } from "@/lib/features/booking/bookingSlice"
import { paymentDetailsSchema, type PaymentDetailsFormData } from "@/lib/validations/booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Lock, MapPin, Shield } from "lucide-react"
import { toast } from "react-toastify"

const PaymentDetails = () => {
  const dispatch = useAppDispatch()
  const { currentBooking, paymentProcessing } = useAppSelector((state) => state?.booking ?? { currentBooking: null, paymentProcessing: false })
  const { user } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentDetailsFormData>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      billingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
    },
  })

  const onSubmit = async (data: PaymentDetailsFormData) => {
    if (!agreeToTerms) {
      toast.warning("Please agree to the terms and conditions")
      return
    }

    try {
      // Process payment
      const paymentResult = await dispatch(processPayment(data))

      if (processPayment.fulfilled.match(paymentResult)) {
        // Update booking with payment details
        dispatch(updateBookingDetails({ paymentDetails: data }))

        // Create the booking
        const bookingData = {
          ...currentBooking,
          userId: user?.id,
          paymentDetails: data,
        }

        await dispatch(createBooking(bookingData))
      }
    } catch (error) {
      console.error("Payment failed:", error)
    }
  }

  const handleBack = () => {
    dispatch(previousStep())
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Credit/Debit Card</span>
                  <div className="flex space-x-2 ml-auto">
                    <img src="/placeholder.svg?height=24&width=38" alt="Visa" className="h-6" />
                    <img src="/placeholder.svg?height=24&width=38" alt="Mastercard" className="h-6" />
                    <img src="/placeholder.svg?height=24&width=38" alt="Amex" className="h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    {...register("cardNumber")}
                    placeholder="1234 5678 9012 3456"
                    className={`pl-10 h-12 ${errors.cardNumber ? "border-red-500" : ""}`}
                    onChange={(e) => {
                      e.target.value = formatCardNumber(e.target.value)
                    }}
                    maxLength={19}
                  />
                </div>
                {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                  <Input
                    {...register("expiryDate")}
                    placeholder="MM/YY"
                    className={`h-12 ${errors.expiryDate ? "border-red-500" : ""}`}
                    onChange={(e) => {
                      e.target.value = formatExpiryDate(e.target.value)
                    }}
                    maxLength={5}
                  />
                  {errors.expiryDate && <p className="text-red-500 text-xs">{errors.expiryDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">CVV</label>
                  <Input
                    {...register("cvv")}
                    placeholder="123"
                    className={`h-12 ${errors.cvv ? "border-red-500" : ""}`}
                    maxLength={4}
                  />
                  {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                <Input
                  {...register("cardholderName")}
                  placeholder="Name on card"
                  className={`h-12 ${errors.cardholderName ? "border-red-500" : ""}`}
                />
                {errors.cardholderName && <p className="text-red-500 text-xs">{errors.cardholderName.message}</p>}
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    {...register("billingAddress.street")}
                    placeholder="123 Main Street"
                    className={`pl-10 h-12 ${errors.billingAddress?.street ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.billingAddress?.street && (
                  <p className="text-red-500 text-xs">{errors.billingAddress.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <Input
                    {...register("billingAddress.city")}
                    placeholder="New York"
                    className={`h-12 ${errors.billingAddress?.city ? "border-red-500" : ""}`}
                  />
                  {errors.billingAddress?.city && (
                    <p className="text-red-500 text-xs">{errors.billingAddress.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <Input
                    {...register("billingAddress.state")}
                    placeholder="NY"
                    className={`h-12 ${errors.billingAddress?.state ? "border-red-500" : ""}`}
                  />
                  {errors.billingAddress?.state && (
                    <p className="text-red-500 text-xs">{errors.billingAddress.state.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                  <Input
                    {...register("billingAddress.zipCode")}
                    placeholder="10001"
                    className={`h-12 ${errors.billingAddress?.zipCode ? "border-red-500" : ""}`}
                  />
                  {errors.billingAddress?.zipCode && (
                    <p className="text-red-500 text-xs">{errors.billingAddress.zipCode.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <select
                    {...register("billingAddress.country")}
                    className={`w-full h-12 border border-gray-200 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-[#FF9530] ${
                      errors.billingAddress?.country ? "border-red-500" : ""
                    }`}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                  {errors.billingAddress?.country && (
                    <p className="text-red-500 text-xs">{errors.billingAddress.country.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="text-[#078ED8] hover:underline">
                    Terms of Service
                  </a>
                  ,{" "}
                  <a href="/privacy" className="text-[#078ED8] hover:underline">
                    Privacy Policy
                  </a>
                  , and{" "}
                  <a href="/cancellation" className="text-[#078ED8] hover:underline">
                    Cancellation Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Your payment is secure</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                We use industry-standard encryption to protect your payment information.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="px-8"
                disabled={paymentProcessing}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#FF9530] hover:bg-[#e8851c] text-white px-8"
                disabled={paymentProcessing || !agreeToTerms}
              >
                {paymentProcessing ? "Processing..." : "Complete Booking"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Booking Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Final Summary</h3>

          {currentBooking?.hotelDetails && (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ${currentBooking.hotelDetails.basePrice} × {currentBooking.hotelDetails.nights} nights
                  </span>
                  <span className="font-medium">
                    ${currentBooking.hotelDetails.basePrice * currentBooking.hotelDetails.nights}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & fees</span>
                  <span className="font-medium">
                    ${currentBooking.hotelDetails.taxes + currentBooking.hotelDetails.fees}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">${currentBooking.hotelDetails.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Free cancellation</strong> until 24 hours before check-in
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentDetails
