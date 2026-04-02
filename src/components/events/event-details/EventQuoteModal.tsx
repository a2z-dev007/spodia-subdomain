'use client'
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { X, User, Phone, Mail, Users, Utensils, FileText, Calendar, Building2, Sparkles, Loader2, ArrowRight } from 'lucide-react'
import { fetchEventTypes, addEventEnquiry } from '@/lib/api/eventsEndpoints'
import PremiumSelect from '@/components/ui/PremiumSelect'
import PremiumDatePicker from '@/components/ui/PremiumDatePicker'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AnimatePresence } from 'framer-motion'

const eventEnquirySchema = z.object({
  guest_name: z.string().min(2, "Name is too short"),
  guest_mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid 10-digit mobile number"),
  guest_email: z.string().email("Invalid email address"),
  no_of_guests: z.coerce.number().min(1, "Guests required"),
  meal_preference: z.string().optional(),
  message: z.string().optional(),
  event_type: z.any().refine(v => v !== null, "Select event type"),
  date_range: z.any().refine((dates: [Date | null, Date | null]) => dates && dates[0] !== null, "Select date(s)"),
})

interface FormValues {
  guest_name: string
  guest_mobile: string
  guest_email: string
  no_of_guests: number
  meal_preference?: string
  message?: string
  event_type: { value: number; label: string } | null
  date_range: [Date | null, Date | null]
}

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  initialVenueId?: number;
  venueName?: string;
  venueType?: string;
}

