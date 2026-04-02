import SectionHeader from './SectionHeader'
import FaqItem from './FaqItem'
import SeoRow from './SeoRow'
import { seoRows } from './data'
import { MessageSquare, Quote, Sparkles, HelpCircle, PhoneIcon, MessageCircle } from 'lucide-react'
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { fetchVenueFaqs } from '@/lib/api/eventsEndpoints'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { fetchSpodiaTestimonials, TestimonialRecord } from '@/lib/api/eventsEndpoints'
import Image from 'next/image'

// ── Client Stories ──────────────────────────────────────────────────────────
export function ClientStoriesSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['spodia-testimonials'],
    queryFn: () => fetchSpodiaTestimonials(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const testimonials = data?.records || []

  if (isLoading) {
    return (
      <section className="py-12 md:pt-16 md:pb-10 lg:py-10 bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto animate-pulse">
           <div className="h-8 w-48 bg-gray-100 rounded mb-4" />
           <div className="h-12 w-96 bg-gray-100 rounded mb-16" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-[400px] bg-gray-50 rounded-[2.5rem]" />
             ))}
           </div>
        </div>
      </section>
    )
  }

  if (isError || testimonials.length === 0) return null

  return (
    <section className="py-12 md:pt-16 md:pb-10 lg:py-10  bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <SectionHeader
            eyebrow="Success Stories"
            title="Moments That Matter"
            subtitle="Join thousands of happy hosts who found their dream venues through Spodia."
          />
          <button className="bg-[#FF9530] hover:bg-[#FF8000] text-white font-black text-xs uppercase tracking-widest rounded-2xl px-10 py-5 transition-all hover:scale-105 shadow-xl shadow-orange-500/20 shrink-0 lg:mb-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            Start Your Story
          </button>
        </div>
        
        <div className="relative stories-swiper">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: '!bg-[#FF9530] !opacity-100',
              bulletClass: 'swiper-pagination-bullet !bg-gray-200 !opacity-100 !w-2 !h-2 !transition-all',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            grabCursor={true}
            className="!pb-16"
          >
            {testimonials.map((s, idx) => (
              <SwiperSlide key={s.id || idx} className="h-auto">
                <article
                  className="group bg-gray-50/50 hover:bg-white rounded-[2.5rem] border border-transparent hover:border-gray-100 p-8 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col relative h-full min-h-[400px]"
                >
                  <div className="absolute top-8 right-8 text-gray-100 group-hover:text-orange-100 transition-colors">
                    <Quote className="w-12 h-12" />
                  </div>
                  
                  <div className="mb-6 relative">
                    <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#FF9530] bg-orange-50 border border-orange-100">
                      {s.designation || 'Happy Client'}
                    </span>
                  </div>

                  <div 
                    className="text-gray-600 text-lg leading-relaxed font-medium mb-8 relative"
                    dangerouslySetInnerHTML={{ __html: s.description ? `&ldquo;${s.description.replace(/<[^>]*>?/gm, '')}&rdquo;` : "" }}
                  />

                  <div className="mt-auto pt-8 border-t border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-orange-50 group-hover:ring-orange-100 transition-all duration-500 shrink-0">
                      {s.file ? (
                        <img 
                          src={s.file} 
                          alt={s.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src = "https://ui-avatars.com/api/?name=" + s.name;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center text-gray-400">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-gray-900 text-sm tracking-tight truncate">{s.name}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5 truncate">{s.location}</p>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <style jsx global>{`
            .stories-swiper .swiper-pagination {
              bottom: 0 !important;
            }
            .stories-swiper .swiper-pagination-bullet {
              margin: 0 6px !important;
            }
            .stories-swiper .swiper-pagination-bullet-active {
              width: 24px !important;
              border-radius: 4px !important;
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}

// ── SEO Content Block ────────────────────────────────────────────────────────
export function SeoContentSection() {
  return (
    <section className="py-12 md:py-16 lg:py-12 bg-gray-50/50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl md:rounded-[2rem] border border-gray-100/50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-6 sm:p-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[2px] w-8 bg-[#FF9530] rounded-full" />
            <p className="text-[11px] font-black text-[#FF9530] uppercase tracking-[0.3em]">
              Premium Booking Platform
            </p>
          </div>
          
          <h2 className="text-2xl sm:text-5xl font-black text-gray-900 mb-6 md:mb-8 leading-tight tracking-tighter">
            Curating India's Finest <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9530] to-[#FFB770]">Celebration Spaces</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              Spodia is more than just a booking engine. We are a bridge to unforgettable experiences, helping you discover and book premium wedding venues, banquet halls, resorts, and corporate hubs across India's most vibrant cities.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF9530]" />
                  Global Reach
                </h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  Explore luxury banquet halls and scenic resorts in Delhi NCR, Mumbai, Jaipur, Udaipur, and Goa.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF9530]" />
                  Corporate Hubs
                </h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  Verified conference spaces for annual meets and team offsites with transparent pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import ReusableFaqSection from '@/components/faqs/ReusableFaqSection'

// ── FAQ Section ──────────────────────────────────────────────────────────────
export function FaqSection({ venueId }: { venueId?: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['venueFaqs', venueId],
    queryFn: () => fetchVenueFaqs(venueId!),
    enabled: !!venueId,
    staleTime: 1000 * 60 * 5,
  })

  // Format API data to match the component's expected format
  const apiFaqs = data?.records
    ?.filter(f => f.is_active)
    ?.map(f => ({ q: f.question, a: f.answer })) || []

  return <ReusableFaqSection faqs={apiFaqs} isLoading={isLoading} />
}

// // ── SEO Links Footer ─────────────────────────────────────────────────────────
// export function SeoLinksSection() {
//   return (
//     <section className="pb-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-50 pt-16">
//       <div className="max-w-7xl mx-auto flex flex-col gap-6">
//         {seoRows.map(row => (
//           <div key={row.title} className="hover:pl-4 transition-all duration-300">
//             <SeoRow {...row} />
//           </div>
//         ))}
//       </div>
//     </section>
//   )
// }
