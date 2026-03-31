import { z } from "zod"

// Step 1: Guest Information
export const guestInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must not exceed 15 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  notes: z.string().optional(),
})

// Step 2: Review & Policies
export const reviewPoliciesSchema = z.object({
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to terms and conditions",
  }),
})

// Step 3: Payment Information
export const paymentInfoSchema = z
  .object({
    houseNumber: z.string().min(1, "House number is required"),
    street: z.string().min(1, "Street address is required"),
    countryId: z.string().min(1, "Country is required"),
    stateId: z.string().min(1, "State is required"),
    cityId: z.string().min(1, "City is required"),
    hasGST: z.boolean().optional(),
    gstNumber: z.string().optional(),
    companyName: z.string().optional(),
    gstPhone: z.string().optional(),
    gstAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      // If hasGST is true, GST fields are required
      if (data.hasGST) {
        return !!(data.gstNumber && data.companyName && data.gstPhone && data.gstAddress)
      }
      return true
    },
    {
      message: "All GST fields are required when GST is selected",
      path: ["gstNumber"],
    }
  )

export type GuestInfoFormData = z.infer<typeof guestInfoSchema>
export type ReviewPoliciesFormData = z.infer<typeof reviewPoliciesSchema>
export type PaymentInfoFormData = z.infer<typeof paymentInfoSchema>
