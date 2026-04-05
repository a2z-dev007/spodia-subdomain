"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import MainSearchBar from "@/components/shared/MainSearchBar";

interface HeroSectionProps {
  data: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    trustBadges: string[];
  };
}

export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100vh-var(--header-height))] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.backgroundImage}
          alt="India travel destination"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center">
        {/* Animated Heading Section */}
        <div className="text-center mb-8 md:mb-12 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-[1.1] tracking-tight animate-fade-in-up text-balance">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            {data.subtitle}
          </p>
        </div>

        {/* Reusable Search Bar Component */}
        <div className="w-full max-w-5xl mx-auto animate-fade-in-up animation-delay-400">
          <MainSearchBar 
            className="!bg-white/95 !backdrop-blur-xl border border-white/20"
          />
        </div>

        {/* Trust Badges - Perfectly Placed at the Bottom of viewport area */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8 md:mt-12 animate-fade-in-up animation-delay-600">
          {data.trustBadges.map((badge, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/30 hover:border-white/20 transition-all duration-300"
            >
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF9530]" />
              <span className="text-white text-xs md:text-sm font-medium">
                {badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
