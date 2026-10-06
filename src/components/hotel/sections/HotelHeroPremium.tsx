import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/assets/images";
import { ShieldCheck, ArrowRight } from "lucide-react";

interface Badge {
  icon?: React.ReactNode;
  text: string;
}

interface HotelHeroPremiumProps {
  title: React.ReactNode;
  subtitle: string;
  pillIcon?: React.ReactNode;
  pillText?: string;
  badges?: Badge[];
  gradientColor?: string;
  backgroundImage?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
}

const HotelHeroPremium: React.FC<HotelHeroPremiumProps> = ({
  title,
  subtitle,
  pillIcon,
  pillText,
  badges,
  backgroundImage,
  primaryBtnText = "Book Now",
  primaryBtnHref = "#",
  secondaryBtnText = "View Details",
  secondaryBtnHref = "#",
}) => {
  return (
    <section className="relative min-h-fit sm:min-h-[420px] md:min-h-[500px] h-auto md:h-[55vh] w-full flex items-center justify-center overflow-hidden pt-10 pb-16 md:pt-32 md:pb-24 font-manrope">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage || IMAGES.bgSection.src}
          alt="Hero Background"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/70" />
      </div>

      <div className="max-w-[1200px] mx-auto text-center relative z-20 px-4 md:px-6 w-full flex flex-col items-center">
        {/* Badges / Pill */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-5 w-full max-w-full md:max-w-none">
          {pillText && (
            <span className="bg-white/15 backdrop-blur-md text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/20 flex items-center gap-1 sm:gap-1.5 uppercase tracking-wider">
              {pillIcon && <span className="text-[#FF9530]">{pillIcon}</span>}
              {pillText}
            </span>
          )}

          {badges && badges.length > 0
            ? badges.map((badge, i) => (
                <span
                  key={i}
                  className="bg-white/15 backdrop-blur-md text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full border border-white/20 flex items-center gap-1 sm:gap-1.5"
                >
                  <span className="text-[#FF9530]">{badge.icon || <ShieldCheck className="w-3.5 h-3.5" />}</span>
                  {badge.text}
                </span>
              ))
            : (
                <span className="bg-white/15 backdrop-blur-md text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full border border-white/20 flex items-center gap-1 sm:gap-1.5">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF9530]" /> Best Price Guarantee
                </span>
              )}
        </div>

        {/* Heading */}
        <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 md:mb-5 tracking-tight leading-tight px-2 sm:px-0">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-[700px] mx-auto mb-6 md:mb-10 leading-relaxed font-semibold px-2">
          {subtitle}
        </p>

        {/* Standardized Primary & Glass UI Secondary Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto px-6 sm:px-0">
          <Link
            href={primaryBtnHref}
            className="w-full sm:w-auto justify-center px-4 py-3.5 sm:px-8 sm:py-3.5 rounded-xl font-black text-[12px] sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-white shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>{primaryBtnText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={secondaryBtnHref}
            className="w-full sm:w-auto justify-center text-center px-4 py-3.5 sm:px-8 sm:py-3.5 rounded-xl font-black text-[12px] sm:text-sm uppercase tracking-wider bg-black/40 sm:bg-white/15 backdrop-blur-md text-white border border-white/30 hover:bg-white/25 active:scale-[0.98] transition-all flex items-center"
          >
            {secondaryBtnText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HotelHeroPremium;
