"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { IMAGES } from "@/assets/images";
import { LINKS } from "@/utils/const";

import "swiper/css";

const PLACEHOLDER: StaticImageData = IMAGES.placeholder;

/** Remote URL with fallback to local placeholder on error or empty src */
function DiscoveryImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}) {
  const hasFallback = useRef(false);
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(() =>
    src?.trim() ? src : PLACEHOLDER,
  );

  useEffect(() => {
    hasFallback.current = false;
    setImgSrc(src?.trim() ? src : PLACEHOLDER);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      onError={() => {
        if (hasFallback.current) return;
        hasFallback.current = true;
        setImgSrc(PLACEHOLDER);
      }}
    />
  );
}

const headingClass =
  "text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1A202C] tracking-tight";

const edgeNavBtnClass =
  "pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9530]/40 z-30 [-webkit-tap-highlight-color:transparent]";

/** Thumbnail URLs: Unsplash or Pexels only */
type WorldwideCity = { id: string; name: string; image: string };

const worldwideCities: WorldwideCity[] = [
  {
    id: "ww-fukuoka",
    name: "Fukuoka",
    image:
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-nyc",
    name: "New York",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-london",
    name: "London",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-dubai",
    name: "Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-tokyo",
    name: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-paris",
    name: "Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb89?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-india",
    name: "India",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-barcelona",
    name: "Barcelona",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-rome",
    name: "Rome",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-singapore",
    name: "Singapore",
    image:
      "https://images.unsplash.com/photo-1525625293380-5161e3ddcba6?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-seoul",
    name: "Seoul",
    image:
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-sydney",
    name: "Sydney",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-amsterdam",
    name: "Amsterdam",
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "ww-toronto",
    name: "Toronto",
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=400&fit=crop&q=80",
  },
];

type IndiaCity = {
  id: string;
  state: string;
  city: string;
  hotels: number;
  href: string;
  /** Unsplash or Pexels only */
  image: string;
};

const indiaCities: IndiaCity[] = [
  {
    id: "in-mumbai",
    state: "MAHARASHTRA",
    city: "Mumbai",
    hotels: 674,
    href: LINKS.HOTELS_MUMBAI,
    image:
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=500&fit=crop&q=80",
  },
  {
    id: "in-delhi",
    state: "DELHI",
    city: "New Delhi",
    hotels: 520,
    href: LINKS.HOTELS_DELHI,
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=500&fit=crop&q=80",
  },
  {
    id: "in-bengaluru",
    state: "KARNATAKA",
    city: "Bengaluru",
    hotels: 412,
    href: LINKS.HOTELS_BANGALORE,
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=500&fit=crop&q=80",
  },
  {
    id: "in-agra",
    state: "UTTAR PRADESH",
    city: "Agra",
    hotels: 198,
    href: LINKS.HOTELS_AGRA,
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=500&fit=crop&q=80",
  },
  {
    id: "in-jaipur",
    state: "RAJASTHAN",
    city: "Jaipur",
    hotels: 312,
    href: LINKS.HOTELS_JAIPUR,
    image:
      "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
  },
  {
    id: "in-hyderabad",
    state: "TELANGANA",
    city: "Hyderabad",
    hotels: 289,
    href: LINKS.HOTELS_HYDERABAD,
    image:
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=500&fit=crop&q=80",
  },
  {
    id: "in-goa",
    state: "GOA",
    city: "Goa",
    hotels: 445,
    href: LINKS.HOTELS_GOA,
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=500&fit=crop&q=80",
  },
  {
    id: "in-kolkata",
    state: "WEST BENGAL",
    city: "Kolkata",
    hotels: 256,
    href: LINKS.HOTELS_KOLKATA,
    image:
      "https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
  },
  {
    id: "in-pune",
    state: "MAHARASHTRA",
    city: "Pune",
    hotels: 178,
    href: LINKS.HOTELS_PUNE,
    image:
      "https://images.pexels.com/photos/13013627/pexels-photo-13013627.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
  },
  {
    id: "in-kochi",
    state: "KERALA",
    city: "Kochi",
    hotels: 142,
    href: LINKS.HOTELS_FORT_KOCHI,
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=500&fit=crop&q=80",
  },
];

/** Card images: Unsplash or Pexels only */
type SpaPlace = {
  id: string;
  name: string;
  rating: string;
  location: string;
  category: string;
  image: string;
  href: string;
};

const spaPlaces: SpaPlace[] = [
  {
    id: "spa-1",
    name: "AlWaha 30 Degrees",
    rating: "4.8",
    location: "Riyadh, Saudi Arabia",
    category: "Barber",
    image:
      "https://images.unsplash.com/photo-1503951914875-452648b713f7?w=600&h=480&fit=crop&q=80",
    href: LINKS.SPAS,
  },
  {
    id: "spa-2",
    name: "Serene Spa Lounge",
    rating: "4.9",
    location: "Dubai, UAE",
    category: "Hair Salon",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=480&fit=crop&q=80",
    href: LINKS.SPAS,
  },
  {
    id: "spa-3",
    name: "Bloom Wellness Studio",
    rating: "4.8",
    location: "Singapore",
    category: "Spa & Massage",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=480&fit=crop&q=80",
    href: LINKS.SPAS,
  },
  {
    id: "spa-4",
    name: "Urban Retreat Spa",
    rating: "4.9",
    location: "Bangkok, Thailand",
    category: "Wellness",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=480&fit=crop&q=80",
    href: LINKS.SPAS,
  },
  {
    id: "spa-5",
    name: "Oasis Hammam & Spa",
    rating: "4.7",
    location: "Istanbul, Türkiye",
    category: "Hammam",
    image:
      "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800&h=640&fit=crop",
    href: LINKS.SPAS,
  },
  {
    id: "spa-6",
    name: "Lumière Beauty Bar",
    rating: "4.9",
    location: "Paris, France",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=480&fit=crop&q=80",
    href: LINKS.SPAS,
  },
  {
    id: "spa-7",
    name: "Zen Garden Spa",
    rating: "4.8",
    location: "Kyoto, Japan",
    category: "Spa & Massage",
    image:
      "https://images.pexels.com/photos/6621463/pexels-photo-6621463.jpeg?auto=compress&cs=tinysrgb&w=800&h=640&fit=crop",
    href: LINKS.SPAS,
  },
  {
    id: "spa-8",
    name: "Coastal Calm Wellness",
    rating: "4.6",
    location: "Maldives",
    category: "Wellness",
    image:
      "https://images.pexels.com/photos/3771060/pexels-photo-3771060.jpeg?auto=compress&cs=tinysrgb&w=800&h=640&fit=crop",
    href: LINKS.SPAS,
  },
];

function CarouselEdgeNav({
  swiperRef,
  ariaLabelPrev,
  ariaLabelNext,
  className = "",
}: {
  swiperRef: MutableRefObject<SwiperType | null>;
  ariaLabelPrev: string;
  ariaLabelNext: string;
  className?: string;
}) {
  return (
    <>
      <button
        type="button"
        aria-label={ariaLabelPrev}
        className={`${edgeNavBtnClass} absolute left-0 ${className}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          swiperRef.current?.slidePrev();
        }}
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
      </button>
      <button
        type="button"
        aria-label={ariaLabelNext}
        className={`${edgeNavBtnClass} absolute right-0 ${className}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          swiperRef.current?.slideNext();
        }}
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
      </button>
    </>
  );
}

