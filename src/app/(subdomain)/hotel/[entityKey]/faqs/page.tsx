"use client";

import React, { useState, useMemo } from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { 
  Search, Plus, Minus, MessageSquare, Phone, Mail, 
  ChevronRight, Printer, ShieldCheck, Star, Clock, 
  HelpCircle, CreditCard, Wifi, MapPin, Car, Briefcase
} from "lucide-react";

const FAQPage = ({ params }: { params: Promise<{ entityKey: string }> }) => {
  const { entityKey } = React.use(params);
  const { name, location } = propertyData;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleItem = (id: string) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const faqCategories = [
    {
      id: "booking",
      title: "Booking & Reservations",
      icon: CreditCard,
      items: [
        { id: "b1", q: "How do I modify or cancel my booking?", a: "Visit ‘My Bookings’ or contact our support team. Free cancellation up to 48 hours before check-in." },
        { id: "b2", q: "Is advance payment required?", a: "A small deposit secures your reservation. Pay the balance at check-in." },
        { id: "b3", q: "Is butler service available?", a: "Yes, our premium suites include 24/7 dedicated butler service for a truly bespoke experience." }
      ]
    },
    {
      id: "amenities",
      title: "Amenities & Services",
      icon: Wifi,
      items: [
        { id: "a1", q: "Do you offer airport transfers?", a: "Yes! Book in advance for discounted rates. We offer luxury sedans and spacious SUVs." },
        { id: "a2", q: "Is WiFi free?", a: "Complimentary high-speed WiFi is available in all rooms and common areas for our guests." },
        { id: "a3", q: "Do rooms have minibars?", a: "All our luxury rooms and suites are equipped with well-stocked minibars featuring local and international treats." }
      ]
    },
    {
      id: "policies",
      title: "Policies",
      icon: ShieldCheck,
      items: [
        { id: "p1", q: "What’s the check-in/check-out time?", a: "Check-in: 2 PM · Check-out: 12 PM. Early/late options available on request subject to availability." },
        { id: "p2", q: "Are pets allowed?", a: "Yes, in select rooms with a ₹1,000/day fee. Breed restrictions apply, please contact us for details." }
      ]
    },
    {
      id: "location",
      title: "Location & Transport",
      icon: MapPin,
      items: [
        { id: "l1", q: `How far is the hotel from ${location} city center?`, a: `We’re 2 km from the city center and approximately 10 km from the nearest international airport.` },
        { id: "l2", q: "Is parking available?", a: "Yes, we provide complimentary secured parking for all our guests with 24/7 surveillance." }
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
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap(cat => cat.items).map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="bg-gray-900 py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF9530]/10 rounded-full blur-[120px] -mr-[300px] -mt-[300px]" />
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight">
            Frequently Asked Questions – <span className="text-[#FF9530]">Your Stay, Simplified.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium mb-12">
            Find quick answers about bookings, amenities, policies, and more.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <Clock className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <Star className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">Verified Reviews</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <ShieldCheck className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">Free Cancellation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky Search Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm print:hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-[600px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search FAQs (e.g., ‘check-in time’, ‘WiFi’, ‘parking’)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 font-bold text-lg focus:ring-2 focus:ring-[#FF9530] transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-[#FF9530] transition-colors"
            >
              <Printer className="w-5 h-5" /> Print FAQ
            </button>
          </div>
        </div>
      </div>

      {/* 3. Jump Links & FAQ Content */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Jump Links Sidebar */}
          <div className="hidden lg:block space-y-4 sticky top-32 h-fit">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Categories</p>
            {faqCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => {
                  document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setActiveCategory(cat.id);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-left transition-all ${activeCategory === cat.id ? 'bg-gray-900 text-white shadow-xl translate-x-2' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-[#FF9530]' : 'text-gray-400'}`} />
                  {cat.title}
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* FAQ Accordions */}
          <div className="lg:col-span-3 space-y-20">
            {filteredFaqs.map((cat) => (
              <div key={cat.id} id={cat.id} className="scroll-mt-40">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <cat.icon className="w-6 h-6 text-[#FF9530]" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">{cat.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {cat.items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`rounded-[32px] border transition-all duration-300 overflow-hidden ${openItems.includes(item.id) ? 'bg-white border-[#FF9530] shadow-2xl scale-[1.02]' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}
                    >
                      <button 
                        onClick={() => toggleItem(item.id)}
                        className="w-full p-8 flex items-center justify-between text-left"
                      >
                        <span className="text-xl font-black text-gray-900 pr-8">{item.q}</span>
                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${openItems.includes(item.id) ? 'bg-gray-900 text-[#FF9530] rotate-180' : 'bg-white text-gray-400 shadow-sm'}`}>
                          {openItems.includes(item.id) ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                      </button>
                      <div className={`transition-all duration-300 ease-in-out ${openItems.includes(item.id) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-8 pt-0 text-gray-600 text-lg font-medium leading-relaxed border-t border-gray-100/50 mt-2">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <HelpCircle className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">No results found for "{searchQuery}"</h3>
                <p className="text-gray-500 font-medium">Try searching for other keywords or contact our support team.</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-8 text-[#FF9530] font-black"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Guest Support Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-gray-900 rounded-[64px] p-12 md:p-20 relative overflow-hidden text-white">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF9530]/5 rounded-full blur-[100px] -ml-[250px] -mt-[250px]" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Need More <br /><span className="text-[#FF9530]">Help?</span></h2>
                <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed">
                  Our dedicated guest support team is available 24/7 to assist you with any questions or special requests.
                </p>
                <button className="bg-[#FF9530] text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-4 hover:shadow-2xl transition-all">
                  Chat Now with Our Team <MessageSquare className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex items-center gap-8 group hover:bg-white/10 transition-all">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#FF9530] transition-colors">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Call Us 24/7</p>
                    <p className="text-2xl font-black text-white">+91 98765 43210</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex items-center gap-8 group hover:bg-white/10 transition-all">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#FF9530] transition-colors">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Email Us</p>
                    <p className="text-2xl font-black text-white">support@spodia.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Policy Links */}
      <section className="py-24 px-6 text-center border-t border-gray-100">
        <p className="text-gray-400 font-bold mb-8 uppercase tracking-widest text-xs">Important Policies</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {["Privacy Policy", "Terms of Use", "Cancellation Policy", "Refund Policy"].map(policy => (
            <button key={policy} className="text-gray-600 font-black hover:text-[#FF9530] transition-colors">
              {policy}
            </button>
          ))}
        </div>
        <div className="mt-16 flex items-center justify-center gap-2 text-gray-400 font-bold">
          <Star className="w-5 h-5 text-[#FF9530] fill-current" /> Rated 4.8/5 by 1K+ Guests
        </div>
      </section>

    </HotelPageShell>
  );
};

export default FAQPage;
