'use client'

import { useState, Fragment, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Calendar, Users, Home, X, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import PremiumDatePicker from '../ui/PremiumDatePicker'
import PremiumSelect from '../ui/PremiumSelect'
import PremiumLocationSelect from '../ui/PremiumLocationSelect'
import { fetchVenueTypes, fetchEventTypes, type VenueTypesResponse, type EventTypesResponse } from '@/lib/api/eventsEndpoints'
import { IMAGES } from '@/assets/images'
import PremiumSearchBar from './PremiumSearchBar'

export default function HeroSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [location, setLocation] = useState<any>(null)
  const [venueType, setVenueType] = useState<any>(null)
  const [eventType, setEventType] = useState<any>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [guests, setGuests] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Fetch Venue Types
  const { data: venueTypesData } = useQuery<VenueTypesResponse>({
    queryKey: ['venueTypes'],
    queryFn: () => fetchVenueTypes()
  })

  // Fetch Event Types
  const { data: eventTypesData } = useQuery<EventTypesResponse>({
    queryKey: ['eventTypes'],
    queryFn: () => fetchEventTypes()
  })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prefill from URL
  useEffect(() => {
    if (venueTypesData?.records && eventTypesData?.records) {
      const cityId = searchParams.get('city')
      const cityName = searchParams.get('cityName')
      const venueTypeId = searchParams.get('venue_type')
      const eventTypeId = searchParams.get('event_type')
      const dateStr = searchParams.get('date')
      const guestsVal = searchParams.get('guests')

      if (cityId && cityName) {
        setLocation({ value: cityId, label: cityName })
      }
      
      if (venueTypeId) {
        const found = venueTypesData.records.find(r => String(r.id) === venueTypeId)
        if (found) setVenueType({ value: found.id, label: found.name })
      }

      if (eventTypeId) {
        const found = eventTypesData.records.find(r => String(r.id) === eventTypeId)
        if (found) setEventType({ value: found.id, label: found.name })
      }

      if (dateStr) {
        setDate(new Date(dateStr))
      }

      if (guestsVal) {
        setGuests(guestOptions.find(o => o.value === guestsVal) || null)
      }
    }
  }, [searchParams, venueTypesData, eventTypesData])

  const handleSearch = () => {
    if (!location?.value) {
      toast.error('Location is required', {
        description: 'Please select a city or area to find venues.',
        duration: 3000,
      });
      return;
    }
    const params = new URLSearchParams()
    if (location?.value) {
      params.set('city', String(location.value))
      params.set('cityName', location.label)
    }
    if (venueType?.value) params.set('venue_type', String(venueType.value))
    if (eventType?.value) params.set('event_type', String(eventType.value))
    if (date) params.set('date', date.toISOString().split('T')[0])
    if (guests?.value) params.set('guests', guests.value)
    router.push(`/events/search${params.toString() ? '?' + params.toString() : ''}`)
  }

  const venueOptions = venueTypesData?.records?.map(r => ({ value: r.id, label: r.name })) || []
  const eventOptions = eventTypesData?.records?.map(r => ({ value: r.id, label: r.name })) || []
  
  const guestOptions = [
    { value: '100', label: '0-100' },
    { value: '300', label: '100-300' },
    { value: '600', label: '300-600' },
    { value: '601', label: '600+' },
  ]

  return (
    <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-10 md:pt-10 bg-white overflow-hidden">
      {/* Immersive Background Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={IMAGES.eventHero.src}
          alt="Luxury Event Backdrop"
          className="w-full h-full object-cover object-center scale-105 animate-slow-zoom origin-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-white" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-white" />
      </div>

      <div className="relative z-10 max-w-6xl w-full text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white text-[11px] sm:text-sm font-medium mb-4 animate-fade-in-up">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#FF9530] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9530]"></span>
          </span>
          India's Most Trusted Venue Booking Platform
        </div>

        {/* Hero Title */}
        <h1 className="text-[28px] sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight lg:leading-[1.1] mb-4  drop-shadow-2xl animate-fade-in-up [animation-delay:200ms]">
          Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9530] to-[#FFB770]">Perfect Event</span> <br className="hidden sm:block" />
          in Exceptional Spaces
        </h1>

        <p className="text-sm sm:text-xl text-white/90 max-w-2xl mx-auto mb-4 drop-shadow-md animate-fade-in-up [animation-delay:400ms]">
          From intimate gatherings to grand celebrations. Book verified venues with transparent pricing and instant confirmation.
        </p>

        {/* Reusable Search Bar with Snake Border */}
        <PremiumSearchBar
          location={location}
          setLocation={setLocation}
          eventType={eventType}
          setEventType={setEventType}
          venueType={venueType}
          setVenueType={setVenueType}
          date={date}
          setDate={setDate}
          guests={guests}
          setGuests={setGuests}
          handleSearch={handleSearch}
          eventOptions={eventOptions}
          venueOptions={venueOptions}
          guestOptions={guestOptions}
          className="lg:max-w-6xl animate-fade-in-up [animation-delay:600ms]"
          requiredLocation={true}
        />
    </div>

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite alternate;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
