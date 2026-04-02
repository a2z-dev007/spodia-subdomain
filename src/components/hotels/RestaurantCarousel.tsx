'use client';
import { useState, useEffect } from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
    imgKeyboardArrowDown,
    imgKeyboardArrowDown1
} from "@/components/hotels/svg-k0kze";
import StayCard2 from "@/components/home/cards/StayCard2";
import ShimmerCardLoader from "@/components/loaders/ShimmerCardLoader";
import { StayDataType } from "@/data/types";
import { mapApiToStay } from "@/utils/helper";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";

// Transform hotel data to StayDataType format
function transformHotelToStayData(hotel: any): StayDataType {
    return mapApiToStay(hotel);
}

interface RestaurantCarouselProps {
    hotels?: any[];
    isLoading?: boolean;
    title?: string;
}

export function RestaurantCarousel({ hotels = [], isLoading = false, title = "Top 5 Hotels" }: RestaurantCarouselProps) {
    // Shared lightbox state for all cards
    const { isOpen, images, currentIndex, openLightbox, closeLightbox, setIndex } = useLightbox();
    
    // Track if component is mounted on client to prevent hydration issues with Swiper
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render if no hotels and not loading
    if (!isLoading && hotels.length === 0) {
        return null;
    }

    // Transform hotel data to StayDataType format
    const stayData: StayDataType[] = hotels.map(transformHotelToStayData);

    // Show shimmer loading state during initial mount or when explicitly loading
    if (isLoading || !isMounted) {
        return (
            <div className="bg-white relative rounded-[20px] w-full max-w-full mb-12">
                <div className="flex flex-col justify-center relative w-full">
                    <div className="box-border content-stretch flex flex-col gap-12 items-start justify-center overflow-clip p-[40px] relative w-full">
                        <div className="flex flex-col font-bold justify-center leading-[0] min-w-full relative shrink-0 text-[28px] text-center text-gray-900">
                            <p className="leading-[normal]">{title}</p>
                        </div>
                        <div className="relative w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <ShimmerCardLoader key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[20px]"/>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white relative rounded-[20px] w-full max-w-full mb-12">
                <div className="flex flex-col justify-center relative w-full">
                    <div className="box-border content-stretch flex flex-col gap-12 items-start justify-center overflow-clip p-[40px] relative w-full">
                        <div className="flex flex-col font-bold justify-center leading-[0] min-w-full relative shrink-0 text-[28px] text-center text-gray-900">
                            <p className="leading-[normal]">{title}</p>
                        </div>

                        <div className="relative w-full">
                            <Swiper
                                modules={[Navigation]}
                                navigation={{
                                    nextEl: '.swiper-button-next-custom-restaurant',
                                    prevEl: '.swiper-button-prev-custom-restaurant',
                                }}
                                spaceBetween={24}
                                slidesPerView={1}
                                loop={false}
                                grabCursor={true}
                                watchSlidesProgress={true}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 2,
                                        spaceBetween: 24,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 24,
                                    },
                                    1280: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                    }
                                }}
                                className="restaurant-swiper !overflow-visible"
                            >
                                {stayData.map((stay) => (
                                    <SwiperSlide key={stay.id}>
                                        <div className="py-2">
                                            <StayCard2 
                                                data={stay} 
                                                showCity={true}
                                                onOpenLightbox={openLightbox}
                                                disableInternalLightbox={true}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Custom Navigation Buttons */}
                            <button
                                type="button"
                                className="swiper-button-prev-custom-restaurant absolute left-2 top-1/2 z-20 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[60px] border border-gray-200 bg-white shadow-[0px_2px_48px_-71px_rgba(0,0,0,0.12)] disabled:cursor-not-allowed disabled:opacity-50 lg:left-4 [-webkit-tap-highlight-color:transparent]">
                                <div className="flex-none rotate-[90deg]">
                                    <div className="relative size-7">
                                        <img className="block max-w-none size-full" src={imgKeyboardArrowDown1} alt="Previous"/>
                                    </div>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="swiper-button-next-custom-restaurant absolute right-2 top-1/2 z-20 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[60px] border border-gray-200 bg-white shadow-[0px_2px_48px_-71px_rgba(0,0,0,0.12)] disabled:cursor-not-allowed disabled:opacity-50 lg:right-4 [-webkit-tap-highlight-color:transparent]">
                                <div className="flex-none rotate-[270deg]">
                                    <div className="relative size-7">
                                        <img className="block max-w-none size-full" src={imgKeyboardArrowDown} alt="Next"/>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[20px]"/>
            </div>

            {/* Shared Lightbox for all cards - rendered at carousel level */}
            <Lightbox
                images={images}
                isOpen={isOpen}
                currentIndex={currentIndex}
                onClose={closeLightbox}
                onIndexChange={setIndex}
                altText="Hotel Images"
            />
        </>
    );
}