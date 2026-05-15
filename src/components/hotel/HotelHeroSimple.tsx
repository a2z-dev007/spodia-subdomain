import React from "react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

type Props = {
  title: string | React.ReactNode;
  subtitle?: string;
  image?: string;
};

export default function HotelHeroSimple({ title, subtitle, image }: Props) {
  return (
    <section className="relative min-h-[400px] h-[50vh] w-full flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <Image
          src={image || IMAGES.bgSection.src}
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto text-center px-6">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 max-w-[800px] mx-auto leading-relaxed font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
