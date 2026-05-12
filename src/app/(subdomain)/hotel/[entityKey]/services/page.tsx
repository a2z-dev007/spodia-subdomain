"use client";

import React, { useState, useMemo } from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { 
  Wifi, Car, Coffee, ShieldCheck, Dumbbell, Waves, Briefcase, 
  Sparkles, Clock, Map, Search, Heart, ChevronDown, ChevronUp, 
  Baby, Tablet, Printer, VolumeX, Bath, MapPin, Star, Award, 
  CheckCircle2, Utensils, MoveRight, ExternalLink, Info, Plus
} from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

const FacilitiesPage = ({ params }: { params: { entityKey: string } }) => {
  const { entityKey } = params;
  const { name, location, type } = propertyData;
  
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const categories = ["All", "Essentials", "Wellness", "Family", "Business"];

  const amenitiesData = [
    { id: "ac", name: "Air-Conditioned Rooms", category: "Essentials", icon: Bath, popular: true },
    { id: "wifi", name: "Free High-Speed WiFi", category: "Essentials", icon: Wifi, popular: true },
    { id: "water", name: "24/7 Hot Water", category: "Essentials", icon: Waves, popular: false },
    { id: "parking", name: "Free Secure Parking", category: "Essentials", icon: Car, popular: true },
    { id: "laundry", name: "Laundry Services", category: "Essentials", icon: Sparkles, popular: false },
    { id: "pool", name: "Infinity Pool", category: "Wellness", icon: Waves, popular: true },
    { id: "spa", name: "Luxury Spa", category: "Wellness", icon: Sparkles, popular: true },
    { id: "gym", name: "24/7 Fitness Center", category: "Wellness", icon: Dumbbell, popular: true },
    { id: "yoga", name: "Yoga Sessions", category: "Wellness", icon: Sparkles, popular: false },
    { id: "baby", name: "Babysitting Services", category: "Family", icon: Baby, popular: false },
    { id: "play", name: "Kids Play Area", category: "Family", icon: Tablet, popular: true },
    { id: "conf", name: "Conference Rooms", category: "Business", icon: Briefcase, popular: true },
    { id: "print", name: "Printing/Fax Services", category: "Business", icon: Printer, popular: false },
    { id: "work", name: "Soundproof Workspaces", category: "Business", icon: VolumeX, popular: true }
  ];

  const filteredAmenities = useMemo(() => {
    return amenitiesData.filter(item => {
      const matchesTab = activeTab === "All" || item.category === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": name,
    "amenityFeature": amenitiesData.map(a => ({
      "@type": "LocationFeatureSpecification",
      "name": a.name,
      "value": true
    }))
  };

  const heroTitle = type === "Hotel" || type === "Resort" 
    ? "Experience Unmatched Comfort & Convenience" 
    : "Your Home Away From Home – Thoughtful Amenities";

  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src={IMAGES.bgSection.src} 
          alt="Facilities" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6 max-w-[1000px]">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-12">
            24/7 Concierge · Free Airport Transfers · Cultural Workshops
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <ShieldCheck className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">Hygiene Certified</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <Wifi className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">Free WiFi</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <Heart className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">Family-Friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky Navigation & Filters */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full font-black text-sm transition-all whitespace-nowrap ${activeTab === cat ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Find an amenity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-full py-3 pl-12 pr-4 font-bold text-sm focus:ring-2 focus:ring-[#FF9530] transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Amenities Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAmenities.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#FF9530] transition-all group relative overflow-hidden">
              {item.popular && (
                <div className="absolute top-4 right-4 bg-orange-50 text-[#FF9530] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-100">
                  Most Popular
                </div>
              )}
              <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center mb-6 group-hover:bg-orange-50 group-hover:scale-110 transition-all text-[#FF9530]">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-4">{item.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                <button 
                  onClick={() => toggleWishlist(item.id)}
                  className={`p-2 rounded-xl transition-all ${wishlist.includes(item.id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${wishlist.includes(item.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Specialized Services */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-12 text-center">Premium Services</h2>
          
          {/* Spa Module */}
          <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-lg transition-all hover:shadow-2xl">
            <button 
              onClick={() => setExpandedModule(expandedModule === 'spa' ? null : 'spa')}
              className="w-full p-10 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-10 h-10 text-[#FF9530]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Spa & Wellness Packages</h3>
                  <p className="text-gray-500 font-medium">Rejuvenate your senses with our curated treatments.</p>
                </div>
              </div>
              {expandedModule === 'spa' ? <ChevronUp className="w-8 h-8 text-gray-400" /> : <ChevronDown className="w-8 h-8 text-gray-400" />}
            </button>
            {expandedModule === 'spa' && (
              <div className="p-10 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-3xl flex justify-between items-center group cursor-pointer hover:bg-orange-50 transition-colors">
                    <div>
                      <p className="font-black text-gray-900">Couples Massage</p>
                      <p className="text-sm text-gray-500">60 Mins · Relaxing Therapy</p>
                    </div>
                    <span className="text-xl font-black text-[#FF9530]">₹3,500</span>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl flex justify-between items-center group cursor-pointer hover:bg-orange-50 transition-colors">
                    <div>
                      <p className="font-black text-gray-900">Detox Day Pass</p>
                      <p className="text-sm text-gray-500">Full Access · Sauna & Pool</p>
                    </div>
                    <span className="text-xl font-black text-[#FF9530]">₹2,000</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-6">
                  <p className="text-gray-600 font-medium leading-relaxed">Our spa features premium organic products and therapists trained in both traditional and modern techniques.</p>
                  <button className="bg-gray-900 text-white py-5 px-10 rounded-2xl font-black text-lg w-full flex items-center justify-center gap-4 hover:bg-[#FF9530] transition-colors">
                    Book Spa Services <MoveRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Transport Module */}
          <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-lg transition-all hover:shadow-2xl">
            <button 
              onClick={() => setExpandedModule(expandedModule === 'transport' ? null : 'transport')}
              className="w-full p-10 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center shrink-0">
                  <Car className="w-10 h-10 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Transportation</h3>
                  <p className="text-gray-500 font-medium">Seamless travel to and from the property.</p>
                </div>
              </div>
              {expandedModule === 'transport' ? <ChevronUp className="w-8 h-8 text-gray-400" /> : <ChevronDown className="w-8 h-8 text-gray-400" />}
            </button>
            {expandedModule === 'transport' && (
              <div className="p-10 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50">
                <ul className="space-y-4">
                  <li className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl font-black">
                    <span className="flex items-center gap-4"><Car className="w-5 h-5 text-blue-500" /> Airport Pickup/Dropoff</span>
                    <span className="text-blue-500">₹1,500</span>
                  </li>
                  <li className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl font-black">
                    <span className="flex items-center gap-4"><Car className="w-5 h-5 text-blue-500" /> Car Rental with Driver</span>
                    <span className="text-blue-500">₹3,000/day</span>
                  </li>
                </ul>
                <div className="flex flex-col justify-center gap-6">
                  <p className="text-gray-600 font-medium leading-relaxed">Luxury sedans and SUVs available 24/7. Professional drivers with local expertise.</p>
                  <button className="bg-blue-600 text-white py-5 px-10 rounded-2xl font-black text-lg w-full">
                    Book Transportation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Guest Reviews */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-black text-gray-900 mb-16 text-center">What Our Guests Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm relative italic">
             <div className="absolute top-0 right-10 -mt-8 w-16 h-16 bg-[#FF9530] rounded-full flex items-center justify-center shadow-xl">
               <Star className="w-8 h-8 text-white fill-current" />
             </div>
             <p className="text-gray-600 text-xl font-medium leading-relaxed mb-8">"The pool was perfect for the kids! We spent most of our afternoons there. Highly recommended!"</p>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden" />
                <div>
                   <p className="font-black text-gray-900">Neha S.</p>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Bangalore, IN</p>
                </div>
             </div>
          </div>
          <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm relative italic">
             <div className="absolute top-0 right-10 -mt-8 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-xl">
               <Star className="w-8 h-8 text-white fill-current" />
             </div>
             <p className="text-gray-600 text-xl font-medium leading-relaxed mb-8">"Loved the morning yoga sessions! The instructor was very professional and the rooftop view was amazing."</p>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden" />
                <div>
                   <p className="font-black text-gray-900">Arjun V.</p>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Mumbai, IN</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Local Partnerships */}
      <section className="py-24 bg-gray-900 text-white px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-16">Our Local Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 flex flex-col items-center gap-6 group hover:bg-white/10 transition-all">
              <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Dumbbell className="w-10 h-10 text-[#FF9530]" />
              </div>
              <h4 className="text-2xl font-black">Partner Gym: Gold's Fit</h4>
              <p className="text-gray-400 font-medium">Access to premium weight-lifting and cardio equipment just 2 blocks away.</p>
            </div>
            <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 flex flex-col items-center gap-6 group hover:bg-white/10 transition-all">
              <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-10 h-10 text-blue-400" />
              </div>
              <h4 className="text-2xl font-black">Guided Tours by Assam Explore</h4>
              <p className="text-gray-400 font-medium">Daily city tours and Brahmaputra river cruise packages at exclusive guest rates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive Amenities Map */}
      <section className="py-32 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">Explore the Neighborhood</h2>
            <p className="text-gray-600 text-xl font-medium">Convenience at your fingertips.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 h-[600px] bg-gray-100 rounded-[64px] overflow-hidden relative shadow-inner border border-gray-200">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-[#FF9530] mx-auto mb-4 animate-bounce" />
                    <p className="text-xl font-black text-gray-400">Interactive Facilities Map Integration</p>
                  </div>
               </div>
            </div>
            <div className="space-y-8">
              <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
                <h4 className="text-lg font-black text-gray-900 mb-6">Proximity Guide</h4>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3 font-bold text-gray-600"><Sparkles className="w-5 h-5 text-[#FF9530]" /> In-House Spa</span>
                    <span className="font-black text-gray-900">0.1 km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3 font-bold text-gray-600"><MapPin className="w-5 h-5 text-red-500" /> Central Hospital</span>
                    <span className="font-black text-gray-900">2.0 km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3 font-bold text-gray-600"><Utensils className="w-5 h-5 text-orange-500" /> City Mall</span>
                    <span className="font-black text-gray-900">1.5 km</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-4 hover:bg-[#FF9530] transition-colors">
                View On Google Maps <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="py-24 px-6 max-w-[900px] mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-16 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Is the pool heated?", a: "Yes, our infinity pool is temperature-controlled to ensure a comfortable swim year-round." },
            { q: "Do you provide cribs for infants?", a: "Absolutely! We offer complimentary cribs and high chairs for our little guests. Please request at the time of booking." },
            { q: "Are there any noise restrictions in the work area?", a: "Our business center features individual soundproof pods designed for focused work and calls." }
          ].map((faq, i) => (
            <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
               <h4 className="text-xl font-black text-gray-900 mb-4">{faq.q}</h4>
               <p className="text-gray-600 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button className="text-[#FF9530] font-black text-lg flex items-center gap-3 mx-auto">
            Visit Full FAQs Page <MoveRight className="w-6 h-6" />
          </button>
        </div>
      </section>

    </HotelPageShell>
  );
};

export default FacilitiesPage;
