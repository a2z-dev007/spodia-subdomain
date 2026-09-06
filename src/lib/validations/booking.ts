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
  .superRefine((data, ctx) => {
    if (data.hasGST) {
      if (!data.gstNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GST Number is required",
          path: ["gstNumber"],
        })
      }
      if (!data.companyName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Company Name is required",
          path: ["companyName"],
        })
      }
      if (!data.gstPhone?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone Number is required",
          path: ["gstPhone"],
        })
      } else if (!/^\d+$/.test(data.gstPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must contain only digits",
          path: ["gstPhone"],
        })
      } else if (data.gstPhone.length < 10 || data.gstPhone.length > 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be between 10 and 15 digits",
          path: ["gstPhone"],
        })
      }
      if (!data.gstAddress?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GST Address is required",
          path: ["gstAddress"],
        })
      }
    }
  })

export const singleStepBookingSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    mobile: z
      .string()
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number must not exceed 15 digits")
      .regex(/^\d+$/, "Mobile number must contain only digits"),
    hasGST: z.boolean().optional(),
    gstNumber: z.string().optional(),
    companyName: z.string().optional(),
    gstPhone: z.string().optional(),
    gstAddress: z.string().optional(),
    // Billing address fields
    street: z.string().optional(),
    houseNumber: z.string().optional(),
    countryId: z.string().optional(),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    agreeToCancellationPolicy: z.boolean().refine((val) => val === true, {
      message: "You must agree to the cancellation policy",
    }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to terms and conditions",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.hasGST) {
      if (!data.gstNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GST Number is required",
          path: ["gstNumber"],
        })
      }
      if (!data.companyName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Company Name is required",
          path: ["companyName"],
        })
      }
      if (!data.gstPhone?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone Number is required",
          path: ["gstPhone"],
        })
      } else if (!/^\d+$/.test(data.gstPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must contain only digits",
          path: ["gstPhone"],
        })
      } else if (data.gstPhone.length < 10 || data.gstPhone.length > 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be between 10 and 15 digits",
          path: ["gstPhone"],
        })
      }
      if (!data.gstAddress?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GST Address is required",
          path: ["gstAddress"],
        })
      }
    }
  })

export type GuestInfoFormData = z.infer<typeof guestInfoSchema>
export type ReviewPoliciesFormData = z.infer<typeof reviewPoliciesSchema>
export type PaymentInfoFormData = z.infer<typeof paymentInfoSchema>
export type SingleStepBookingFormData = z.infer<typeof singleStepBookingSchema>
