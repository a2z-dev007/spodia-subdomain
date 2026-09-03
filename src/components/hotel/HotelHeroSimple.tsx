import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/assets/images";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

type Props = {
  title: string | React.ReactNode;
  subtitle?: string;
  image?: string;
  badgeText?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
};

export default function HotelHeroSimple({
  title,
  subtitle,
  image,
  badgeText = "Best Price Guarantee",
  primaryBtnText = "Book Now",
  primaryBtnHref,
  secondaryBtnText = "Explore Property",
  secondaryBtnHref,
}: Props) {
  return (
    <section className="relative min-h-[380px] h-[52vh] max-h-[500px] w-full flex items-center justify-center overflow-hidden pb-12 font-manrope">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image || IMAGES.bgSection.src}
          alt="Hero Background"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/65" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto text-center px-4 md:px-6">
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
          <span className="bg-white/15 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF9530]" /> {badgeText}
          </span>
          <span className="bg-white/15 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9530]" /> Verified Hospitality
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-[700px] mx-auto mb-6 leading-relaxed font-semibold">
            {subtitle}
          </p>
        )}

        {/* Standardized Primary & Glass UI Secondary Buttons */}
        <div className="flex flex-row items-center justify-center gap-3">
          <Link
            href={primaryBtnHref || "#"}
            className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-white shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>{primaryBtnText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={secondaryBtnHref || "#"}
            className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/30 hover:bg-white/25 active:scale-[0.98] transition-all"
          >
            {secondaryBtnText}
          </Link>
        </div>
      </div>
    </section>
  );
}
