"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Building, MapPin, User, Mail, Phone, Home, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { verifyEmail as verifyEmailApi } from "@/services/api"

const ListPropertyForm = () => {
  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    ownerName: "",
    email: "",
    phone: "",
    description: "",
    amenities: [] as string[],
    agreeToTerms: false,
  })

  const [emailVerification, setEmailVerification] = useState<{
    isChecking: boolean
    isValid: boolean | null
    message: string
  }>({
    isChecking: false,
    isValid: null,
    message: "",
  })

  const propertyTypes = ["Hotel", "Resort", "Homestay", "Apartment", "Villa", "Hostel", "Guesthouse", "Boutique Hotel"]

  const amenitiesList = [
    "Free WiFi",
    "Parking",
    "Swimming Pool",
    "Gym",
    "Restaurant",
    "Bar",
    "Spa",
    "Room Service",
    "Laundry",
    "Pet Friendly",
    "Air Conditioning",
    "Heating",
  ]

  // Email verification handler
  const handleVerifyEmail = useCallback(
    async (email: string) => {
      if (!email || !email.includes("@")) {
        setEmailVerification({
          isChecking: false,
          isValid: null,
          message: "",
        })
        return
      }

      setEmailVerification({
        isChecking: true,
        isValid: null,
        message: "",
      })

      try {
        const response = await verifyEmailApi(email)

        if (response.data.status === "success") {
          setEmailVerification({
            isChecking: false,
            isValid: true,
            message: response.data.message || "Email is available",
          })
        } else {
          setEmailVerification({
            isChecking: false,
            isValid: false,
            message:
              response.data.message || "This email is already registered with us.",
          })
        }
      } catch (error) {
        console.error("Email verification error:", error)
        setEmailVerification({
          isChecking: false,
          isValid: null,
          message: "Unable to verify email. Please try again.",
        })
      }
    },
    []
  )

  // Debounce email verification
  useEffect(() => {
    if (!formData.email || !formData.email.includes("@")) {
      setEmailVerification({ isChecking: false, isValid: null, message: "" })
      return
    }

    const timeoutId = setTimeout(() => {
      handleVerifyEmail(formData.email)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [formData.email, handleVerifyEmail])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check email validation
    if (emailVerification.isValid === false) {
      toast.error("Please use a valid email address")
      return
    }

    console.log("Property listing submitted:", formData)
    toast.success("Thank you! Your property listing has been submitted for review.")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenity] : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">List Your Property</h2>
            <p className="text-gray-600">Fill out the form below to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
            {/* Property Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Property Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      name="propertyName"
                      value={formData.propertyName}
                      onChange={handleChange}
                      placeholder="Enter property name"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Property Type</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full pl-10 h-12 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9530]"
                      required
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                    <Input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="h-12"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Owner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email"
                      className={`pl-10 pr-10 h-12 ${
                        emailVerification.isValid === false
                          ? "border-red-500 focus:ring-red-200"
                          : emailVerification.isValid === true
                          ? "border-green-500 focus:ring-green-200"
                          : ""
                      }`}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      {emailVerification.isChecking ? (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : emailVerification.isValid === true ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : emailVerification.isValid === false ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  {emailVerification.message && (
                    <div
                      className={`flex items-start space-x-2 mt-2 ${
                        emailVerification.isValid === false
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {emailVerification.isValid === false ? (
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-xs leading-tight">
                        {emailVerification.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Description</h3>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property, its unique features, and what makes it special..."
                className="min-h-32"
                required
              />
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <label htmlFor={amenity} className="text-sm text-gray-700">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <Button
              type="submit"
              disabled={!formData.agreeToTerms}
              className="w-full bg-[#FF9530] hover:bg-[#e8851c] text-white h-12 rounded-full text-lg font-medium"
            >
              Submit Property Listing
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ListPropertyForm
