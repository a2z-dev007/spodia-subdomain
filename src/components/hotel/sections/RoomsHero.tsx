"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import roomsData from "@/data/jsons/rooms.json";

export default function RoomsHero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full px-4 md:px-8 py-6 md:py-10 h-[600px] md:h-[800px]">
      <div className="overflow-hidden h-full rounded-[40px] shadow-2xl relative" ref={emblaRef}>
        <div className="flex h-full">
          {roomsData.heroSlider.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full min-w-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-6">
                <AnimatePresence mode="wait">
                  {selectedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="max-w-4xl"
                    >
                      <h1 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-white/90 mb-10 font-medium tracking-wide">
                        {slide.subtext}
                      </p>
                      <Button className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-bold rounded-full px-10 py-4 h-auto active:scale-95 transition-all text-base group">
                        {slide.buttonText}
                        <span className="ml-2 text-xl">→</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {roomsData.heroSlider.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedIndex === index 
                  ? "w-12 bg-white" 
                  : "w-8 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
