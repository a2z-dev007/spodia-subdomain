'use client';

import { useRef, type MutableRefObject } from 'react';
import PremiumHotelSearchBar from '@/components/home/PremiumHotelSearchBar';
import {
  CheckCircle2,
  Star,
  Lock,
  Shield,
  Headphones,
  MessagesSquare,
  ChevronLeft,
  ChevronRight,
  Landmark,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { IMAGES } from '@/assets/images';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

/** Figma: one row of pills — same semi-transparent dark bg + light border + white icon/text */
const TRUST_BADGES: { icon: LucideIcon; label: string }[] = [
  { icon: Shield, label: 'Best Price Guarantee' },
  { icon: MessagesSquare, label: '10M+ Trusted Reviews' },
  { icon: Headphones, label: '24/7 Global Support' },
  { icon: Lock, label: 'SSL Secured Booking' },
];

const TRUST_PILL_CLASS =
  'inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/45 bg-neutral-950/45 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-[11px] font-medium text-white shadow-sm';

const FEATURE_STRIP = [
  {
    icon: CheckCircle2,
    text: 'Free Cancellation & Flexible Booking available',
    iconClass: 'text-emerald-500',
  },
  {
    icon: Star,
    text: '4.8 Rated by 50K+ travelers',
    iconClass: 'text-[#FF9530]',
  },
  {
    icon: CheckCircle2,
    text: 'Verified properties',
    iconClass: 'text-emerald-500',
  },
] as const;

const DESTINATIONS: { id: string; name: string }[] = [
  { id: 'd1', name: 'Darjeeling' },
  { id: 'd2', name: 'Agra' },
  { id: 'd3', name: 'Mumbai' },
  { id: 'd4', name: 'Chennai' },
  { id: 'd5', name: 'New Delhi' },
  { id: 'd6', name: 'Lucknow' },
  { id: 'd7', name: 'Guwahati' },
  { id: 'd8', name: 'Shillong' },
  { id: 'd9', name: 'Bengaluru' },
  { id: 'd10', name: 'Hyderabad' },
  { id: 'd11', name: 'Kolkata' },
  { id: 'd12', name: 'Goa' },
  { id: 'd13', name: 'Jaipur' },
  { id: 'd14', name: 'Pune' },
  { id: 'd15', name: 'Manali' },
  { id: 'd16', name: 'Udaipur' },
];

const heroNavBtnClass =
  'absolute top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm [-webkit-tap-highlight-color:transparent]';

function HeroDestinationCarousel({
  swiperRef,
}: {
  swiperRef: MutableRefObject<SwiperType | null>;
}) {
  return (
    <div className="relative mt-8 sm:mt-12 w-full max-w-[1920px] mx-auto overflow-x-hidden px-4 sm:px-6 lg:px-10">
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView="auto"
        spaceBetween={28}
        className="hero-dest-swiper max-w-full overflow-hidden py-3"
        breakpoints={{
          0: { centeredSlides: false },
          768: { centeredSlides: true, centeredSlidesBounds: true },
        }}
      >
        {DESTINATIONS.map(({ id, name }) => (
          <SwiperSlide key={id} className="!w-[72px] sm:!w-20">
            <button type="button" className="group flex w-full flex-col items-center">
              <div className="flex h-[60px] w-[60px] sm:h-[68px] sm:w-[68px] items-center justify-center rounded-full border border-gray-200 bg-gray-100 shadow-sm transition-colors group-hover:border-gray-300">
                <Landmark
                  className="h-7 w-7 text-gray-400 group-hover:text-gray-500 sm:h-8 sm:w-8"
                  strokeWidth={1.35}
                />
              </div>
              <span className="mt-2.5 text-center text-[11px] font-medium leading-tight text-gray-600 transition-colors group-hover:text-[#FF9530] sm:text-xs">
                {name}
              </span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        type="button"
        aria-label="Previous destinations"
        onClick={(e) => {
          e.preventDefault();
          swiperRef.current?.slidePrev();
        }}
        className={`${heroNavBtnClass} left-2 sm:left-4 lg:left-6`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next destinations"
        onClick={(e) => {
          e.preventDefault();
          swiperRef.current?.slideNext();
        }}
        className={`${heroNavBtnClass} right-2 sm:right-4 lg:right-6`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function HeroSection() {
  const heroDestSwiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative z-10 w-full bg-white pt-24 sm:pt-28 lg:pt-[8.75rem] pb-12 sm:pb-16">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <div className="relative w-full h-[300px] sm:h-[380px] lg:h-[440px] xl:h-[480px] rounded-[1.75rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <Image
            src={IMAGES.heroSearchBg}
            alt="Luxury resort pool at dusk"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Figma: subtle overlay — photo stays vivid */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/5 to-black/20 pointer-events-none"
            aria-hidden
          />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-10 pb-[4.5rem] sm:pb-24 lg:pb-28">
            <h1 className="text-white font-bold tracking-[0.02em] text-[1.6875rem] sm:text-4xl md:text-[2.625rem] lg:text-[2.875rem] xl:text-[3.125rem] leading-[1.14] max-w-[20rem] sm:max-w-[46rem] [text-shadow:0_2px_16px_rgba(0,0,0,0.22)]">
              <span className="block">Find your perfect stay,</span>
              <span className="block mt-1">Anywhere in the World</span>
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 mt-6 sm:mt-8 max-w-[min(100%,56rem)]">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className={TRUST_PILL_CLASS}>
                  <Icon
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-white opacity-95"
                    strokeWidth={2}
                  />
                  <span className="whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-20 -mt-[3.25rem] sm:-mt-[3.75rem] lg:-mt-[4.25rem] flex justify-center w-full px-1 sm:px-2">
          <PremiumHotelSearchBar
            variant="minimal"
            containerClassName="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
          />
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-y-3 gap-x-6 sm:gap-x-10 lg:gap-x-16 text-center sm:text-left px-3">
          {FEATURE_STRIP.map(({ icon: Icon, text, iconClass }) => (
            <div
              key={text}
              className="flex items-center gap-2 sm:gap-2.5 max-w-[320px] sm:max-w-none justify-center sm:justify-start"
            >
              <Icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0 ${iconClass}`} strokeWidth={2.25} />
              <span className="text-[13px] sm:text-sm text-neutral-600 font-medium leading-snug">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

 
    </section>
  );
}
