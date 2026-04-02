"use client"

import React from "react"
import { Card, CardContent } from "../ui/card"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { MdStar } from "react-icons/md";
import { ImQuotesLeft } from "react-icons/im";
import { TestimonialRecord } from '@/services/testimonialsService';

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface TestimonialListClientProps {
  initialTestimonials: TestimonialRecord[];
  initialError: string | null;
}

const TestimonialListClient = ({ initialTestimonials, initialError }: TestimonialListClientProps) => {
    if (initialError) {
        return null;
    }

    if (initialTestimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        What Our <span className="text-orange-500">Hosts</span> Say
                    </h2>
                    <p className="text-xl text-gray-500">
                        Real stories from businesses that trust us every day.
                    </p>
                </div>

                {/* Swiper */}
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={"auto"}
                    centeredSlides={true}
                    loop={true}
                    pagination={{
                        el: ".custom-pagination",
                        clickable: true,
                    }}
                    navigation={{
                        nextEl: ".custom-swiper-next",
                        prevEl: ".custom-swiper-prev",
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    className="!pb-12" // Increased bottom padding for space
                >
                    {initialTestimonials.map((t) => (
                        <SwiperSlide key={t.id} className="!w-auto !h-auto flex py-8">
                            <Card className="rounded-2xl shadow-lg bg-white w-[90vw] md:w-[600px] lg:w-[640px] !h-full flex flex-col overflow-hidden transition-all duration-300">
                                <CardContent className="p-6 md:p-8 !h-full flex flex-col">
                                    <div className="flex flex-col sm:flex-row items-stretch gap-6 flex-1">
                                        <div className="flex-shrink-0 w-full sm:w-auto self-start sm:self-stretch">
                                            <img
                                                src={t.file}
                                                alt={t.name}
                                                className="rounded-lg object-cover w-full h-48 sm:w-48 sm:h-full min-h-[192px]"
                                            />
                                        </div>

                                        {/* Text content */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <MdStar
                                                            key={i}
                                                            className="h-6 w-6 text-yellow-400"
                                                        />
                                                    ))}
                                                </div>
                                                <ImQuotesLeft className="w-8 h-8 sm:w-12 sm:h-12 text-orange-400/50" />
                                            </div>
                                            <p className="text-gray-700 text-base leading-relaxed mb-6 flex-1 italic">
                                                {t.description}
                                            </p>
                                            <div className="mt-auto pt-4 border-t border-gray-100">
                                                <h4 className="font-bold text-gray-900 text-base uppercase tracking-wide">
                                                    {t.name}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">{t.designation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>


                {/* Navigation + Pagination */}
                <div className="flex justify-center items-center">
                    <div className="flex justify-center items-center mt-2 gap-4">
                        <button className="custom-swiper-prev text-orange-500 hover:bg-orange-100 transition-colors w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold active:scale-95 shadow-sm">
                            &#8249;
                        </button>
                        <div className="custom-pagination flex justify-center items-center gap-2" />
                        <button className="custom-swiper-next text-orange-500 hover:bg-orange-100 transition-colors w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold active:scale-95 shadow-sm">
                            &#8250;
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background-color: #d1d5db; /* gray-300 */
                    opacity: 1;
                    transition: all 0.3s ease;
                }
                .swiper-pagination-bullet-active {
                    background-color: #f97316; /* orange-500 */
                    width: 24px;
                    border-radius: 5px;
                }
                /* FORCE EQUAL HEIGHT IN SWIPER */
                .swiper-wrapper {
                    display: flex !important;
                    align-items: stretch !important;
                }
                .swiper-slide {
                    display: flex !important;
                    height: auto !important;
                }
            `}</style>
        </section>
    )
}

export default TestimonialListClient
