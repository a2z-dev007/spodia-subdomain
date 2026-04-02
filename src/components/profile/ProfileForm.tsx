"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateUser } from "@/lib/features/auth/authSlice"
import { profileSchema, type ProfileFormData } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, MapPin, Calendar, Camera, Globe, Building, GraduationCap, Home } from "lucide-react"
import UserAvatar from "@/components/ui/UserAvatar"
import Select from "react-select"
import { useCountries, useStates, useCities } from "@/hooks/useApi"
import { profileSelectStyles } from "@/components/select/profileSelectStyles"
import { updateProfile, updateProfileImage } from "@/services/api"
import { toast } from 'react-toastify'
import Image from "next/image"

const ProfileForm = () => {
  const { user } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedCountryId, setSelectedCountryId] = useState(user?.country_id?.toString() || "")
  const [selectedStateId, setSelectedStateId] = useState(user?.region_id?.toString() || "")

  // API hooks for location data
  const { data: countries } = useCountries()
  const { data: states } = useStates(selectedCountryId)
  const { data: cities } = useCities(selectedStateId)

  // Options for react-select
  const countryOptions = countries ? countries?.records?.map((c: { id: number; name: string }) => ({ value: c.id.toString(), label: c.name })) : []
  const stateOptions = states?.records?.map((s: { id: number; name: string }) => ({ value: s.id.toString(), label: s.name })) ?? []
  const cityOptions = cities?.records?.map((ct: { id: number; name: string }) => ({ value: ct.id.toString(), label: ct.name })) ?? []

  // Gender options
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" }
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.mobile || "",
      dateOfBirth: "",
      address: user?.address_line1 || "",
      city: user?.city || "",
      country: user?.country || "",
      bio: user?.about_me || "",
      gender: user?.gender || "",
      languagesKnown: user?.languages_spoken || "",
      countryId: user?.country_id?.toString() || "",
      stateId: user?.region_id?.toString() || "",
      cityId: user?.city_id?.toString() || "",
      school: user?.school || "",
      hometown: user?.hometown || "",
      companyName: user?.company_name || "",
    },
  })

  const watchedCountryId = watch("countryId")
  const watchedStateId = watch("stateId")
  const watchedGender = watch("gender")

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true)

      // Split name into first and last name
      const nameParts = data.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Prepare API payload
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        gender: data.gender || '',
        school: data.school || '',
        hometown: data.hometown || '',
        languages_spoken: data.languagesKnown || '',
        about_me: data.bio || '',
        company_name: data.companyName || '',
        mobile: data.phone,
        country: data.countryId || '',
        state: data.stateId || '',
        city: data.cityId || '',
      }

      // Call profile update API
      const response = await updateProfile(profileData)

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = response.data

      // Update user in Redux store with API response
      dispatch(updateUser(updatedUser))

      setIsSaving(false)
      setIsEditing(false)

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      setIsSaving(false)

      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file.", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB.", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setIsUploadingImage(true)

      const response = await updateProfileImage(file)

      const updatedUser = response.data

      if(updatedUser?.status =="success"){
        // Update user in Redux store with new profile image
      dispatch(updateUser(updatedUser))

      toast.success("Profile image updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      
      // Clear preview after successful upload
      setPreviewImage(null)
      }
      
    } catch (error) {
      console.error('Error uploading image:', error)
      // Revert preview on error
      setPreviewImage(null)
      toast.error("Failed to upload image. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsUploadingImage(false)
      // Reset the input
      event.target.value = ''
    }
  }

  const handleCancel = () => {
    reset({
      name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.mobile || "",
      dateOfBirth: "",
      address: user?.address_line1 || "",
      city: user?.city || "",
      country: user?.country || "",
      bio: user?.about_me || "",
      gender: user?.gender || "",
      languagesKnown: user?.languages_spoken || "",
      countryId: user?.country_id?.toString() || "",
      stateId: user?.region_id?.toString() || "",
      cityId: user?.city_id?.toString() || "",
      school: user?.school || "",
      hometown: user?.hometown || "",
      companyName: user?.company_name || "",
    })
    setSelectedCountryId(user?.country_id?.toString() || "")
    setSelectedStateId(user?.region_id?.toString() || "")
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm sm:shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Information</h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="text-[#FF9530] border-[#FF9530] hover:bg-[#FF9530] hover:text-white text-sm sm:text-base h-9 sm:h-10"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Profile Picture with Real-time Preview */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
          <div className="relative">
            {previewImage ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-orange-100">
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <UserAvatar user={user} size="xl" />
            )}
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image-upload"
                  disabled={isUploadingImage}
                />
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 bg-[#FF9530] text-white p-1.5 sm:p-2 rounded-full hover:bg-[#e8851c] transition-colors cursor-pointer shadow-lg"
                >
                  {isUploadingImage ? (
                    <div className="animate-spin rounded-full w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </label>
              </>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{user.full_name}</h3>
            <p className="text-sm sm:text-base text-gray-600">{user.role_name}</p>
            {isEditing && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Click the camera icon to change your photo (Max 5MB)
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Full Name */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                {...register("name")}
                placeholder="Enter your full name"
                className={`pl-8 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base ${errors.name ? "border-red-500" : ""}`}
                disabled={!isEditing}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`pl-8 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base ${errors.email ? "border-red-500" : ""}`}
                disabled={!isEditing}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                {...register("phone")}
                type="tel"
                placeholder="Enter your phone number"
                className={`pl-8 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base ${errors.phone ? "border-red-500" : ""}`}
                disabled={!isEditing}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          {/* Date of Birth */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input {...register("dateOfBirth")} type="date" className="pl-10 h-12" disabled={!isEditing} />
            </div>
          </div> */}

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("address")}
                placeholder="Enter your address"
                className="pl-10 h-12"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* City */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">City</label>
            <Input {...register("city")} placeholder="Enter your city" className="h-12" disabled={!isEditing} />
          </div> */}

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <Select
              instanceId="gender-select"
              options={genderOptions}
              value={genderOptions.find((opt: { value: string; label: string }) => opt.value === watchedGender)}
              onChange={(selectedOption: { value: string; label: string } | null) => {
                setValue("gender", selectedOption?.value || "")
              }}
              styles={profileSelectStyles}
              placeholder="Select Gender"
              isDisabled={!isEditing}
              className="text-black"
            />
          </div>

          {/* Languages Known */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Languages Known</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("languagesKnown")}
                placeholder="e.g., English, Hindi, Spanish"
                className="pl-10 h-12"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* School */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">School</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("school")}
                placeholder="Enter your school/university"
                className="pl-10 h-12"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Hometown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Hometown</label>
            <div className="relative">
              <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("hometown")}
                placeholder="Enter your hometown"
                className="pl-10 h-12"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("companyName")}
                placeholder="Enter your company name"
                className="pl-10 h-12"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Country */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <Select
                instanceId="country-select"
                options={countryOptions}
                value={countryOptions.find((opt: { value: string; label: string }) => opt.value === watchedCountryId)}
                onChange={(selectedOption: { value: string; label: string } | null) => {
                  const countryId = selectedOption?.value || ""
                  setValue("countryId", countryId)
                  setValue("stateId", "")
                  setValue("cityId", "")
                  setSelectedCountryId(countryId)
                  setSelectedStateId("")
                }}
                styles={profileSelectStyles}
                placeholder="Select Country"
                isDisabled={!isEditing}
                isSearchable
                className="text-black"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">State</label>
              <Select
                instanceId="state-select"
                options={stateOptions}
                value={stateOptions.find((opt: { value: string; label: string }) => opt.value === watchedStateId)}
                onChange={(selectedOption: { value: string; label: string } | null) => {
                  const stateId = selectedOption?.value || ""
                  setValue("stateId", stateId)
                  setValue("cityId", "")
                  setSelectedStateId(stateId)
                }}
                styles={profileSelectStyles}
                placeholder="Select State"
                isDisabled={!isEditing || !watchedCountryId}
                isSearchable
                className="text-black"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <Select
                instanceId="city-select"
                options={cityOptions}
                value={cityOptions.find((opt: { value: string; label: string }) => opt.value === watch("cityId"))}
                onChange={(selectedOption: { value: string; label: string } | null) => {
                  setValue("cityId", selectedOption?.value || "")
                }}
                styles={profileSelectStyles}
                placeholder="Select City"
                isDisabled={!isEditing || !watchedStateId}
                isSearchable
                className="text-black"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 space-y-2">
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <Textarea
            {...register("bio")}
            placeholder="Tell us about yourself..."
            className="min-h-24"
            disabled={!isEditing}
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FF9530] hover:bg-[#e8851c] text-white px-8" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

export default ProfileForm
