"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Timer, Gift, Sparkles, Coffee } from "lucide-react";

const CountdownTimer = ({ hours: h }: { hours: number }) => {
  const [timeLeft, setTimeLeft] = useState(h * 3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex gap-3">
      {[
        { label: "Hrs", val: hrs },
        { label: "Min", val: mins },
        { label: "Sec", val: secs },
      ].map((item, i) => (
        <div key={i} className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center min-w-[50px]">
          <p className="text-xl font-black text-white leading-none">{item.val.toString().padStart(2, "0")}</p>
          <p className="text-[9px] font-black uppercase tracking-tighter text-white/60 mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

const SpecialOffers = () => {
  const offers = [
    {
      title: "Early Bird Discount",
      subtitle: "Book 30+ Days Ahead, Save 25%",
      icon: <Sparkles className="w-6 h-6" />,
      color: "bg-blue-600",
      hours: 48,
    },
    {
      title: "Honeymoon Package",
      subtitle: "Free Champagne + Spa Credit",
      icon: <Gift className="w-6 h-6" />,
      color: "bg-purple-600",
      hours: 24,
    },
    {
      title: "Weekday Special",
      subtitle: "15% Off for Business Travelers",
      icon: <Coffee className="w-6 h-6" />,
      color: "bg-[#FF9530]",
      hours: 72,
    },
  ];

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6 md:gap-8 text-center md:text-left">
          <div>
            <h2 className="text-[28px] md:text-4xl font-black text-gray-900 mb-3 md:mb-4 leading-[1.2]">Limited Time Offers</h2>
            <p className="text-gray-600 text-base md:text-lg font-medium">Unlock exclusive benefits by booking these curated packages.</p>
          </div>
          <div className="flex items-center gap-4 bg-gray-900 text-white px-6 py-3 rounded-2xl">
            <Timer className="w-5 h-5 text-[#FF9530] animate-spin-slow" />
            <span className="text-xs font-black uppercase tracking-widest">Offers end soon!</span>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          className="pb-16"
        >
          {offers.map((offer, i) => (
            <SwiperSlide key={i} className="!h-auto">
              <div className={`${offer.color} p-6 md:p-8 rounded-[32px] min-h-[320px] md:min-h-[350px] h-full text-white flex flex-col relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-700 z-0" />
                
                <div className="mb-6 p-3 bg-white/20 rounded-2xl w-fit backdrop-blur-md relative z-10">
                   {offer.icon}
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight relative z-10 pr-12">{offer.title}</h3>
                <p className="text-white/80 font-bold mb-8 text-sm md:text-base relative z-10">{offer.subtitle}</p>
                
                <div className="mt-auto relative z-10 pb-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-3">Offer Ends In:</p>
                   <CountdownTimer hours={offer.hours} />
                </div>
                
                <button className="absolute bottom-6 right-6 w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl z-20">
                   <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SpecialOffers;
