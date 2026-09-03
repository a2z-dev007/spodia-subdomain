"use client";

import { Sparkle } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <Header />
      
      <div className="relative max-w-7xl mx-auto pt-16">
        <div className="absolute -top-8 -left-12 md:-top-16 md:-left-24 animate-pulse duration-[3000ms]">
          <Sparkle className="w-12 h-12 md:w-20 md:h-20 text-[#FF9530] opacity-80" strokeWidth={1} />
        </div>
        <div className="absolute top-12 -left-8 md:top-24 md:-left-12 animate-pulse transition-delay-500">
          <Sparkle className="w-6 h-6 md:w-8 md:h-8 text-[#FF9530] opacity-40" strokeWidth={1} />
        </div>

        <h1 
          className="text-[120px] xs:text-[160px] sm:text-[220px] md:text-[320px] lg:text-[420px] font-black leading-none tracking-tighter select-none py-4"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))'
          }}
        >
          404
        </h1>

        <div className="absolute top-1/2 -right-8 md:-right-24 animate-pulse duration-[4000ms]">
          <Sparkle className="w-12 h-12 md:w-28 md:h-28 text-[#FF9530] opacity-80" strokeWidth={1} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 mt-[-10px] md:mt-[-40px] animate-fade-in relative z-10 px-4">
        <h2 className="text-3xl md:text-6xl font-serif text-[#0F172A] mb-4 tracking-tight">
          Oops! Page not Found
        </h2>
        
        <p className="text-gray-400 font-medium text-sm md:text-lg leading-relaxed max-w-lg mx-auto">
          The page you are looking for cannot be found.<br className="hidden md:block" />
          Take a break before trying again.
        </p>

        <div className="pt-8 md:pt-10">
          <Link 
            href="/"
            className="inline-block bg-[#FF9530] hover:bg-[#FF8000] text-white px-10 py-4 md:px-14 md:py-5 rounded-full font-black text-[10px] md:text-sm uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95 shadow-orange-500/30"
          >
            Go To Home Page
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none z-[-1]">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-orange-200 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-200 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