export default function HomeDiscoverySections() {
  const worldwideSwiperRef = useRef<SwiperType | null>(null);
  const indiaSwiperRef = useRef<SwiperType | null>(null);
  const spaSwiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-10 sm:pb-14">
        <h2 className={`${headingClass} mb-6`}>Popular Cities Worldwide</h2>

        <div className="relative max-w-full overflow-x-hidden">
          <Swiper
            onSwiper={(swiper) => {
              worldwideSwiperRef.current = swiper;
            }}
            slidesPerView="auto"
            spaceBetween={24}
            className="worldwide-discovery-swiper max-w-full overflow-hidden pb-2 pt-1"
            breakpoints={{
              640: { spaceBetween: 32 },
            }}
          >
            {worldwideCities.map((c) => (
              <SwiperSlide key={c.id} className="!w-[100px] sm:!w-[112px]">
                <Link
                  href={LINKS.SEARCH_RESULTS}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="relative mx-auto h-[88px] w-[88px] sm:h-[100px] sm:w-[100px] overflow-hidden rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-[1.04]">
                    <DiscoveryImage
                      src={c.image}
                      alt={c.name}
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                  <span className="text-center text-sm font-medium text-[#1A202C]">{c.name}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <CarouselEdgeNav
            swiperRef={worldwideSwiperRef}
            ariaLabelPrev="Previous cities"
            ariaLabelNext="Next cities"
            className="top-[42%] -translate-y-1/2"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-gray-100">
        <h2 className={`${headingClass} mb-6`}>Popular Cities in India</h2>

        <div className="relative max-w-full overflow-x-hidden">
          <Swiper
            onSwiper={(swiper) => {
              indiaSwiperRef.current = swiper;
            }}
            slidesPerView="auto"
            spaceBetween={16}
            className="india-discovery-swiper max-w-full overflow-hidden pb-2"
            breakpoints={{
              640: { spaceBetween: 20 },
            }}
          >
            {indiaCities.map((c) => (
              <SwiperSlide
                key={c.id}
                className="!w-[min(85vw,280px)] sm:!w-[300px] lg:!w-[320px]"
              >
                <Link href={c.href} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
                    <DiscoveryImage
                      src={c.image}
                      alt={c.city}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/95">
                        {c.state}
                      </p>
                      <p className="mt-1 text-xl font-bold text-white sm:text-2xl">{c.city}</p>
                    </div>
                  </div>
                  <p className="mt-2.5 text-sm font-medium text-[#718096]">
                    {c.hotels.toLocaleString()} hotels
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <CarouselEdgeNav
            swiperRef={indiaSwiperRef}
            ariaLabelPrev="Previous Indian cities"
            ariaLabelNext="Next Indian cities"
            className="top-[38%] -translate-y-1/2"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-gray-100">
        <h2 className={`${headingClass} mb-6`}>Trending Wellness &amp; Spas</h2>

        <div className="relative max-w-full overflow-x-hidden">
          <Swiper
            onSwiper={(swiper) => {
              spaSwiperRef.current = swiper;
            }}
            slidesPerView="auto"
            spaceBetween={16}
            className="spa-discovery-swiper max-w-full overflow-hidden pb-2"
            breakpoints={{
              640: { spaceBetween: 20 },
            }}
          >
            {spaPlaces.map((s) => (
              <SwiperSlide
                key={s.id}
                className="!w-[min(85vw,260px)] sm:!w-[280px]"
              >
                <Link href={s.href} className="group block h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                    <div className="relative aspect-[5/4] w-full overflow-hidden bg-gray-100">
                      <DiscoveryImage
                        src={s.image}
                        alt={s.name}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="280px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-[#1A202C] leading-snug">{s.name}</h3>
                        <span className="shrink-0 rounded-md bg-[#FEFCBF] px-2 py-0.5 text-xs font-bold text-amber-900">
                          {s.rating}
                        </span>
                      </div>
                      <p className="text-sm text-[#718096]">{s.location}</p>
                      <p className="text-xs text-gray-400">{s.category}</p>
                    </div>
                  </article>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <CarouselEdgeNav
            swiperRef={spaSwiperRef}
            ariaLabelPrev="Previous spas"
            ariaLabelNext="Next spas"
            className="top-[32%] -translate-y-1/2"
          />
        </div>
      </section>
    </div>
  );
}
