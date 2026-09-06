'use client';

import { useRef, type MutableRefObject } from 'react';
import MainSearchBar from '@/components/shared/MainSearchBar';
import {
  CheckCircle2,
  Star,
  Lock,
  ShieldCheck,
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

/** Light glass pills: frosted white + warm accent icons (reference UI) */
const TRUST_BADGES: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: 'Best Price Guarantee' },
  { icon: MessagesSquare, label: '10M+ Trusted Reviews' },
  { icon: Headphones, label: '24/7 Global Support' },
  { icon: Lock, label: 'SSL Secured Booking' },
];

const TRUST_PILL_CLASS =
  'inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/35 bg-white/35 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[9px] xs:text-[10px] sm:text-[11px] font-medium text-white shadow-[0_2px_16px_rgba(0,0,0,0.2)]';

const TRUST_ICON_CLASS =
  'w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#FF9530] drop-shadow-[0_0_8px_rgba(255,149,48,0.45)]';

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
    icon: ShieldCheck,
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
    <section className="relative z-10 w-full bg-white pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-12 sm:pb-16">
      {/* pt clears fixed header + ~24–32px breathing room (aligned with main nav px) */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div className="relative w-full">
          {/* Inner box height = image only so search bar bottom-0 + translate-y-1/2 straddles the hero edge */}
          <div className="relative w-full">
            <div className="relative w-full h-[310px] sm:h-[350px] md:h-[420px] lg:h-[440px] xl:h-[480px] rounded-[1.25rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
              <Image
                src={IMAGES.heroSearchBg}
                alt="Luxury resort pool at dusk"
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/50 pointer-events-none"
                aria-hidden
              />

              {/* Headline + pills: positioned in upper portion of hero image */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-start md:justify-center text-center px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10 md:py-8">
                <h1 className="text-white font-bold tracking-tight text-xl xs:text-2xl sm:text-4xl md:text-[2.5rem] lg:text-[2.75rem] xl:text-[3rem] leading-tight max-w-[20rem] sm:max-w-[44rem] lg:max-w-[48rem] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
                  <span className="block">Find your perfect stay,</span>
                  <span className="block mt-1 sm:mt-2">Anywhere in the World</span>
                </h1>

                <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2.5 mt-3 sm:mt-6 max-w-[min(100%,58rem)]">
                  {TRUST_BADGES.map(({ icon: Icon, label }) => (
                    <div key={label} className={TRUST_PILL_CLASS}>
                      <Icon className={TRUST_ICON_CLASS} strokeWidth={2.25} />
                      <span className="whitespace-nowrap">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Search bar: straddles middle half of hero image bottom edge on mobile (-mt-24 = ~96px overlap) */}
            <div className="relative md:absolute md:left-1/2 md:bottom-0 z-20 w-full -mt-24 sm:-mt-28 md:mt-0 md:-translate-x-1/2 md:translate-y-1/2 px-1.5 sm:px-3 md:px-4 lg:px-6">
              <MainSearchBar
                className="!bg-white/95 !backdrop-blur-xl border border-white/20 shadow-xl"
              />
            </div>
          </div>

          <div
            className="hidden md:block h-[3.75rem] lg:h-16 xl:h-[4.25rem] shrink-0"
            aria-hidden
          />
        </div>

        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-y-3 gap-x-6 sm:gap-x-10 lg:gap-x-14 px-1 text-center sm:text-left">
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
