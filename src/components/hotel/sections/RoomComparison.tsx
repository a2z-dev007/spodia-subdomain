"use client";

import React from "react";
import Image from "next/image";
import roomsData from "@/data/jsons/rooms.json";

export default function RoomComparison() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
      <h2 className="text-[32px] font-bold text-gray-900 mb-12">
        Compare Our Best Rooms
      </h2>

      <div className="overflow-x-auto bg-white rounded-[32px] border border-gray-100 shadow-sm scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                Room Type
              </th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                Sleeps
              </th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                Size
              </th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                View
              </th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">
                Price/Night
              </th>
            </tr>
          </thead>
          <tbody>
            {roomsData.rooms.map((room) => (
              <tr 
                key={room.id} 
                className="hover:bg-gray-50/30 transition-colors border-b border-gray-100 last:border-0"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-inner">
                      <Image
                        src={room.image}
                        alt={room.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {room.title}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-[15px] font-bold text-gray-600 text-center">
                  {room.sleeps}
                </td>
                <td className="px-8 py-6 text-[15px] font-bold text-gray-600 text-center">
                  {room.size}
                </td>
                <td className="px-8 py-6 text-[15px] font-bold text-gray-400 text-center">
                  {room.view}
                </td>
                <td className="px-8 py-6 text-xl font-extrabold text-[#FF7A00] text-right">
                  ${room.price.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
