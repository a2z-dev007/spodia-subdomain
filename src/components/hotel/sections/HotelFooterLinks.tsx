"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

const indiaLocations = [
  "Hotels in Tinsukia",
  "Hotels in Jorhat",
  "Hotels in Itanagar",
  "Hotels in Tezpur",
  "Hotels in Guwahati",
  "Hotels in Bomdila",
  "Hotels in Bomdila",
  "Hotels in Bomdila",
  "Hotels in Bomdila",
  "Hotels in Bomdila",
];

const destinationLocations = [
  "Singapore hotels",
  "Dubai hotels",
  "London hotels",
  "Paris hotels",
  "Tokyo hotels",
  "New York hotels",
  "Mumbai hotels",
  "New Delhi hotels",
  "Bangalore hotels",
  "Bangalore hotels",
  "Bangalore hotels",
  "Bangalore hotels",
  "Bangalore hotels",
  "Bangalore hotels",
  "Bangalore hotels",
  "Chennai hotels",
  "Kolkata hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
  "Hyderabad hotels",
];

export default function HotelFooterLinks() {
  return (
    <section className="bg-white py-5 px-6 w-full mb-12">
      <div className="max-w-[1600px] mx-auto space-y-16">
        {/* Most Searched Hotels Section */}
        <div className="space-y-4 border-t border-gray-50 pt-16">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
            >
              <div className="md:col-span-3">
                <span className="text-[12px] font-black text-[#2D3142] uppercase tracking-[0.1em]">
                  MOST SEARCHED HOTELS IN INDIA
                </span>
              </div>
              <div className="md:col-span-9 flex flex-wrap gap-x-6 gap-y-2">
                {indiaLocations.map((loc, idx) => (
                  <span
                    key={idx}
                    className="text-[#9CA3AF] text-[12px] font-medium cursor-pointer hover:text-orange-500 transition-colors"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Global Destinations Section */}
        <div className="space-y-12 border-t border-gray-50 pt-16">
          <h2 className="text-[26px] font-black text-[#2D3142]">
            Search for places to stay by destination
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-6">
            {destinationLocations.map((dest, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between group cursor-pointer border-b border-transparent hover:border-gray-100 pb-1 transition-all"
              >
                <span className="text-[#9CA3AF] text-[14px] font-medium group-hover:text-[#2D3142]">
                  {dest}
                </span>
                <ChevronDown
                  size={14}
                  className="text-[#9CA3AF] opacity-40 group-hover:opacity-100 group-hover:text-orange-500 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
