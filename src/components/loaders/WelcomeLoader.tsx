"use client";

import dynamic from "next/dynamic";
import { LOTTIES } from "@/assets/lotties";
import Link from "next/link";

// Dynamically import Player so it's only loaded on client
const Player = dynamic(
    () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
    { ssr: false }
);

export const WelcomeLoader = () => (
    <div
        className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6 md:px-8"
        style={{ zIndex: 1000 }}
    >
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
            {/* Lottie Animation */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mb-6 sm:mb-8">
                <Player
                    autoplay
                    loop
                    src={LOTTIES.hotelLoading}
                    style={{ height: '200px', width: "200px" }}
                />
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                Welcome to{" "}
                <Link href={"/"} className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Spodia.com
                </Link>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium mb-2 sm:mb-3">
                Your Trusted Hotel Booking Partner
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl">
                Discover top hotels, great deals, and a seamless booking experience.
            </p>

            {/* Promotional Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg mb-4 sm:mb-6 animate-pulse">
                <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base font-bold">
                    Enjoy up to 50% off on hotels you&apos;ll love
                </span>
            </div>

            {/* Deal Message */}
            <p className="text-sm sm:text-base md:text-lg text-blue-600 font-semibold mb-6 sm:mb-8">
                Great Hotels deals for you
            </p>

            {/* Loading Message */}
            <div className="flex flex-col items-center gap-2 text-gray-700 px-4">
                <div className="flex items-center gap-2">
                    
                    <p className="text-sm sm:text-base font-semibold">
                        One Moment Please
                    </p>
                    <span className="text-lg sm:text-xl">🙏</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Loading the best available deals for you
                </p>
            </div>

            {/* Loading Dots Animation */}
            <div className="flex gap-2 mt-4 sm:mt-6">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
        </div>
    </div>
);
