"use client";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { TestimonialRecord } from "@/services/testimonialsService";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface TestimonialsClientProps {
  initialTestimonials: TestimonialRecord[];
  initialError: string | null;
}

const TestimonialsClient = ({
  initialTestimonials,
  initialError,
}: TestimonialsClientProps) => {
  if (initialError) {
    return null;
  }

  if (initialTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#fafafa] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-full px-6 py-2.5 shadow-sm hover:shadow-md transition-all duration-500 group cursor-default">
            <div className="flex -space-x-2.5 mr-1">
              {initialTestimonials.slice(0, 3).map((testimonial, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300 ring-2 ring-orange-50 group-hover:ring-orange-100"
                >
                  <Image
                    src={testimonial.file || "/placeholder-user.jpg"}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <span className="text-xs md:text-sm text-gray-700 font-bold uppercase tracking-widest">
              Trusted by 500+ Travelers
            </span>
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 text-center mb-12 md:mb-20 tracking-tight max-w-4xl mx-auto leading-tight">
          Don&apos;t take our <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">word</span> for it
        </h2>

        <div className="relative group/swiper">
          <Swiper
            grabCursor={true}
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            pagination={{
              clickable: true,
              el: ".custom-pagination",
              bulletClass: "swiper-pagination-bullet !w-2.5 !h-2.5 !bg-gray-200 !opacity-100 transition-all duration-300 mx-1",
              bulletActiveClass: "!blue-gradient-btn !w-10 !rounded-full",
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            modules={[Pagination, Autoplay, Navigation]}
            className="mySwiper !pb-20"
          >
            {initialTestimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="!h-auto">
                <div className="bg-[#f8fbff] rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between hover:bg-white hover:shadow-[0_20px_60px_rgba(7,142,216,0.08)] border border-transparent hover:border-blue-100 transition-all duration-500 group/card">
                  <div 
                    className="text-gray-600 leading-[1.7] text-sm md:text-base font-medium mb-8"
                    dangerouslySetInnerHTML={{ __html: testimonial.description || "" }}
                  />

                  <div className="flex items-center justify-between border-t border-gray-100/60 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-blue-50 group-hover/card:ring-brand-blue/20 transition-all duration-500">
                        <Image
                          src={testimonial.file || "/placeholder-user.jpg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base tracking-tight">
                          {testimonial.name}
                        </h4>
                        <p className="text-[11px] md:text-xs text-brand-blue font-bold truncate max-w-[120px]">
                          {testimonial.designation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="text-orange-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* New Slider Navigation Controls Matching Theme */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              className="swiper-button-prev-custom flex h-14 w-14 items-center justify-center rounded-full blue-gradient-btn text-white shadow-xl shadow-blue-100 [-webkit-tap-highlight-color:transparent]"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              type="button"
              className="swiper-button-next-custom flex h-14 w-14 items-center justify-center rounded-full blue-gradient-btn text-white shadow-xl shadow-blue-100 [-webkit-tap-highlight-color:transparent]"
            >
              <ChevronRight size={28} />
            </button>
          </div>
          
          {/* Custom Theme Pagination Indicator Container */}
          <div className="custom-pagination flex justify-center gap-0 mt-8"></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsClient;
