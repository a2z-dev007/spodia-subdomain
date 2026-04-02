'use client'

import { useRef, useEffect, useState } from 'react'
import SectionHeader from './SectionHeader'
import { fetchEventTypes } from '@/lib/api/eventsEndpoints'
import type { EventTypeRecord } from '@/lib/api/eventsEndpoints'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { IMAGES } from '@/assets/images'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

export default function EventTypesCarousel() {
  const [eventTypes, setEventTypes] = useState<EventTypeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchEventTypes()
      .then((res) => {
        if (!cancelled && res.records) setEventTypes(res.records)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load event types')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <section className="py-20 bg-gray-50/50 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-6">
          <SectionHeader
            eyebrow="Moments that Matter"
            title="Plan Your Perfect Celebration"
            subtitle="From magical weddings and surprise birthdays to professional corporate meets, find the vibe that fits."
          />
         
          {/* Scroll & See All Navigation */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-6 shrink-0 sm:mb-8">
            <Link 
              href="/event/list" 
              className="text-sm font-black text-gray-400 uppercase tracking-widest hover:text-[#FF9530] transition-colors"
            >
              See All
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-700 shadow-xl shadow-gray-200/50 sm:h-12 sm:w-12 [-webkit-tap-highlight-color:transparent]"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-700 shadow-xl shadow-gray-200/50 sm:h-12 sm:w-12 [-webkit-tap-highlight-color:transparent]"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="shrink-0 w-[140px] sm:w-[200px] flex flex-col items-center">
                <div className="w-full aspect-[4/5] rounded-[2rem] bg-gray-100 animate-pulse" />
                <div className="mt-4 h-5 w-24 rounded-lg bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="py-10 text-gray-500 text-sm font-medium">{error}</p>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper
            }}
            spaceBetween={16}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: { slidesPerView: 'auto', spaceBetween: 16 },
              640: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 5, spaceBetween: 24 },
              1280: { slidesPerView: 6, spaceBetween: 24 },
            }}
            className="w-full pb-10"
          >
            {eventTypes.map((v) => (
              <SwiperSlide key={v.id} className="!h-auto !w-[140px] sm:!w-[200px]">
                <Link
                  href={`/events/search?event_type=${v.id}`}
                  className="group block transition-all duration-500"
                >
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] group-hover:-translate-y-2 transition-all duration-500">
                    <img
                      src={v.file || IMAGES.placeholder.src}
                      alt={v.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = IMAGES.placeholder.src
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 bg-[#FF9530] rounded-xl px-2.5 py-1 text-[9px] font-black text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      VIEW
                    </div>
                  </div>
                  
                  <div className="text-center transition-all duration-300 px-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900 group-hover:text-[#FF9530] transition-colors leading-tight">
                      {v.name}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}
