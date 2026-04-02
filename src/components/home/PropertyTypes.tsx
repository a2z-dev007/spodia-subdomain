"use client";

import { useState, useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { IMAGES } from "@/assets/images";
import Image from "next/image";
import CardsWithGallerySlider from "./CardsWithGallerySlider";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

type CityItem = { id: string; name: string; icon: string };

const indianCities: CityItem[] = [
  { id: "new-delhi", name: "New Delhi", icon: IMAGES.newdelhi.src },
  { id: "guwahati", name: "Guwahati", icon: IMAGES.guwahati.src },
  { id: "lucknow", name: "Lucknow", icon: IMAGES.lucknow.src },
  { id: "shillong", name: "Shillong", icon: IMAGES.shillong.src },
  { id: "dibrugarh", name: "Dibrugarh", icon: IMAGES.dibrugarh.src },
  { id: "noida", name: "Noida", icon: IMAGES.noida.src },
  { id: "gurugram", name: "Gurugram", icon: IMAGES.gurugram.src },
  { id: "darjeeling", name: "Darjeeling", icon: IMAGES.darjeeling.src },
  { id: "agra", name: "Agra", icon: IMAGES.agra.src },
  { id: "mumbai", name: "Mumbai", icon: IMAGES.mumbai.src },
  { id: "chennai", name: "Chennai", icon: IMAGES.chennai.src },
  // { id: "hyderabad", name: "Hyderabad", icon: IMAGES.placeholder.src },
  // { id: "kolkata", name: "Kolkata", icon: IMAGES.placeholder.src },
  // { id: "pune", name: "Pune", icon: IMAGES.placeholder.src },
  // { id: "goa", name: "Goa", icon: IMAGES.placeholder.src },
  // { id: "bengaluru", name: "Bengaluru", icon: IMAGES.placeholder.src },
  // { id: "jaipur", name: "Jaipur", icon: IMAGES.placeholder.src },
];

const PropertyTypes = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="overflow-hidden" id="destinations-section">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <div className="transition-all duration-300 rounded-2xl">
          <div className="p-6 transition-all duration-300">
            {selectedCity && (
              <div className="flex items-center justify-between mb-4 p-3 bg-[#FF9530]/10 rounded-lg border border-[#FF9530]/20">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-[#FF9530]">
                    Filtering by: {selectedCity}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="text-xs text-[#FF9530] hover:text-[#e8851c] font-medium px-3 py-1 rounded-full border border-[#FF9530] hover:bg-[#FF9530] hover:text-white transition-all"
                >
                  Clear Filter
                </button>
              </div>
            )}

            <div className="relative">
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                loop
                slidesPerView="auto"
                spaceBetween={24}
                className="property-cities-swiper !overflow-visible pt-6"
              >
                {indianCities.map((city) => (
                  <SwiperSlide key={city.id} className="!w-auto">
                    <div
                      className={`city-item flex min-w-[100px] flex-col items-center space-y-3 cursor-pointer transition-transform hover:scale-105 group pt-1 ${
                        selectedCity === city.name ? "selected" : ""
                      }`}
                      onClick={() =>
                        setSelectedCity(selectedCity === city.name ? null : city.name)
                      }
                    >
                      <div
                        className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 text-2xl shadow-sm transition-all duration-300 group-hover:scale-110 ${
                          selectedCity === city.name
                            ? "border-orange-500 bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-md ring-4 ring-orange-500/10"
                            : "border-gray-100 bg-white group-hover:border-orange-200 group-hover:bg-orange-50"
                        }`}
                      >
                        <Image
                          src={city.icon}
                          alt={city.name}
                          width={32}
                          height={32}
                          className={`${selectedCity === city.name ? "brightness-0 invert" : ""} transition-all duration-300`}
                        />
                      </div>
                      <div className="text-center">
                        <h4
                          className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                            selectedCity === city.name
                              ? "text-orange-600"
                              : "text-gray-700 group-hover:text-orange-500"
                          }`}
                        >
                          {city.name}
                        </h4>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                type="button"
                aria-label="Previous cities"
                onClick={(e) => {
                  e.preventDefault();
                  swiperRef.current?.slidePrev();
                }}
                className="absolute -left-2 sm:-left-6 top-1/2 z-30 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-lg [-webkit-tap-highlight-color:transparent]"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                type="button"
                aria-label="Next cities"
                onClick={(e) => {
                  e.preventDefault();
                  swiperRef.current?.slideNext();
                }}
                className="absolute -right-2 sm:-right-6 top-1/2 z-30 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-lg [-webkit-tap-highlight-color:transparent]"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <CardsWithGallerySlider selectedCity={selectedCity} />
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
