"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, UtensilsCrossed, PartyPopper, Star, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HotelEcosystemProps {
  ecosystem: {
    spas: Array<{
      id: string;
      name: string;
      location: string;
      image: string;
      startingPrice: number;
      currency: string;
      rating: number;
      reviewCount: number;
      specialties: string[];
      slug: string;
    }>;
    restaurants: Array<{
      id: string;
      name: string;
      location: string;
      image: string;
      cuisine: string;
      type: string;
      michelinStars: number;
      awards: string[];
      priceRange: string;
      slug: string;
    }>;
    venues: Array<{
      id: string;
      name: string;
      location: string;
      image: string;
      type: string;
      capacity: number;
      startingPrice: number;
      currency: string;
      features: string[];
      slug: string;
    }>;
  };
}

export default function HotelEcosystem({ ecosystem }: HotelEcosystemProps) {
  const [activeTab, setActiveTab] = useState("spas");

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Beyond Hotels - Complete Experience
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
            Discover world-class spas, fine dining restaurants, and stunning event venues
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 md:mb-12">
            <TabsTrigger value="spas" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Spas</span>
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline">Restaurants</span>
            </TabsTrigger>
            <TabsTrigger value="venues" className="flex items-center gap-2">
              <PartyPopper className="w-4 h-4" />
              <span className="hidden sm:inline">Venues</span>
            </TabsTrigger>
          </TabsList>

          {/* Spas Tab */}
          <TabsContent value="spas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {ecosystem.spas.map((spa) => (
                <Link
                  key={spa.id}
                  href={`/spas/${spa.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={spa.image}
                      alt={spa.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#FF9530] fill-current" />
                      <span className="text-xs font-bold">{spa.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#FF9530] transition-colors">
                      {spa.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{spa.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {spa.specialties.slice(0, 2).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-orange-50 text-[#FF9530] px-2 py-0.5 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500">From</span>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{spa.startingPrice.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="gradient-btn text-white rounded-full"
                      >
                        Explore
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          {/* Restaurants Tab */}
          <TabsContent value="restaurants" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {ecosystem.restaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={restaurant.image}
                      alt={restaurant.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-4 md:p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#FF9530] transition-colors">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{restaurant.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {restaurant.cuisine}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {restaurant.priceRange}
                      </span>
                    </div>
                    
                    {restaurant.awards.length > 0 && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                        🏆 {restaurant.awards[0]}
                      </p>
                    )}
                    
                    <Button
                      size="sm"
                      className="w-full gradient-btn text-white rounded-full"
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          {/* Venues Tab */}
          <TabsContent value="venues" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {ecosystem.venues.map((venue) => (
                <Link
                  key={venue.id}
                  href={`/venues/${venue.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-4 md:p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#FF9530] transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{venue.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                        {venue.type}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        Up to {venue.capacity} guests
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue.features.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500">From</span>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{(venue.startingPrice / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="gradient-btn text-white rounded-full"
                      >
                        Inquire
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-8 md:mt-12">
          <Button
            asChild
            size="lg"
            className="gradient-btn text-white font-semibold px-8 py-3 rounded-full text-base"
          >
            <Link href="/experiences">
              Explore All Experiences
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
