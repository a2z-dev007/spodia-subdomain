"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { X, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { addPropertyEnquiry } from '@/services/api'
import 'react-datepicker/dist/react-datepicker.css'

interface GroupEnquiryModalProps {
  isOpen: boolean
  onClose: () => void
  hotelName: string
  hotelId: number
  enquiryType: "group" | "single"
  allowTypeSelection?: boolean
}

const GroupEnquiryModal: React.FC<GroupEnquiryModalProps> = ({ isOpen, onClose, hotelName, hotelId, enquiryType, allowTypeSelection = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    checkIn: null as Date | null,
    checkOut: null as Date | null,
    numberOfRooms: 1,
    message: ''
  })

  // State for enquiry type (defaults to prop, but can be changed if allowed)
  const [selectedType, setSelectedType] = useState<"group" | "single">(enquiryType)

  // Update selectedType when enquiryType prop changes
  useEffect(() => {
    setSelectedType(enquiryType)
  }, [enquiryType])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [recaptchaLoading, setRecaptchaLoading] = useState(false)
  const recaptchaRenderedRef = useRef(false)

  // Validation errors state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    checkIn: '',
    checkOut: '',
    numberOfRooms: '',
    message: ''
  })

  // Touched fields state
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    mobile: false,
    checkIn: false,
    checkOut: false,
    numberOfRooms: false,
    message: false
  })

  // Check if we're in production
  const isProduction = useMemo(() => {
    if (typeof window === "undefined") return false
    return window.location.hostname === "spodia.com" ||
      window.location.hostname === "www.spodia.com"
  }, [])

  // Auto-verify in dev mode
  useEffect(() => {
    if (!isProduction) {
      setRecaptchaVerified(true)
    }
  }, [isProduction])

  // Create portal container for DatePicker
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('enquiry-datepicker-portal')) {
      const portalDiv = document.createElement('div')
      portalDiv.id = 'enquiry-datepicker-portal'
      document.body.appendChild(portalDiv)
    }
  }, [])

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  const validateMobile = (mobile: string): string => {
    if (!mobile) return 'Mobile number is required'
    // Remove all non-digit characters for validation
    const digitsOnly = mobile.replace(/\D/g, '')
    if (digitsOnly.length < 10) return 'Mobile number must be at least 10 digits'
    if (digitsOnly.length > 15) return 'Mobile number must not exceed 15 digits'
    // Check if it contains only valid characters (digits, spaces, +, -, (, ))
    const mobileRegex = /^[\d\s+\-()]+$/
    if (!mobileRegex.test(mobile)) return 'Please enter a valid mobile number'
    return ''
  }

  const validateName = (name: string): string => {
    if (!name) return 'Name is required'
    if (name.length < 2) return 'Name must be at least 2 characters'
    if (name.length > 50) return 'Name must not exceed 50 characters'
    return ''
  }

  const validateMessage = (message: string): string => {
    if (!message) return 'Message is required'
    if (message.length < 10) return 'Message must be at least 10 characters'
    if (message.length > 500) return 'Message must not exceed 500 characters'
    return ''
  }

  const validateNumberOfRooms = (rooms: number): string => {
    if (rooms === 0 || rooms < 1) return 'At least 1 room is required'
    if (rooms > 50) return 'Maximum 50 rooms allowed'
    return ''
  }

  // Real-time validation on field change
  const handleFieldChange = (field: string, value: any) => {
    if (field === 'mobile') {
      const val = (value as string).replace(/[^0-9+\s-]/g, "");
      if (val.length <= 15) {
        setFormData({ ...formData, [field]: val })
      } else {
        return;
      }
    } else {
      setFormData({ ...formData, [field]: value })
    }

    // Validate on change if field has been touched
    if (touched[field as keyof typeof touched]) {
      let error = ''
      switch (field) {
        case 'name':
          error = validateName(value as string)
          break
        case 'email':
          error = validateEmail(value as string)
          break
        case 'mobile':
          error = validateMobile(value as string)
          break
        case 'message':
          error = validateMessage(value as string)
          break
        case 'numberOfRooms':
          error = validateNumberOfRooms(value as number)
          break
        case 'checkIn':
          error = !value ? 'Check-in date is required' : ''
          break
        case 'checkOut':
          error = !value ? 'Check-out date is required' : ''
          break
      }
      setErrors({ ...errors, [field]: error })
    }
  }

  // Handle field blur (mark as touched)
  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })

    // Validate on blur
    let error = ''
    const value = formData[field as keyof typeof formData]
    switch (field) {
      case 'name':
        error = validateName(value as string)
        break
      case 'email':
        error = validateEmail(value as string)
        break
      case 'mobile':
        error = validateMobile(value as string)
        break
      case 'message':
        error = validateMessage(value as string)
        break
      case 'numberOfRooms':
        error = validateNumberOfRooms(value as number)
        break
    }
    setErrors({ ...errors, [field]: error })
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile),
      checkIn: !formData.checkIn ? 'Check-in date is required' : '',
      checkOut: !formData.checkOut ? 'Check-out date is required' : '',
      numberOfRooms: validateNumberOfRooms(formData.numberOfRooms),
      message: validateMessage(formData.message)
    }

    setErrors(newErrors)
    setTouched({
      name: true,
      email: true,
      mobile: true,
      checkIn: true,
      checkOut: true,
      numberOfRooms: true,
      message: true
    })

    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== '')
  }

  // reCAPTCHA integration
  useEffect(() => {
    if (!isOpen || !isProduction) return
    if (recaptchaRenderedRef.current) return

    // Wait for grecaptcha to be available
    const initRecaptcha = () => {
      if (typeof window === "undefined" || !(window as any).grecaptcha) {
        // Retry after a short delay if grecaptcha is not loaded yet
        setTimeout(initRecaptcha, 100)
        return
      }

      ; (window as any).grecaptcha.ready(() => {
        const container = document.getElementById("group-enquiry-recaptcha")

        if (!container || container.children.length > 0) return

        try {
          (window as any).grecaptcha.render("group-enquiry-recaptcha", {
            sitekey: "6LemmzYqAAAAALr8V77DYbKH3z8RJosQDILW7pQO",
            callback: (token: string) => {
              // Simply mark as verified when user completes the captcha
              // Backend will verify the token when form is submitted
              console.log("Captcha completed, token received")
              setRecaptchaToken(token)
              setRecaptchaVerified(true)
              setRecaptchaLoading(false)
            },
            "expired-callback": () => {
              // Reset verification if captcha expires
              console.log("Captcha expired")
              setRecaptchaVerified(false)
              toast.warning("Captcha expired. Please verify again.")
            },
            "error-callback": () => {
              // Handle captcha errors
              console.error("Captcha error")
              setRecaptchaVerified(false)
              toast.error("Captcha error. Please try again.")
            }
          })
          recaptchaRenderedRef.current = true
        } catch (error) {
          console.error("Failed to render reCAPTCHA:", error)
          toast.error("Failed to load captcha. Please refresh the page.")
        }
      })
    }

    // Start initialization
    initRecaptcha()
  }, [isOpen, isProduction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    if (isProduction && !recaptchaVerified) {
      toast.error("Please verify captcha first", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for API
      const enquiryData = {
        listing: hotelId,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        check_in: formData.checkIn ? format(formData.checkIn, 'yyyy-MM-dd') : '',
        check_out: formData.checkOut ? format(formData.checkOut, 'yyyy-MM-dd') : '',
        enquiry_type: selectedType,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        number_of_rooms: formData.numberOfRooms,
        message: formData.message,
        "g-recaptcha-response": recaptchaToken
      }

      console.log('=== ENQUIRY SUBMITTED ===')
      console.log('Type:', selectedType)
      console.log('Data:', JSON.stringify(enquiryData, null, 2))
      console.log('========================')

      // Call API
      const response = await addPropertyEnquiry(enquiryData)

      // Check for 201 status (Created)
      if (response.status === 201) {
        toast.success("Enquiry submitted successfully! We'll get back to you soon.", {
          position: "top-right",
          autoClose: 3000,
        })

        // Reset form
        setFormData({
          name: '',
          email: '',
          mobile: '',
          checkIn: null,
          checkOut: null,
          numberOfRooms: 1,
          message: ''
        })

        // Reset errors and touched state
        setErrors({
          name: '',
          email: '',
          mobile: '',
          checkIn: '',
          checkOut: '',
          numberOfRooms: '',
          message: ''
        })
        setTouched({
          name: false,
          email: false,
          mobile: false,
          checkIn: false,
          checkOut: false,
          numberOfRooms: false,
          message: false
        })

        // Reset captcha
        if (isProduction && (window as any).grecaptcha) {
          ; (window as any).grecaptcha.reset()
          setRecaptchaVerified(false)
          recaptchaRenderedRef.current = false
        }

        onClose()
      } else {
        toast.error("Failed to submit enquiry. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } catch (error: any) {
      console.error('Enquiry submission error:', error)

      // Handle different error scenarios
      if (error.response) {
        const status = error.response.status
        const data = error.response.data

        if (status === 400) {
          toast.error(data?.detail || data?.message || "Invalid data. Please check your input and try again.", {
            position: "top-right",
            autoClose: 4000,
          })
        } else if (status === 500) {
          toast.error("Server error. Please try again later.", {
            position: "top-right",
            autoClose: 4000,
          })
        } else {
          toast.error(data?.detail || data?.message || "Failed to submit enquiry. An error occurred. Please try again.", {
            position: "top-right",
            autoClose: 4000,
          })
        }
      } else if (error.request) {
        toast.error("Network error. Please check your internet connection and try again.", {
          position: "top-right",
          autoClose: 4000,
        })
      } else {
        toast.error(error.message || "Failed to submit enquiry. An unexpected error occurred.", {
          position: "top-right",
          autoClose: 4000,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Custom DatePicker and Toast Styles */}
      <style jsx global>{`
        /* React Toastify z-index fix */
        .Toastify__toast-container {
          z-index: 999999 !important;
        }
        
        .Toastify__toast {
          z-index: 999999 !important;
        }
        
        /* DatePicker Portal Responsive Styles */
        .react-datepicker-popper[data-placement^="bottom"] {
          z-index: 99999 !important;
        }
        
        .react-datepicker__portal {
          z-index: 99999 !important;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .react-datepicker__portal .react-datepicker {
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          font-family: inherit;
        }
        
        /* Desktop/Tablet DatePicker Theming */
        .react-datepicker {
          border: 1px solid #e5e7eb !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          font-family: inherit !important;
        }
        
        .react-datepicker__header {
          background-color: #f97316 !important;
          border-bottom: none !important;
          border-top-left-radius: 12px !important;
          border-top-right-radius: 12px !important;
          padding: 16px 0 !important;
        }
        
        .react-datepicker__current-month {
          color: white !important;
          font-weight: 600 !important;
          font-size: 1.125rem !important;
          margin-bottom: 8px !important;
        }
        
        .react-datepicker__day-names {
          background-color: #f97316 !important;
          padding: 8px 0 !important;
          margin-bottom: 0 !important;
        }
        
        .react-datepicker__day-name {
          color: white !important;
          font-weight: 500 !important;
          width: 2.5rem !important;
          line-height: 2.5rem !important;
        }
        
        .react-datepicker__month {
          margin: 0.8rem !important;
        }
        
        .react-datepicker__day {
          width: 2.5rem !important;
          line-height: 2.5rem !important;
          margin: 0.25rem !important;
          border-radius: 0.5rem !important;
          color: #374151 !important;
          font-weight: 500 !important;
        }
        
        .react-datepicker__day:hover {
          background-color: #fed7aa !important;
          border-radius: 0.5rem !important;
        }
        
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #f97316 !important;
          color: white !important;
          font-weight: 600 !important;
          border-radius: 0.5rem !important;
        }
        
        .react-datepicker__day--today {
          font-weight: 600 !important;
          color: #f97316 !important;
          background-color: #fff7ed !important;
          border-radius: 0.5rem !important;
        }
        
        .react-datepicker__day--disabled {
          color: #d1d5db !important;
          cursor: not-allowed !important;
        }
        
        .react-datepicker__day--disabled:hover {
          background-color: transparent !important;
        }
        
        .react-datepicker__navigation {
          top: 16px !important;
          width: 32px !important;
          height: 32px !important;
          border-radius: 0.375rem !important;
        }
        
        .react-datepicker__navigation:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .react-datepicker__navigation-icon::before {
          border-color: white !important;
          border-width: 2px 2px 0 0 !important;
          height: 9px !important;
          width: 9px !important;
        }
        
        .react-datepicker__triangle {
          display: none !important;
        }
        
        /* Mobile responsive calendar - Larger and more visible */
        @media (max-width: 640px) {
          .react-datepicker__portal .react-datepicker {
            transform: scale(0.95) !important;
            transform-origin: center !important;
            margin: 0 !important;
          }
          
          .react-datepicker__month-container {
            width: 100% !important;
            max-width: 340px !important;
          }
          
          .react-datepicker {
            width: 100% !important;
            max-width: 340px !important;
          }
          
          .react-datepicker__header {
            padding: 12px 0 !important;
            background-color: #f97316 !important;
          }
          
          .react-datepicker__current-month {
            font-size: 1rem !important;
            padding: 10px 0 !important;
            color: white !important;
            font-weight: 600 !important;
          }
          
          .react-datepicker__day-names {
            margin-bottom: 6px !important;
            background-color: #f97316 !important;
            padding: 4px 0 !important;
          }
          
          .react-datepicker__day-name {
            color: white !important;
            font-weight: 500 !important;
          }
          
          .react-datepicker__day-name,
          .react-datepicker__day,
          .react-datepicker__time-name {
            width: 2.2rem !important;
            line-height: 2.2rem !important;
            margin: 0.2rem !important;
            font-size: 0.875rem !important;
          }
          
          .react-datepicker__day {
            border-radius: 0.375rem !important;
          }
          
          .react-datepicker__day:hover {
            background-color: #fed7aa !important;
          }
          
          .react-datepicker__day--selected {
            background-color: #f97316 !important;
            color: white !important;
            font-weight: 600 !important;
          }
          
          .react-datepicker__day--keyboard-selected {
            background-color: #fb923c !important;
            color: white !important;
          }
          
          .react-datepicker__week {
            display: flex !important;
            justify-content: space-around !important;
          }
          
          .react-datepicker__navigation {
            top: 12px !important;
            width: 28px !important;
            height: 28px !important;
          }
          
          .react-datepicker__navigation-icon::before {
            border-color: white !important;
            border-width: 2px 2px 0 0 !important;
            height: 8px !important;
            width: 8px !important;
          }
          
          .react-datepicker__month {
            margin: 0.4rem !important;
          }
        }
        
        /* Extra small screens */
        @media (max-width: 380px) {
          .react-datepicker__portal .react-datepicker {
            transform: scale(0.85) !important;
          }
          
          .react-datepicker__day-name,
          .react-datepicker__day {
            width: 2rem !important;
            line-height: 2rem !important;
            margin: 0.15rem !important;
            font-size: 0.8rem !important;
          }
        }
        
        /* Ensure portal container exists */
        #enquiry-datepicker-portal {
          position: relative;
          z-index: 99999;
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-10">
        <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
          {/* Close Button */}
          <button
            onClick={() => {

              onClose()
              // Reset form
              setFormData({
                name: '',
                email: '',
                mobile: '',
                checkIn: null,
                checkOut: null,
                numberOfRooms: 1,
                message: ''
              })

              // Reset errors and touched state
              setErrors({
                name: '',
                email: '',
                mobile: '',
                checkIn: '',
                checkOut: '',
                numberOfRooms: '',
                message: ''
              })
              setTouched({
                name: false,
                email: false,
                mobile: false,
                checkIn: false,
                checkOut: false,
                numberOfRooms: false,
                message: false
              })
            }
            }
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Header */}
          <div className="mb-4 sm:mb-6 pr-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              {selectedType === "group" ? "Group Enquiry" : "Single Enquiry"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {selectedType === "group"
                ? `Send us your group booking requirements for ${hotelName}`
                : `Send us your booking enquiry for ${hotelName}`
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Enquiry Type Dropdown */}
            {allowTypeSelection && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  Enquiry Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as "group" | "single")}
                  className="w-full text-sm h-10 border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="single">Single</option>
                  <option value="group">Group</option>
                </select>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={() => handleFieldBlur('name')}
                placeholder="Enter your name"
                className={`w-full text-sm h-10 ${touched.name && errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {touched.name && errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                placeholder="Enter your email"
                className={`w-full text-sm h-10 ${touched.email && errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                Mobile <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={formData.mobile}
                maxLength={15}
                onChange={(e) => handleFieldChange('mobile', e.target.value)}
                onBlur={() => handleFieldBlur('mobile')}
                placeholder="Enter your mobile number"
                className={`w-full text-sm h-10 ${touched.mobile && errors.mobile ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {touched.mobile && errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Check-in & Check-out */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  Check-in <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={formData.checkIn}
                  onChange={(date) => {
                    handleFieldChange('checkIn', date)
                    setTouched({ ...touched, checkIn: true })
                  }}
                  dateFormat="dd MMM yyyy"
                  minDate={new Date()}
                  placeholderText="Select date"
                  withPortal
                  portalId="enquiry-datepicker-portal"
                  popperClassName="enquiry-datepicker-popper"
                  className={`w-full px-2 sm:px-3 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 ${touched.checkIn && errors.checkIn
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-orange-500'
                    }`}
                />
                {touched.checkIn && errors.checkIn && (
                  <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>
                )}
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  Check-out <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={formData.checkOut}
                  onChange={(date) => {
                    handleFieldChange('checkOut', date)
                    setTouched({ ...touched, checkOut: true })
                  }}
                  dateFormat="dd MMM yyyy"
                  minDate={formData.checkIn ? new Date(formData.checkIn.getTime() + 86400000) : new Date()}
                  placeholderText="Select date"
                  withPortal
                  portalId="enquiry-datepicker-portal"
                  popperClassName="enquiry-datepicker-popper"
                  className={`w-full px-2 sm:px-3 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 ${touched.checkOut && errors.checkOut
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-orange-500'
                    }`}
                />
                {touched.checkOut && errors.checkOut && (
                  <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>
                )}
              </div>
            </div>

            {/* Number of Rooms */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                Number of Rooms <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                max="50"
                value={formData.numberOfRooms === 0 ? '' : formData.numberOfRooms}
                onChange={(e) => {
                  const value = e.target.value
                  // Allow empty string while typing
                  if (value === '') {
                    handleFieldChange('numberOfRooms', 0)
                  } else {
                    const numValue = parseInt(value)
                    if (!isNaN(numValue)) {
                      handleFieldChange('numberOfRooms', numValue)
                    }
                  }
                }}
                onBlur={() => {
                  // If empty on blur, set to 1
                  if (formData.numberOfRooms === 0) {
                    handleFieldChange('numberOfRooms', 1)
                  }
                  handleFieldBlur('numberOfRooms')
                }}
                placeholder="Enter number of rooms"
                className={`w-full text-sm h-10 ${touched.numberOfRooms && errors.numberOfRooms ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {touched.numberOfRooms && errors.numberOfRooms && (
                <p className="text-red-500 text-xs mt-1">{errors.numberOfRooms}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                Message <span className="text-red-500">*</span>
                <span className="text-gray-500 font-normal ml-1">
                  ({formData.message.length}/500)
                </span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleFieldChange('message', e.target.value)}
                onBlur={() => handleFieldBlur('message')}
                placeholder={enquiryType === "group" ? "Tell us about your group booking requirements..." : "Tell us about your booking requirements..."}
                rows={3}
                maxLength={500}
                className={`w-full px-2 sm:px-3 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 resize-none ${touched.message && errors.message
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-orange-500'
                  }`}
              />
              {touched.message && errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            {/* reCAPTCHA */}
            {isProduction && (
              <>
                <div id="group-enquiry-recaptcha" className="mt-2 flex justify-center"></div>
                {recaptchaLoading && (
                  <div className="flex items-center text-gray-600 text-xs sm:text-sm space-x-2">
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    <span>Verifying captcha...</span>
                  </div>
                )}
                {!recaptchaVerified && !recaptchaLoading && (
                  <p className="text-xs text-red-500">
                    Please verify the captcha before submitting
                  </p>
                )}
              </>
            )}

            {/* Development mode indicator */}
            {!isProduction && (
              <div className="flex items-center text-amber-600 text-xs sm:text-sm space-x-2 bg-amber-50 p-2 sm:p-3 rounded-lg">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Development mode: reCAPTCHA disabled</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || (isProduction && !recaptchaVerified)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10 sm:h-11 rounded-lg font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  <span className="text-sm sm:text-base">Submitting...</span>
                </div>
              ) : (
                'Submit Enquiry'
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default GroupEnquiryModal
