"use client";

import React, { useState, useEffect, useMemo } from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import type { ListingDetail } from "@/types/hotelDetails";
import { 
  Search, Plus, Minus, MessageSquare, Phone, Mail, 
  ChevronRight, Printer, ShieldCheck, Star, Clock, 
  HelpCircle, CreditCard, Wifi, MapPin, Sparkles
} from "lucide-react";

import HotelHeroPremium from "@/components/hotel/sections/HotelHeroPremium";
import StaticDataBadge from "@/components/common/StaticDataBadge";

const FAQPage = ({ params }: { params: Promise<{ entityKey: string }> }) => {
  const { entityKey } = React.use(params);
  const [hotelData, setHotelData] = useState<ListingDetail | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>(["b1", "p1"]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchHotelDetails(entityKey).then((data) => {
      if (data) setHotelData(data);
    });
  }, [entityKey]);

  const name = hotelData?.name || propertyData.name;
  const location = hotelData?.address || (hotelData?.city_name ? `${hotelData.city_name}, ${hotelData.state_name || ''}` : propertyData.location);

  const toggleItem = (id: string) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const faqCategories = [
    {
      id: "booking",
      title: "Booking & Reservations",
      icon: CreditCard,
      items: [
        { id: "b1", q: "How do I modify or cancel my booking?", a: `Cancellations and modifications for ${name} can be managed via 'My Bookings' according to property cancellation policies.` },
        { id: "b2", q: "Is advance payment required?", a: "A minimal booking deposit or online payment secures your reservation instantly. Pay balance upon arrival." },
        { id: "b3", q: "Is butler or room service available?", a: `Yes, ${name} provides 24/7 in-room dining and guest service assistance.` },
        { id: "b4", q: "What payment methods are accepted?", a: "We accept all major Credit/Debit Cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and Razorpay." }
      ]
    },
    {
      id: "amenities",
      title: "Amenities & Services",
      icon: Wifi,
      items: [
        { id: "a1", q: "Do you offer airport or railway transfers?", a: "Yes, airport and railway station pickup/drop-off can be arranged upon request with our front desk." },
        { id: "a2", q: "Is high-speed Wi-Fi complimentary?", a: "Complimentary high-speed fiber Wi-Fi is available across all guest rooms and public areas." },
        { id: "a3", q: "Are dining options available on-site?", a: `Yes, ${name} features authentic multi-cuisine dining options with room service availability.` }
      ]
    },
    {
      id: "policies",
      title: "Check-in & Stay Policies",
      icon: ShieldCheck,
      items: [
        { id: "p1", q: "What are standard check-in and check-out times?", a: "Standard check-in is 12:00 PM and check-out is 11:00 AM. Early check-in or late check-out is subject to availability." },
        { id: "p2", q: "What ID documents are required at check-in?", a: "All guests must present a valid government-issued photo ID (Aadhaar, Passport, Driving License)." },
        { id: "p3", q: "Are pets allowed at the property?", a: "Pet policies vary by room category. Please contact reception prior to arrival if traveling with pets." }
      ]
    },
    {
      id: "location",
      title: "Location & Access",
      icon: MapPin,
      items: [
        { id: "l1", q: `Where is ${name} located?`, a: `${name} is located at ${location}.` },
        { id: "l2", q: "Is parking available for guests?", a: "Yes, complimentary secured guest parking is available on-site." }
      ]
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqCategories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.items.length > 0 && (activeCategory === "All" || cat.id === activeCategory));
  }, [searchQuery, activeCategory]);

  const totalFaqCount = useMemo(() => {
    return faqCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <HotelPageShell entityKey={entityKey}>
      {/* 1. Hero Section */}
      <HotelHeroPremium 
        pillIcon={<HelpCircle className="w-4 h-4 text-[#FF9530]" />}
        pillText="24/7 Guest Support & Policies"
        title={
          <>
            {name} FAQs – <br className="hidden sm:inline" />
            <span className="text-[#FF9530]">Your Complete Stay Guide.</span>
          </>
        }
        subtitle={`Everything you need to know about stay policies, check-in rules, amenities, and booking details at ${name}.`}
        primaryBtnText="Book Stay Now"
        primaryBtnHref={`/hotel/${entityKey}/rooms`}
        secondaryBtnText="Explore Rooms"
        secondaryBtnHref={`/hotel/${entityKey}/rooms`}
        badges={[
          { icon: <Clock className="w-4 h-4" />, text: "24/7 Support" },
          { icon: <Star className="w-4 h-4" />, text: "Best Price Guarantee" },
          { icon: <ShieldCheck className="w-4 h-4" />, text: "Instant Confirmation" }
        ]}
      />

      {/* 2. Interactive Search & Category Filter Bar */}
      <div className="sticky top-[var(--hotel-header-height,115px)] z-30 bg-white/95 backdrop-blur-2xl border-b border-gray-150 shadow-sm print:hidden py-4 px-4 sm:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-[540px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search FAQs (e.g. check-in time, WiFi, cancellation)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/90 border border-gray-200/80 rounded-2xl py-3 pl-12 pr-4 font-bold text-sm sm:text-base focus:ring-2 focus:ring-[#FF9530] focus:bg-white transition-all outline-none"
            />
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto max-w-full w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 ${
                activeCategory === "All"
                  ? "bg-[#FF9530] text-white shadow-md shadow-orange-500/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All FAQs ({totalFaqCount})
            </button>
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-[#FF9530] text-white shadow-md shadow-orange-500/20"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main FAQ Content Area */}
      <section className="py-12 md:py-20 px-4 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Sidebar Category Navigation */}
          <div className="hidden lg:block lg:col-span-4 space-y-3 sticky top-36">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                Property Guide
              </span>
              <p className="text-sm font-bold text-gray-900 truncate">{name}</p>
              <p className="text-xs text-gray-500 truncate">{location}</p>
            </div>

            {faqCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => {
                  setActiveCategory("All");
                  setTimeout(() => {
                    document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 50);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-left transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-[#FF9530] text-white border-[#FF9530] shadow-lg shadow-orange-500/20'
                    : 'bg-white border-gray-200/80 text-gray-800 hover:border-orange-200 hover:bg-orange-50/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-white' : 'text-[#FF9530]'}`} />
                  <span className="text-sm">{cat.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${activeCategory === cat.id ? 'text-white' : 'text-gray-400'}`} />
              </button>
            ))}
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-8 space-y-12">
            {filteredFaqs.map((cat) => (
              <div key={cat.id} id={cat.id} className="scroll-mt-40">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-150">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 border border-orange-200/60">
                    <cat.icon className="w-5 h-5 text-[#FF9530]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">{cat.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {cat.items.map((item) => {
                    const isOpen = openItems.includes(item.id);
                    return (
                      <div 
                        key={item.id} 
                        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                          isOpen 
                            ? 'bg-white border-[#FF9530] shadow-lg shadow-orange-500/10' 
                            : 'bg-white border-gray-200/80 hover:border-orange-200'
                        }`}
                      >
                        <button 
                          onClick={() => toggleItem(item.id)}
                          className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4"
                        >
                          <span className={`text-base sm:text-lg font-bold pr-2 ${isOpen ? 'text-[#FF9530]' : 'text-gray-900'}`}>
                            {item.q}
                          </span>
                          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'bg-[#FF9530] text-white rotate-180' : 'bg-gray-100 text-gray-600'}`}>
                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </div>
                        </button>

                        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-5 sm:p-6 pt-0 text-gray-600 text-sm sm:text-base font-medium leading-relaxed border-t border-gray-100 mt-1">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="py-16 text-center bg-gray-50 rounded-3xl border border-gray-200/70 p-8">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-[#FF9530]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No results found for "{searchQuery}"</h3>
                <p className="text-gray-500 text-sm font-medium">Try searching for alternative terms or contact our support team.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="mt-6 text-[#FF9530] font-black text-sm hover:underline"
                >
                  Reset Search &amp; Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Guest Support CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-gray-900 rounded-[36px] p-8 sm:p-12 md:p-16 relative overflow-hidden text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF9530]/10 rounded-full blur-[100px] -mr-[200px] -mt-[200px]" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-[#FF9530] text-xs font-black uppercase tracking-widest block mb-2">
                  DIRECT ASSISTANCE
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
                  Still Have <span className="text-[#FF9530]">Questions?</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base font-medium mb-8 leading-relaxed max-w-[500px]">
                  Our dedicated guest support team is available 24/7 to assist you with special requests, room customization, or direct booking queries.
                </p>
                <a
                  href={`/hotel/${entityKey}/contact`}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Contact Front Desk</span>
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 bg-[#FF9530]/20 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#FF9530]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Reservations 24/7</p>
                    <p className="text-lg sm:text-xl font-black text-white">+91 7399888855</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 bg-[#FF9530]/20 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#FF9530]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Guest Support</p>
                    <p className="text-lg sm:text-xl font-black text-white">bookings@spodia.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HotelPageShell>
  );
};

export default FAQPage;