export function EventQuoteModal({ isOpen, onClose, initialVenueId, venueName, venueType }: Props) {
  const [done, setDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(eventEnquirySchema) as any,
    defaultValues: {
      guest_name: '',
      guest_mobile: '',
      guest_email: '',
      no_of_guests: 1,
      meal_preference: '',
      message: '',
      event_type: null,
      date_range: [null, null],
    }
  })

  const { register, handleSubmit, control, reset, formState: { errors } } = form

  // Fetch Data for Dropdowns
  const { data: eventTypesData } = useQuery({ 
    queryKey: ['eventTypes'], 
    queryFn: () => fetchEventTypes(),
    enabled: isOpen 
  })

  const eventOptions = eventTypesData?.records?.map((r: any) => ({ value: r.id, label: r.name })) || []

  const mutation = useMutation({
    mutationFn: addEventEnquiry,
    onSuccess: () => {
      setDone(true)
      reset()
      setTimeout(() => {
        setDone(false)
        onClose()
      }, 3000)
    },
    onError: (error: any) => {
      alert(error.message || 'Something went wrong.')
    }
  })

  const onSubmit = (data: FormValues) => {
    const payload = {
      guest_name: data.guest_name,
      guest_mobile: data.guest_mobile,
      guest_email: data.guest_email,
      no_of_guests: data.no_of_guests,
      meal_preference: data.meal_preference || '',
      message: data.message || '',
      venue: initialVenueId ? [Number(initialVenueId)] : [],
      event_type: data.event_type!.value,
      event_start_date: data.date_range[0]!.toISOString().split('T')[0],
      event_end_date: (data.date_range[1] || data.date_range[0])!.toISOString().split('T')[0],
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    }
    mutation.mutate(payload)
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/30 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-10" onClick={onClose}>
          <div className="bg-white rounded-2xl sm:rounded-[3rem] border border-gray-100 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* Header - Fixed to top */}
            <div className="shrink-0 z-10 bg-white flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-50">
              <div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none">Send Enquiry</h3>
                <p className="text-[11px] sm:text-[13px] text-gray-500 font-medium mt-1.5 sm:mt-2">Direct enquiry to venue management</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all group">
                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
              </button>
            </div>

            {done ? (
              <div className="p-16 text-center overflow-y-auto">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100/50">
                  <Sparkles className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Request Shared!</h4>
                <p className="text-gray-500 font-medium max-w-[280px] mx-auto mb-8 text-[15px] leading-relaxed">
                  We've sent your requirements. Our event specialist will reach out to you within 30 minutes.
                </p>
                <button onClick={onClose} className="bg-gray-900 hover:bg-black text-white px-12 py-3.5 rounded-xl font-bold text-sm tracking-widest transition-all shadow-xl shadow-gray-200">
                  Done
                </button>
              </div>
            ) : (
              <form className="flex flex-col min-h-0 flex-1" onSubmit={handleSubmit(onSubmit as any)}>
                <div className="p-6 sm:p-8 space-y-8 md:space-y-10 overflow-y-auto flex-1 scrollbar-hide">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex flex-col gap-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Selected Venue</p>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <span className="text-[14px] md:text-[15px] font-bold text-gray-500 truncate">{venueName}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex flex-col gap-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Venue Type</p>
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-gray-400" />
                        <span className="text-[14px] md:text-[15px] font-bold text-gray-500 truncate">{venueType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-gray-50" />
                    <h5 className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.25em] text-gray-300 whitespace-nowrap">Event Configuration</h5>
                    <div className="h-[1px] flex-1 bg-gray-50" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="md:col-span-2 bg-white rounded-xl p-4 border border-gray-100 hover:border-[#FF9530]/20 transition-all shadow-sm">
                      <Controller
                        name="event_type"
                        control={control}
                        render={({ field }) => (
                          <PremiumSelect
                            {...field}
                            label="Event Type"
                            icon={<Sparkles className="w-5 h-5 text-[#FF9530]" />}
                            options={eventOptions}
                            placeholder="Occasion?"
                            className="bg-transparent"
                          />
                        )}
                      />
                      {errors.event_type && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase tracking-wider">{errors.event_type.message}</p>}
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#FF9530]/20 transition-all shadow-sm">
                      <p className="text-[11px] md:text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Guest PAX</p>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-[#FF9530] mr-3 shrink-0" />
                        <input
                          type="number"
                          {...register('no_of_guests')}
                          placeholder="e.g. 250"
                          className="w-full bg-transparent p-0 text-[14px] md:text-[15px] font-bold text-gray-900 outline-none placeholder:text-gray-300 placeholder:font-normal"
                        />
                      </div>
                      {errors.no_of_guests && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase tracking-wider">{errors.no_of_guests.message}</p>}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#FF9530]/20 transition-all shadow-sm">
                    <Controller
                      name="date_range"
                      control={control}
                      render={({ field }) => (
                        <PremiumDatePicker
                          label="Event Date(s)"
                          selectsRange
                          startDate={field.value[0]}
                          endDate={field.value[1]}
                          onChange={(update: any) => field.onChange(update)}
                          className="bg-transparent"
                          monthsShown={1}
                        />
                      )}
                    />
                    {errors.date_range && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase tracking-wider">{errors.date_range.message}</p>}
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-[1px] flex-1 bg-gray-50" />
                      <h5 className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.25em] text-gray-300 whitespace-nowrap">Guest Concierge Details</h5>
                      <div className="h-[1px] flex-1 bg-gray-50" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 group focus-within:border-[#FF9530]/30 transition-all shadow-sm">
                        <p className="text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</p>
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-[#FF9530] mr-3" />
                          <input
                            type="text"
                            {...register('guest_name')}
                            placeholder="Ex: John Doe"
                            className="w-full bg-transparent p-0 text-[14px] md:text-[15px] font-bold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-300"
                          />
                        </div>
                        {errors.guest_name && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">{errors.guest_name.message}</p>}
                      </div>

                      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 group focus-within:border-[#FF9530]/30 transition-all shadow-sm">
                        <p className="text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</p>
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-[#FF9530] mr-3" />
                          <input
                            type="email"
                            {...register('guest_email')}
                            placeholder="john@example.com"
                            className="w-full bg-transparent p-0 text-[14px] md:text-[15px] font-bold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-300"
                          />
                        </div>
                        {errors.guest_email && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">{errors.guest_email.message}</p>}
                      </div>

                      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 group focus-within:border-[#FF9530]/30 transition-all shadow-sm">
                        <p className="text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile No</p>
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-[#FF9530] mr-3" />
                          <input
                            type="tel"
                            {...register('guest_mobile')}
                            placeholder="8888888888"
                            className="w-full bg-transparent p-0 text-[14px] md:text-[15px] font-bold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-300"
                          />
                        </div>
                        {errors.guest_mobile && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">{errors.guest_mobile.message}</p>}
                      </div>

                      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 group focus-within:border-[#FF9530]/30 transition-all shadow-sm">
                        <p className="text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Meal Preference</p>
                        <div className="flex items-center">
                          <Utensils className="w-5 h-5 text-[#FF9530] mr-3" />
                          <input
                            type="text"
                            {...register('meal_preference')}
                            placeholder="Veg / Non-Veg"
                            className="w-full bg-transparent p-0 text-[14px] md:text-[15px] font-bold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-300"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 md:p-5 group focus-within:border-[#FF9530]/30 transition-all shadow-sm">
                         <p className="text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Special Message</p>
                         <div className="flex items-start h-full">
                            <FileText className="w-5 h-5 text-[#FF9530] mr-3 mt-1 shrink-0" />
                            <textarea
                              {...register('message')}
                              rows={2}
                              placeholder="Any specific decor or timing needs..."
                              className="w-full bg-transparent p-0 text-[14px] md:text-[15px] font-bold text-gray-900 outline-none resize-none placeholder:font-normal placeholder:text-gray-300 min-h-[60px]"
                            />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 py-5 border-t border-gray-50 gap-6 sm:gap-0 bg-white">
                  <p className="text-[9px] text-gray-400 max-w-[200px] leading-relaxed font-bold uppercase tracking-wider text-center sm:text-left">
                    Trusted by 500+ venues nationwide <br/>
                    <span className="text-orange-400/80">Verified Spodia Enquiry</span>
                  </p>
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <button type="button" onClick={onClose} className="hidden sm:block font-black text-xs text-gray-400 hover:text-gray-900 transition-all uppercase tracking-widest">
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={mutation.isPending}
                      className={`flex-1 sm:flex-none sm:min-w-[180px] bg-[#FF9530] hover:bg-[#FF8000] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 ${mutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Request
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
