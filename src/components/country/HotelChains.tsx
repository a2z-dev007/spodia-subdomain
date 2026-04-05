"use client";

import Link from "next/link";
import Image from "next/image";

interface HotelChainsProps {
  chains: Array<{
    name: string;
    logo: string;
    slug: string;
    propertyCount: number;
  }>;
}

export default function HotelChains({ chains }: HotelChainsProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Popular Hotel Chains
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Book with India's most trusted hospitality brands
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {chains.map((chain) => (
            <Link
              key={chain.slug}
              href={`/hotel-chains/${chain.slug}`}
              className="group bg-gray-50 rounded-xl p-4 md:p-6 hover:bg-gray-100 transition-colors duration-300 flex flex-col items-center justify-center text-center"
            >
              <div className="relative w-full aspect-square max-w-[120px] mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image
                  src={chain.logo}
                  alt={chain.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 line-clamp-1">
                {chain.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {chain.propertyCount} properties
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
