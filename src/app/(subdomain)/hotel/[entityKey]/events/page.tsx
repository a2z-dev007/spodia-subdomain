"use client";

import React, { useState } from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { 
  Users, Maximize, Mic2, Tv, Wifi, Utensils, Calendar, ArrowRight, 
  CheckCircle2, Star, ShieldCheck, Award, Heart, Briefcase, Music, 
  Camera, ChevronRight, ChevronLeft, Download, Info, MessageSquare, 
  Phone, Sparkles, MapPin, Layers, Layout, Palette, Zap
} from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

const EventsPage = ({ params }: { params: { entityKey: string } }) => {
  const { entityKey } = params;
  const { name, location } = propertyData;
  const [activeVenueTab, setActiveVenueTab] = useState("Grand Ballroom");
  const [guestCount, setGuestCount] = useState(250);

  const venues = [
    {
      name: "Grand Ballroom",
      capacity: "Seated: 200 · Cocktail: 300",
      dimensions: "5,000 sq. ft · Ceiling Height: 20 ft",
      pricing: "From ₹50,000/day (Includes Basic Setup)",
      description: "Crystal Chandeliers · Built-in Stage · LED Lighting",
      image: IMAGES.bgSection.src,
      features: ["Largest Pillar-Free Hall", "Built-in AV Systems", "VIP Lounge Access"]
    },
    {
      name: "Rooftop Garden",
      capacity: "Seated: 100 · Cocktail: 150",
      dimensions: "3,000 sq. ft · Open Air",
      pricing: "From ₹35,000/day",
      description: "Sunset Views · Panoramic Cityscape · Floral Arch",
      image: IMAGES.bgSection.src,
      features: ["City Skyline Views", "Open-Air Ambiance", "Bar Setup"]
    },
    {
      name: "Conference Hall",
      capacity: "Seated: 80 · Cocktail: 100",
      dimensions: "1,500 sq. ft · Soundproof",
      pricing: "From ₹25,000/day",
      description: "U-Shaped Seating · Projector · Video Conferencing",
      image: IMAGES.bgSection.src,
      features: ["Acoustic Treatment", "High-Speed WiFi", "Breakout Rooms"]
    },
    {
      name: "Poolside Lawn",
      capacity: "Seated: 300 · Cocktail: 500",
      dimensions: "8,000 sq. ft · Lush Greenery",
      pricing: "From ₹60,000/day",
      description: "Outdoor Setup · Pool Access · Fairy Lights",
      image: IMAGES.bgSection.src,
      features: ["Waterfront Ambiance", "Spacious Layout", "Direct Entrance"]
    }
  ];

  const packages = [
    { name: "Basic", price: "₹50,000", includes: "Venue + Chairs", cta: "Book Now" },
    { name: "Premium", price: "₹1,50,000", includes: "Venue + Decor", cta: "Book Now" },
    { name: "Platinum", price: "₹3,00,000", includes: "All-Inclusive", cta: "Book Now" }
  ];

  const activeVenue = venues.find(v => v.name === activeVenueTab) || venues[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "name": `${name} Events`,
    "image": IMAGES.bgSection.src,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressRegion": "Assam",
      "addressCountry": "India"
    },
    "maximumAttendeeCapacity": "500",
    "amenityFeature": ["AirConditioning", "Parking", "Stage", "Catering", "WiFi"]
  };

  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={IMAGES.bgSection.src} 
            alt="Event Venue" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-[1000px]">
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tighter">
            Host Unforgettable <span className="text-[#FF9530]">Events</span> at {name}
          </h1>
          <p className="text-xl md:text-3xl text-white/90 font-medium mb-12">
            Weddings · Corporate Events · Social Gatherings · Customizable Packages.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
            <button className="bg-[#FF9530] text-white px-12 py-5 rounded-2xl font-black text-xl hover:shadow-[0_10px_30px_rgba(255,149,48,0.4)] transition-all active:scale-95">
              Request a Quote
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black text-xl hover:bg-white/20 transition-all active:scale-95">
              Book a Venue Tour
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
              <ShieldCheck className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">AAA Hygiene Rated</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
              <Star className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">500+ Events Hosted</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
              <Award className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">Award-Winning Catering</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Multi-Venue Showcase */}
      <section className="py-32 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">Our Premium Venues</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {venues.map((venue) => (
              <button 
                key={venue.name}
                onClick={() => setActiveVenueTab(venue.name)}
                className={`px-8 py-4 rounded-2xl font-black text-lg transition-all ${activeVenueTab === venue.name ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {venue.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="aspect-[4/3] rounded-[64px] overflow-hidden shadow-2xl relative">
              <Image 
                src={activeVenue.image} 
                alt={activeVenue.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-12 left-12 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl">
                  360° Virtual Tour <Layers className="w-5 h-5 text-[#FF9530]" />
                </button>
              </div>
            </div>
            {/* Gallery Navigation Mockup */}
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
              <ChevronLeft className="w-6 h-6 text-[#FF9530]" />
            </div>
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
              <ChevronRight className="w-6 h-6 text-[#FF9530]" />
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">{activeVenue.name}</h3>
              <p className="text-2xl font-bold text-[#FF9530] mb-8">{activeVenue.pricing}</p>
              <p className="text-gray-600 text-xl font-medium leading-relaxed mb-10">{activeVenue.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-[#FF9530]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Capacity</h4>
                  <p className="text-lg font-bold text-gray-900">{activeVenue.capacity}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <Maximize className="w-6 h-6 text-[#FF9530]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Dimensions</h4>
                  <p className="text-lg font-bold text-gray-900">{activeVenue.dimensions}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Key Features</h4>
              <div className="flex flex-wrap gap-4">
                {activeVenue.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 font-bold text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> {f}
                  </div>
                ))}
              </div>
            </div>

            <button className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-4 group hover:bg-[#FF9530] transition-colors">
              View Full Details <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Capacity Calculator & USP */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF9530]/5 rounded-full blur-[150px] -mr-[400px] -mt-[400px]" />
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Built for <br /><span className="text-[#FF9530]">Excellence.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              <div className="space-y-4">
                <Zap className="w-12 h-12 text-[#FF9530]" />
                <h4 className="text-2xl font-black">Largest Pillar-Free Hall</h4>
                <p className="text-gray-400 font-medium leading-relaxed">Perfect for large scale weddings and grand exhibitions in {location}.</p>
              </div>
              <div className="space-y-4">
                <Layout className="w-12 h-12 text-[#FF9530]" />
                <h4 className="text-2xl font-black">Customizable Lighting</h4>
                <p className="text-gray-400 font-medium leading-relaxed">Advanced LED systems to match your event's specific color theme.</p>
              </div>
              <div className="space-y-4">
                <Utensils className="w-12 h-12 text-[#FF9530]" />
                <h4 className="text-2xl font-black">In-House Catering</h4>
                <p className="text-gray-400 font-medium leading-relaxed">Gourmet menus crafted by our award-winning executive chefs.</p>
              </div>
              <div className="space-y-4">
                <ShieldCheck className="w-12 h-12 text-[#FF9530]" />
                <h4 className="text-2xl font-black">Complimentary Valet</h4>
                <p className="text-gray-400 font-medium leading-relaxed">Seamless arrival experience for all your prestigious guests.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-12 md:p-16 rounded-[64px] border border-white/10 shadow-2xl">
            <h3 className="text-3xl font-black mb-10">Capacity Calculator</h3>
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Estimated Guests</span>
                  <span className="text-4xl font-black text-[#FF9530]">{guestCount}</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="1000" 
                  value={guestCount} 
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FF9530]"
                />
              </div>
              <div className="p-8 bg-white/10 rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-sm font-black text-[#FF9530] uppercase tracking-widest">Recommended Venues</h4>
                <div className="flex flex-wrap gap-4">
                  {guestCount > 200 ? (
                    <span className="bg-[#FF9530] px-6 py-2 rounded-xl font-bold">Grand Ballroom</span>
                  ) : guestCount > 100 ? (
                    <span className="bg-[#FF9530] px-6 py-2 rounded-xl font-bold">Poolside Lawn</span>
                  ) : (
                    <span className="bg-[#FF9530] px-6 py-2 rounded-xl font-bold">Conference Hall</span>
                  )}
                  {guestCount < 150 && <span className="bg-white/10 px-6 py-2 rounded-xl font-bold">Rooftop Garden</span>}
                </div>
              </div>
              <button className="w-full bg-[#FF9530] text-white py-6 rounded-2xl font-black text-xl hover:shadow-[0_10px_30px_rgba(255,149,48,0.4)] transition-all">
                Get Personalized Proposal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Event Types & Suitability */}
      <section className="py-32 px-6 max-w-[1200px] mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-16">Perfect for Every Occasion</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {["Weddings", "Conferences", "Birthday Parties", "Product Launches", "Gala Dinners", "Award Ceremonies", "Exhibitions", "Seminars"].map(tag => (
            <span key={tag} className="bg-gray-50 border border-gray-100 px-8 py-4 rounded-2xl text-lg font-black text-gray-700 hover:border-[#FF9530] hover:bg-white hover:shadow-lg transition-all cursor-default">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-12 text-lg font-bold text-gray-600">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500" /> Ideal for 100–500 Guests
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500" /> Wheelchair Accessible
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500" /> Pet-Friendly (Outdoor Venues)
          </div>
        </div>
      </section>

      {/* 5. Facilities & Catering */}
      <section className="py-32 bg-gray-50 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Facilities */}
          <div className="bg-white p-12 md:p-16 rounded-[64px] shadow-xl border border-gray-100">
            <h3 className="text-3xl font-black text-gray-900 mb-12">Facilities & Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-sm font-black text-[#FF9530] uppercase tracking-widest">Included</h4>
                <ul className="space-y-4">
                  {["Basic Decor", "Chairs/Tables", "Sound System", "HVAC / Cooling"].map(item => (
                    <li key={item} className="flex items-center gap-3 font-bold text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-sm font-black text-[#FF9530] uppercase tracking-widest">Add-Ons</h4>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center font-bold text-gray-700">
                    <span>Stage Setup</span> <span className="text-gray-400">₹10,000</span>
                  </li>
                  <li className="flex justify-between items-center font-bold text-gray-700">
                    <span>Floral Arrangement</span> <span className="text-gray-400">₹15,000</span>
                  </li>
                  <li className="flex justify-between items-center font-bold text-gray-700">
                    <span>Live Streaming</span> <span className="text-gray-400">₹20,000</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Catering */}
          <div className="bg-gray-900 p-12 md:p-16 rounded-[64px] shadow-2xl text-white">
            <h3 className="text-3xl font-black mb-12">Catering & Menus</h3>
            <div className="space-y-12">
              <div className="flex flex-wrap gap-4">
                {["Indian", "Continental", "Asian", "Fusion"].map(c => (
                  <span key={c} className="bg-white/10 px-6 py-2 rounded-xl font-bold border border-white/10">{c}</span>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:bg-[#FF9530] transition-all">
                  <div className="text-left">
                    <p className="font-black">Wedding Package</p>
                    <p className="text-xs text-gray-400 group-hover:text-white/80">Full Menu PDF</p>
                  </div>
                  <Download className="w-6 h-6 text-[#FF9530] group-hover:text-white" />
                </button>
                <button className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:bg-[#FF9530] transition-all">
                  <div className="text-left">
                    <p className="font-black">Corporate Lunch</p>
                    <p className="text-xs text-gray-400 group-hover:text-white/80">Menu Options PDF</p>
                  </div>
                  <Download className="w-6 h-6 text-[#FF9530] group-hover:text-white" />
                </button>
              </div>
              <div className="flex items-center gap-8 text-sm font-bold text-gray-400">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Vegan Options</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Gluten-Free</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Jain Food</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Decor & Gallery */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-16">Themes & Inspiration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1440px] mx-auto">
          {[
            { title: "Royal Vintage", img: IMAGES.bgSection.src },
            { title: "Modern Minimalist", img: IMAGES.bgSection.src },
            { title: "Tropical Paradise", img: IMAGES.bgSection.src }
          ].map((theme, i) => (
            <div key={i} className="group cursor-pointer relative overflow-hidden rounded-[48px] aspect-[4/5]">
              <Image src={theme.img} alt={theme.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-10 text-left">
                <h4 className="text-3xl font-black text-white mb-4">{theme.title}</h4>
                <button className="text-[#FF9530] font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  Explore Theme <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-20 bg-gray-900 text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-[#FF9530] transition-colors">
          Customize Your Theme →
        </button>
      </section>

      {/* 9. Pricing & Packages */}
      <section className="py-32 bg-gray-900 text-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Pricing & Packages</h2>
            <p className="text-gray-400 text-xl">Transparent plans tailored to your needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <div key={i} className={`p-12 rounded-[48px] border ${i === 1 ? 'bg-[#FF9530] border-transparent shadow-2xl scale-105' : 'bg-white/5 border-white/10'} transition-all`}>
                <h4 className={`text-2xl font-black mb-4 ${i === 1 ? 'text-white' : 'text-white'}`}>{pkg.name}</h4>
                <p className={`text-4xl font-black mb-8 ${i === 1 ? 'text-white' : 'text-[#FF9530]'}`}>{pkg.price}</p>
                <div className="space-y-6 mb-12">
                  <p className="font-bold opacity-80">Inclusions:</p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-green-400" /> {pkg.includes}
                    </li>
                    <li className="flex items-center gap-3 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-green-400" /> Basic AV Setup
                    </li>
                    <li className="flex items-center gap-3 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-green-400" /> Parking Included
                    </li>
                  </ul>
                </div>
                <button className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${i === 1 ? 'bg-white text-gray-900 hover:shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}>
                  {pkg.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Terms & Conditions */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-black text-gray-900 mb-12">Policies & Restrictions</h2>
        <div className="space-y-4">
          {[
            { q: "Cancellation Policy", a: "Full refund if cancelled 60 days before event. 50% refund between 30-60 days." },
            { q: "Security Deposit", a: "A refundable security deposit of ₹25,000 is required at the time of booking." },
            { q: "Noise Restrictions", a: "Outdoor music allowed until 10:00 PM as per local guidelines." }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center justify-between">
                {item.q} <ChevronRight className="w-5 h-5 text-[#FF9530]" />
              </h4>
              <p className="text-gray-600 font-medium">{item.a}</p>
            </div>
          ))}
        </div>
        <button className="mt-12 text-[#FF9530] font-black flex items-center gap-3">
          Download Full Terms & Conditions PDF <Download className="w-5 h-5" />
        </button>
      </section>

      {/* Sticky Inquiry Panel */}
      <div className="fixed bottom-10 left-10 z-[100] hidden lg:block">
        <div className="bg-white p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 max-w-[400px]">
          <h4 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            Plan Your Event <Palette className="w-6 h-6 text-[#FF9530]" />
          </h4>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select className="bg-gray-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#FF9530] outline-none">
                <option>Event Type</option>
                <option>Wedding</option>
                <option>Corporate</option>
              </select>
              <input type="date" className="bg-gray-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#FF9530] outline-none" />
            </div>
            <input type="tel" placeholder="Mobile Number" className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#FF9530] outline-none" />
            <button className="w-full bg-[#FF9530] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-xl transition-all">
              Request a Call Back
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Chat</p>
                <p className="text-sm font-bold">Online Now</p>
              </div>
            </div>
            <p className="text-sm font-black text-[#FF9530]">+91 98765 43210</p>
          </div>
        </div>
      </div>

    </HotelPageShell>
  );
};

export default EventsPage;
