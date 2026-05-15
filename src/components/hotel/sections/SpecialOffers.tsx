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
      icon: <Sparkles className="w-8 h-8" />,
      color: "bg-blue-600",
      hours: 48,
    },
    {
      title: "Honeymoon Package",
      subtitle: "Free Champagne + Spa Credit",
      icon: <Gift className="w-8 h-8" />,
      color: "bg-purple-600",
      hours: 24,
    },
    {
      title: "Weekday Special",
      subtitle: "15% Off for Business Travelers",
      icon: <Coffee className="w-8 h-8" />,
      color: "bg-[#FF9530]",
      hours: 72,
    },
  ];

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Limited Time Offers</h2>
            <p className="text-gray-600 text-xl font-medium">Unlock exclusive benefits by booking these curated packages.</p>
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
            <SwiperSlide key={i}>
              <div className={`${offer.color} p-10 rounded-[48px] h-[450px] text-white flex flex-col relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-700" />
                
                <div className="mb-8 p-4 bg-white/20 rounded-[24px] w-fit backdrop-blur-md">
                   {offer.icon}
                </div>
                
                <h3 className="text-3xl font-black mb-4 leading-tight">{offer.title}</h3>
                <p className="text-white/80 font-bold mb-10 text-lg">{offer.subtitle}</p>
                
                <div className="mt-auto">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-4">Offer Ends In:</p>
                   <CountdownTimer hours={offer.hours} />
                </div>
                
                <button className="absolute bottom-10 right-10 w-16 h-16 bg-white text-gray-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                   <Sparkles className="w-6 h-6" />
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
