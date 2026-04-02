"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StayDataType } from "@/data/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ViewMoreBtn from "../ui/ViewMoreBtn";
import StayCard2 from "./cards/StayCard2";
import ShimmerCardLoader from "../loaders/ShimmerCardLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { LINKS } from "@/utils/const";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";

interface TopRatedHotelsClientProps {
  initialHotels: StayDataType[];
  initialError: string | null;
}

const TopRatedHotelsClient = ({
  initialHotels,
  initialError,
}: TopRatedHotelsClientProps) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const router = useRouter();

  // Shared lightbox state for all cards
  const {
    isOpen,
    images,
    currentIndex,
    openLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between mb-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Top Rated Hotels
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Quality as judged by customers. Book at the ideal price!
            </p>
          </div>
          <ViewMoreBtn
            onClick={() =>
              router.push(`${LINKS.SEARCH_RESULTS}?show_top_rated=true`)
            }
            text="View More"
            className="hidden lg:flex"
          />
        </div>

        <div className="relative">
          {/* Custom Swiper navigation buttons */}
          <button
            className="swiper-button-prev-custom absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow [-webkit-tap-highlight-color:transparent]"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            className="swiper-button-next-custom absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow [-webkit-tap-highlight-color:transparent]"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            spaceBetween={12}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="w-full h-full"
          >
            {initialError ? (
              <SwiperSlide>
                <div className="flex items-center justify-center py-12 w-full">
                  <p className="text-red-500 dark:text-red-400">
                    {initialError}
                  </p>
                </div>
              </SwiperSlide>
            ) : initialHotels.length === 0 ? (
              <SwiperSlide>
                <div className="flex items-center justify-center py-12 w-full">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    No top rated hotels found.
                  </p>
                </div>
              </SwiperSlide>
            ) : (
              initialHotels.map((hotel) => (
                <SwiperSlide key={hotel.id} className="h-full">
                  <div className="py-4 h-full">
                    <StayCard2
                      data={hotel}
                      showCity={true}
                      onOpenLightbox={openLightbox}
                      disableInternalLightbox={true}
                    />
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>

      <div className="mt-8 flex lg:hidden justify-center px-4">
        <ViewMoreBtn
          onClick={() =>
            router.push(`${LINKS.SEARCH_RESULTS}?show_top_rated=true`)
          }
          text="View More"
        />
      </div>

      {/* Shared Lightbox for all cards - rendered at section level */}
      <Lightbox
        images={images}
        isOpen={isOpen}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onIndexChange={setIndex}
        altText="Hotel Images"
      />
    </section>
  );
};

export default TopRatedHotelsClient;
