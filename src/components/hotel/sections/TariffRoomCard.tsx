"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ArrowRight, Star } from "lucide-react";

interface TariffRoomCardProps {
  room: {
    id: number;
    name: string;
    images: string[];
    amenities: string[];
    price: number;
    oldPrice: number;
    view: string;
    description?: string;
  };
}

const TariffRoomCard = ({ room }: TariffRoomCardProps) => {
  const discount = Math.round(((room.oldPrice - room.price) / room.oldPrice) * 100);

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-md hover:shadow-lg overflow-hidden group transition-all duration-500 mb-4">
      <div className="flex flex-col lg:flex-row">
        {/* Image Gallery */}
        <div className="w-full lg:w-[30%] relative h-[200px] lg:h-auto">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="h-full w-full"
          >
            {room.images.map((img, i) => (
              <SwiperSlide key={i}>
                <Image 
                  src={img} 
                  alt={room.name} 
                  fill 
                  className="object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-6 left-6 z-10">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
              Save {discount}%
            </span>
          </div>
        </div>

        {/* Room Info */}
        <div className="p-4 lg:p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{room.name}</h3>
              <p className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {room.view}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
              <Star className="w-3 h-3 text-[#FF9530] fill-[#FF9530]" />
              <span className="text-xs font-bold text-gray-900">4.8</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.map((amenity, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                <span className="text-[11px] font-medium text-gray-600">{amenity}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-end gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 line-through font-bold text-sm">₹{room.oldPrice.toLocaleString()}</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Discounted Rate
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-gray-900">₹{room.price.toLocaleString()}</span>
                <span className="text-gray-400 font-bold text-xs">/night</span>
              </div>
              <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-widest">
                Includes: Breakfast, Taxes, WiFi.
              </p>
            </div>

            <button className="w-full md:w-auto bg-gray-900 text-white px-5 py-2.5 rounded-[12px] font-bold text-[11px] uppercase tracking-widest hover:bg-[#FF9530] transition-all flex items-center justify-center gap-2 group">
              Select Room
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffRoomCard;
