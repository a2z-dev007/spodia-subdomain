"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData, nextStep, previousStep } from "@/lib/features/booking/bookingSlice"
import { reviewPoliciesSchema, type ReviewPoliciesFormData } from "@/lib/validations/booking"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

const ReviewPoliciesStep = () => {
  const dispatch = useAppDispatch()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReviewPoliciesFormData>({
    resolver: zodResolver(reviewPoliciesSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      agreeToTerms: bookingFormData.agreeToTerms || false,
    },
  })

  const agreeToTerms = watch("agreeToTerms")
  const cancellationPolicies = bookingFormData.cancellationPolicies || []
  console.log("cancellationPolicies",cancellationPolicies)
  const onSubmit = (data: ReviewPoliciesFormData) => {
    // Extract cancellation policy ID (always single item in array)
    const cancellationPolicyId = cancellationPolicies.length > 0 ? cancellationPolicies[0]?.cancellation_policy : null
    
    dispatch(updateBookingFormData({
      ...data,
      cancellationPolicyId
    }))
    dispatch(nextStep())
  }

  const handleBack = () => {
    dispatch(previousStep())
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Review, Rules & Policies</h2>
          <p className="text-sm text-gray-600">Step 2 of 3</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Check-in/out Times */}
          {/* <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-gray-700">Check-in: 12 PM</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Check-out: 12 PM</p>
            </div>
          </div> */}

          {/* Cancellation Policy */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Cancellation Policy</h3>
            {cancellationPolicies.length > 0 ? (
              <div className="space-y-3">
                {cancellationPolicies.map((policy: any, index: number) => (
                  <div key={policy.id || index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 mb-1">{policy.policy_name}</p>
                        {policy.policy_description && (
                          <div 
                            className="text-sm text-gray-700 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: policy.policy_description }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 text-center">No cancellation policy applied</p>
              </div>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="agreeToTerms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700 cursor-pointer">
                I have read and agree{" "}
                <a href="/terms-conditions" target="_blank" className="text-[#078ED8] underline">
                  terms and conditions
                </a>
                ,{" "}
                <a href="/terms-conditions" target="_blank" className="text-[#078ED8] underline">
                  terms of use
                </a>{" "}
                and{" "}
                <a href="/booking-policy" target="_blank" className="text-[#078ED8] underline">
                  booking terms & conditions
                </a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 h-11 sm:h-12 order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-6 sm:px-8 h-11 sm:h-12 rounded-full font-semibold order-1 sm:order-2"
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ReviewPoliciesStep