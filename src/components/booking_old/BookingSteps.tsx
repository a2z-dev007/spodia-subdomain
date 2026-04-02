"use client"

import { useAppSelector } from "@/lib/hooks"
import { Check } from "lucide-react"

const BookingSteps = () => {
  const { currentStep } = useAppSelector((state) => state?.booking ?? { currentStep: 1 })

  const steps = [
    { number: 1, title: "Review Details", description: "Confirm your booking details" },
    { number: 2, title: "Guest Information", description: "Enter guest details" },
    { number: 3, title: "Payment", description: "Secure payment processing" },
    { number: 4, title: "Confirmation", description: "Booking confirmed" },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  currentStep > step.number
                    ? "bg-green-500 text-white"
                    : currentStep === step.number
                      ? "bg-[#FF9530] text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <div className="mt-2 text-center">
                <p className={`font-medium text-sm ${currentStep >= step.number ? "text-gray-900" : "text-gray-500"}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors ${
                  currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookingSteps
