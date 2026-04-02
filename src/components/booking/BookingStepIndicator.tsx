"use client"
import React from "react"

interface BookingStepIndicatorProps {
  currentStep: number
}

const steps = [
  { number: 1, title: "Begin Your Booking" },
  { number: 2, title: "Review, Rules & Policies" },
  { number: 3, title: "Enter Payment Information" },
]

const BookingStepIndicator = ({ currentStep }: BookingStepIndicatorProps) => {
  return (
    <div className="mb-6 md:mt-0 mt-6 md:mb-8">
      <div className="flex items-start justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Column */}
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Step Circle */}
              <div className="relative">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-base sm:text-lg md:text-xl font-bold transition-all duration-300 z-10 relative ${
                    step.number === currentStep
                      ? "bg-[#078ED8] text-white scale-110 shadow-lg shadow-blue-200"
                      : step.number < currentStep
                      ? "bg-green-500 text-white shadow-md shadow-green-100"
                      : "bg-white text-gray-400 border-2 border-gray-100 shadow-sm"
                  }`}
                >
                  {step.number < currentStep ? (
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                {/* Pulse animation for current step */}
                {step.number === currentStep && (
                  <div className="absolute inset-0 rounded-full bg-[#078ED8] opacity-20 animate-ping"></div>
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-3 text-center w-24 sm:w-32 md:w-40">
                <span
                  className={`block text-[10px] sm:text-xs font-semibold tracking-tight transition-all ${
                    step.number === currentStep
                      ? "text-[#078ED8]"
                      : step.number < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  Step {step.number} of 3
                </span>
                <span
                  className={`mt-1 text-[10px] sm:text-xs md:text-sm leading-tight hidden md:block transition-all ${
                    step.number === currentStep
                      ? "text-gray-900 font-bold"
                      : step.number < currentStep
                      ? "text-gray-700 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mt-6 sm:mt-7 md:mt-8 px-2">
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-in-out ${
                      step.number < currentStep 
                        ? "w-full bg-green-500" 
                        : "w-0"
                    }`}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default BookingStepIndicator
