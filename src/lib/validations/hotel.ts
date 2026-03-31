import { z } from "zod"

export const hotelSearchSchema = z
  .object({
    location: z.string().min(1, "Please enter a destination"),
    checkIn: z.string().min(1, "Please select check-in date"),
    checkOut: z.string().min(1, "Please select check-out date"),
    guests: z.string().min(1, "Please select number of guests"),
  })
  .refine(
    (data) => {
      if (data.checkIn && data.checkOut) {
        return new Date(data.checkOut) > new Date(data.checkIn)
      }
      return true
    },
    {
      message: "Check-out date must be after check-in date",
      path: ["checkOut"],
    },
  )

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const listPropertySchema = z.object({
  propertyName: z.string().min(2, "Property name must be at least 2 characters"),
  propertyType: z.string().min(1, "Please select a property type"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Please enter a valid ZIP code"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  amenities: z.array(z.string()).min(1, "Please select at least one amenity"),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
})

export type HotelSearchFormData = z.infer<typeof hotelSearchSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type ListPropertyFormData = z.infer<typeof listPropertySchema>
