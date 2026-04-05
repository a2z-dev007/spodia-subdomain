"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TrendingDestinationsProps {
  cities: Array<{
    id: string;
    name: string;
    image: string;
    startingPrice: number;
    currency: string;
    tags: string[];
    slug: string;
  }>;
  collections: Array<{
    id: string;
    title: string;
    type: string;
    image: string;
    description: string;
    cta: string;
  }>;
}

export default function TrendingDestinations({
  cities,
  collections,
}: TrendingDestinationsProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Top Cities Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Trending Destinations
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Explore India's most popular travel destinations
              </p>
            </div>
            <Link
              href="/destinations"
              className="hidden md:flex items-center gap-1 text-[#FF9530] hover:text-[#e8851c] font-semibold transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cities Carousel */}
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {cities.map((city) => (
                <CarouselItem
                  key={city.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link
                    href={`/site/${city.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                          {city.name}
                        </h3>
                        <p className="text-white/90 text-sm mb-2">
                          From ₹{city.startingPrice.toLocaleString()}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {city.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                          <ChevronRight className="w-5 h-5 text-[#FF9530]" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>

          {/* Mobile View All Link */}
          <div className="mt-6 md:hidden">
            <Link
              href="/destinations"
              className="flex items-center justify-center gap-1 text-[#FF9530] hover:text-[#e8851c] font-semibold transition-colors"
            >
              View All Destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Curated Collections Section */}
        <div>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Curated Collections
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Handpicked experiences for every traveler
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={collection.cta}
                className="group relative aspect-[16/9] md:aspect-[2/1] rounded-xl overflow-hidden bg-gray-100"
              >
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-white font-bold text-xl md:text-2xl lg:text-3xl mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base mb-3 line-clamp-2">
                    {collection.description}
                  </p>
                  <Button
                    variant="default"
                    className="gradient-btn text-white font-semibold px-6 py-2 rounded-full"
                  >
                    Explore Collection
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
