"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, ChevronRight, CheckCircle2, ShieldCheck, Clock, Utensils, Sparkles, PartyPopper } from 'lucide-react';
import { LandingPageData } from '@/services/entityService';
import MainSearchBar from '@/components/shared/MainSearchBar';

interface LandingPageProps {
  data: LandingPageData;
  type: 'state' | 'city' | 'location';
  slug: string;
}

export default function GenericLandingPage({ data, type, slug }: LandingPageProps) {
  const { hero, topItems, featuredProperties, whySpodia, hotelChains, ecosystem, deals, seoSections } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <Image
          src={hero.backgroundImage}
          alt={hero.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-20 text-center text-white">
          <div className="animate-fade-in-up space-y-6">
            <div className="flex flex-wrap justify-center gap-3">
              {hero.trustBadges.map((badge, idx) => (
                <span key={idx} className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4 text-[#FF9530]" />
                  {badge}
                </span>
              ))}
            </div>
            
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-100 md:text-xl">
              {hero.subtitle}
            </p>

            <div className="mt-12 w-full max-w-5xl translate-y-8 px-4">
              <MainSearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Top Destinations / Areas */}
      {topItems && topItems.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  {type === 'state' ? 'Trending Destinations' : 'Popular Areas'}
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  Explore the most visited spots this season.
                </p>
              </div>
              <Link href="#" className="flex items-center font-semibold text-[#FF9530] hover:text-[#e8851c]">
                View all <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {topItems.map((item) => (
                <Link key={item.id} href={`#/site/${slug}/${item.slug}`} className="group relative overflow-hidden rounded-3xl bg-gray-100 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold">{item.name}</h3>
                      <p className="mt-1 text-sm font-medium text-gray-200">Starting from {item.currency} {item.startingPrice}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Featured Premium Stays</h2>
            <p className="mt-4 text-lg text-gray-500">Handpicked collections for an unforgettable experience.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {featuredProperties.map((hotel) => (
              <div key={hotel.id} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-md transition-shadow hover:shadow-xl md:flex-row">
                <div className="relative h-64 w-full md:h-auto md:w-2/5">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-extrabold text-white backdrop-blur-md uppercase">Featured</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(hotel.rating) ? 'fill-[#FFAB00] text-[#FFAB00]' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-1 text-sm font-bold text-gray-900">{hotel.rating}</span>
                      <span className="text-xs text-gray-500">({hotel.reviews})</span>
                    </div>
                    <div className="flex items-center text-xs font-semibold text-gray-500">
                      <MapPin className="mr-1 h-3 w-3" />
                      {hotel.location}
                    </div>
                  </div>
                  
                  <h3 className="mt-2 text-2xl font-bold text-gray-900">{hotel.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {hotel.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-[#FF9530] uppercase">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Per Night</p>
                      <p className="text-xl font-extrabold text-[#FF9530]">{hotel.currency} {hotel.price}</p>
                    </div>
                    <Link href={hotel.cta} className="rounded-xl bg-gradient-to-r from-[#FF9530] to-[#FFB347] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-transform active:scale-95">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Spodia */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Why Book with Spodia?</h2>
          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {whySpodia.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 shadow-sm border border-orange-100">
                  <CheckCircle2 className="h-8 w-8 text-[#FF9530]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">Premium service guaranteed with every booking.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="bg-slate-900 py-24 sm:py-32 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Local Ecosystem & Experiences</h2>
            <p className="mt-4 text-lg text-gray-400">Discover premium dining, spas, and venues in the region.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Spas */}
            <div className="rounded-3xl bg-white/5 p-8 backdrop-blur-md border border-white/10">
              <div className="mb-6 bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-6">Top Spas</h3>
              <div className="space-y-4">
                {ecosystem.spas.map((spa, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-gray-300 group-hover:text-white transition-colors">{spa.name}</span>
                    <span className="text-sm font-bold text-blue-400">₹{spa.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Venues */}
            <div className="rounded-3xl bg-white/5 p-8 backdrop-blur-md border border-white/10">
              <div className="mb-6 bg-pink-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <PartyPopper className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-6">Premium Venues</h3>
              <div className="space-y-4">
                {ecosystem.venues.map((venue, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-gray-300 group-hover:text-white transition-colors">{venue.name}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-gray-400">
                       {venue.capacity} guests
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurants */}
            <div className="rounded-3xl bg-white/5 p-8 backdrop-blur-md border border-white/10">
              <div className="mb-6 bg-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <Utensils className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-6">Iconic Dining</h3>
              <div className="space-y-4">
                {ecosystem.restaurants.map((res, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-gray-300 group-hover:text-white transition-colors">{res.name}</span>
                    <span className="text-xs text-gray-500">{res.location}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[3rem] bg-gradient-to-r from-[#FF9530] to-[#FF8000] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-xl">
                {deals[0].urgencyTag && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    {deals[0].urgencyTag}
                  </span>
                )}
                <h2 className="mt-4 text-4xl font-extrabold">{deals[0].title}</h2>
                <p className="mt-4 text-lg text-white/80">Claim your exclusive deal today. Valid till {deals[0].validTill}.</p>
              </div>
              <Button className="bg-white text-orange-600 hover:bg-orange-50 rounded-2xl px-12 py-8 text-xl font-bold shadow-xl shadow-black/10">
                 Claim Offer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section Footer */}
      <section className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {seoSections.links.map((section, sIdx) => (
              <div key={sIdx}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">{section.title}</h3>
                <ul className="mt-6 space-y-4">
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx}>
                      <Link href="#" className="text-sm text-gray-500 hover:text-[#FF9530] transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Button({ children, className, ...props }: any) {
  return (
    <button
      className={`inline-flex items-center justify-center transition-all active:scale-95 duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
