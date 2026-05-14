import React from "react";
import Image from "next/image";
import { ShieldCheck, Star } from "lucide-react";

interface Badge {
  icon: React.ReactNode;
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
}

const HotelHeroPremium = ({
  title,
  subtitle,
  pillIcon,
  pillText,
  badges,
  gradientColor = "#FF9530",
  backgroundImage
}: HotelHeroPremiumProps) => {
  return (
    <section className="relative py-24 md:py-32 bg-gray-900 text-white overflow-hidden px-6 min-h-[500px] flex items-center">
      {/* Background Image & Overlays */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image 
            src={backgroundImage} 
            alt="Hero Background" 
            fill 
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Background Glows */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none -mr-48 -mt-48 z-10"
        style={{ backgroundColor: gradientColor }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 pointer-events-none -ml-24 -mb-24 z-10"
        style={{ backgroundColor: "#078ED8" }}
      />

      <div className="max-w-[1200px] mx-auto text-center relative z-20">
        {/* Pill Badge */}
        {(pillIcon || pillText) && (
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8 backdrop-blur-sm">
             {pillIcon && <span className="text-[#FF9530]">{pillIcon}</span>}
             {pillText && (
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                 {pillText}
               </span>
             )}
          </div>
        )}

        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
          {title}
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          {subtitle}
        </p>

        {/* Trust Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
             {badges.map((badge, i) => (
               <div 
                 key={i} 
                 className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300"
               >
                  <span className="text-[#FF9530]">{badge.icon}</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/90">
                    {badge.text}
                  </span>
               </div>
             ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelHeroPremium;
