"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useApiData } from '@/hooks/useApiData';
import { StayDataType, AuthorType, TaxonomyType } from "@/data/types";
import { DEMO_STAY_CATEGORIES } from "@/data/taxonomies";
import { ShimmerPostList } from "react-shimmer-effects";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import ViewMoreBtn from "../ui/ViewMoreBtn";
import StayCard2 from "./cards/StayCard2";
import ShimmerCardLoader from "../loaders/ShimmerCardLoader";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { BASE_URL } from "@/lib/api/apiClient";
import { mapApiToStay } from "@/utils/helper";
import { LINKS } from "@/utils/const";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const currentDate = getCurrentDate();
const API_URL = `${BASE_URL}/listings/search-promotion/?page_number=1&number_of_records=8&show_top_rated=true&start_date=${currentDate}&end_date=${currentDate}`;

const TopRatedHotels = () => {
    const { data: hotels, loading, error } = useApiData<StayDataType>(API_URL, mapApiToStay);
    // Sort by reviewStart (rating) descending and take top 8
    const topHotels = hotels
        .slice() // copy
        .sort((a, b) => b.reviewStart - a.reviewStart)
        .slice(0, 8);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const router = useRouter();
    
    // Shared lightbox state for all cards
    const { isOpen, images, currentIndex, openLightbox, closeLightbox, setIndex } = useLightbox();

    return (
        <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
                <div className="flex flex-col gap-4 md:flex-row items-center justify-between mb-6">
                    <div className="">
                        <h2 className=" text-align-center main-section-heading mb-4">Top Rated Hotels</h2>
                        <p className="text-gray-600 text-align-center main-section-subheading">Quality as judged by
                            customers. Book at the ideal price!</p>
                    </div>
                    <ViewMoreBtn onClick={() => router.push(`${LINKS.SEARCH_RESULTS}?show_top_rated=true`)} text="View More" />
                </div>

                <div className="relative">
                    {/* Custom Swiper navigation buttons */}
                    <button
                        className="swiper-button-prev-custom absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow [-webkit-tap-highlight-color:transparent]"
                        aria-label="Previous">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                        className="swiper-button-next-custom absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow [-webkit-tap-highlight-color:transparent]"
                        aria-label="Next">
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                        }}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="w-full h-full"
                    >
                        {loading ? (
                            [...Array(8)].map((_, index) => (
                                <SwiperSlide key={index}>
                                    <ShimmerCardLoader />
                                </SwiperSlide>
                            ))
                        ) : topHotels.length === 0 ? (
                            <SwiperSlide>
                                <div className="flex items-center justify-center py-12 w-full">
                                    <p className="text-neutral-500 dark:text-neutral-400">No top rated hotels found.</p>
                                </div>
                            </SwiperSlide>
                        ) : (
                            topHotels.map((hotel) => (
                                <SwiperSlide key={hotel.id}>
                                    <div className="py-4 px-2 sm:py-6 sm:px-4">
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
    )
}

export default TopRatedHotels
