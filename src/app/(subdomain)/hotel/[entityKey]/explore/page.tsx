"use client";

import React, { useState, useMemo, useEffect } from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { 
  MapPin, Navigation, Compass, Camera, ShoppingBag, Landmark, Clock, 
  ArrowUpRight, Star, Heart, Share2, Download, ChevronRight, Play, 
  Calendar, Info, Car, Phone, ShieldCheck, Award, Heart as HeartIcon, 
  Users, MoveRight, ExternalLink, Mail, MessageSquare
} from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

const categories = [
  "Cultural & Historical", "Outdoor Adventures", "Shopping & Markets", "Family-Friendly"
];

const getAttractions = (hotelName: string, location: string) => [
  { 
    id: 1, 
    category: "Cultural & Historical", 
    title: "Kamakhya Temple", 
    description: "A spiritual marvel and one of the oldest Shakti Peethas in India.",
    distance: `2 km from ${hotelName}`,
    hours: "6 AM–8 PM",
    entry: "Free · Guided Tours: ₹500/person",
    src: IMAGES.bgSection.src,
    type: "Historical temple dedicated to Goddess Kamakhya.",
    touristType: "Cultural, Spiritual"
  },
  { 
    id: 2, 
    category: "Outdoor Adventures", 
    title: "Brahmaputra River Cruise", 
    description: "Experience the majestic river with stunning sunset views.",
    distance: `3.5 km from ${hotelName}`,
    hours: "4 PM–7 PM",
    entry: "₹1,500 onwards",
    src: IMAGES.eventHero.src,
    type: "River cruise experience.",
    touristType: "Nature, Adventure"
  },
  { 
    id: 3, 
    category: "Shopping & Markets", 
    title: "Fancy Bazaar", 
    description: "The heart of local shopping with everything from silk to street food.",
    distance: `1.5 km from ${hotelName}`,
    hours: "10 AM–9 PM",
    entry: "Free entry",
    src: IMAGES.herobg.src,
    type: "Local bazaar and market hub.",
    touristType: "Shopping, Culture"
  },
  { 
    id: 4, 
    category: "Family-Friendly", 
    title: "Accoland Water Park", 
    description: "The biggest water park in the region for family fun.",
    distance: `12 km from ${hotelName}`,
    hours: "11 AM–6 PM",
    entry: "₹800/person",
    src: IMAGES.bgSection.src,
    type: "Amusement and water park.",
    touristType: "Family, Entertainment"
  }
];

const ExplorePage = ({ params }: { params: Promise<{ entityKey: string }> }) => {
  const { entityKey } = React.use(params);
  const { name, location } = propertyData;
  
  const [activeTab, setActiveTab] = useState("Cultural & Historical");
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [savedItems, setSavedItems] = useState<number[]>([]);

  const attractions = useMemo(() => getAttractions(name, location), [name, location]);

  const heroSlides = [
    { id: 1, title: `Explore ${location}`, subtitle: "Discover Hidden Gems & Iconic Landmarks.", src: IMAGES.herobg.src },
    { id: 2, title: "Spiritual Journeys", subtitle: "Experience the ancient traditions and heritage.", src: IMAGES.bgSection.src },
    { id: 3, title: "Nature Trails", subtitle: "Connect with the wild beauty of the region.", src: IMAGES.eventHero.src },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const filteredAttractions = useMemo(() => {
    return attractions.filter(item => item.category === activeTab);
  }, [activeTab, attractions]);

  const toggleSave = (id: number) => {
    setSavedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <HotelPageShell entityKey={entityKey}>
      {/* Schema Markup */}
      {attractions.map(attraction => (
        <script
          key={attraction.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristAttraction",
            "name": attraction.title,
            "image": attraction.src,
            "description": attraction.type,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location,
              "addressRegion": "Assam"
            },
            "touristType": attraction.touristType
          })}}
        />
      ))}

      {/* 1. Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image src={slide.src} alt={slide.title} fill className="object-cover" priority={index === 0} />
            <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-[1000px]">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["Local Expert Approved", "Free Travel Guides", "Eco-Friendly Tours"].map(badge => (
                <span key={badge} className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white font-black uppercase tracking-widest text-[10px] border border-white/20">
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight">
              {heroSlides[currentHeroSlide].title} – <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9530] to-[#FFB347]">Discover Hidden Gems.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-medium mb-12">
              Curated Experiences · Insider Tips · Hassle-Free Bookings.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-[#FF9530] text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-4 hover:shadow-2xl transition-all">
                Download PDF Guide <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Attractions Grid */}
      <section className="py-32 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-20">
          <span className="text-[#FF9530] font-black uppercase tracking-[0.4em] text-xs mb-6 block">Concierge Picks</span>
          <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-10 leading-tight">Must-Visit Landmarks</h2>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === cat ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredAttractions.map((item) => (
            <div key={item.id} className="bg-white rounded-[48px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full">
              <div className="relative h-[350px] w-full overflow-hidden">
                <Image src={item.src} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-8 left-8 flex gap-3">
                  <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl shadow-sm flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#FF9530] fill-current" />
                    <span className="text-sm font-black text-gray-900">{item.distance}</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSave(item.id)}
                  className={`absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all ${savedItems.includes(item.id) ? 'bg-[#FF9530] text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-6 h-6 ${savedItems.includes(item.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-[#FF9530] transition-colors">{item.title}</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 text-gray-500 font-bold">
                    <Clock className="w-5 h-5 text-[#FF9530]" /> 🕒 Hours: {item.hours}
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 font-bold">
                    <Landmark className="w-5 h-5 text-[#FF9530]" /> 💰 Entry: {item.entry}
                  </div>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-grow">
                  {item.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                  <button className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-[#FF9530] transition-colors flex items-center justify-center gap-3">
                    Book a Guided Tour <ArrowUpRight className="w-5 h-5" />
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-900 py-4 rounded-2xl font-black hover:bg-gray-100 transition-colors flex items-center justify-center gap-3">
                    Get Directions <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Top Experiences */}
      <section className="py-32 bg-gray-50 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
            <div className="max-w-[600px]">
              <span className="text-[#FF9530] font-black uppercase tracking-[0.4em] text-xs mb-6 block text-left">Exclusive Activities</span>
              <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-10 leading-tight text-left">Top Experiences</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Guided Heritage Walk", desc: `Explore ${location}’s History with expert guides.`, price: "₹1,000/Person", icon: Camera },
              { title: "Sunset River Cruise", desc: "Majestic Brahmaputra views with luxury dining.", price: "₹2,500/Person", icon: Play },
              { title: "Handicraft Workshop", desc: "Learn traditional weaving from local artisans.", price: "₹800/Person", icon: ShoppingBag }
            ].map((exp, i) => (
              <div key={i} className="bg-white p-12 rounded-[48px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all group flex flex-col">
                <div className="w-16 h-16 bg-orange-50 rounded-[24px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <exp.icon className="w-8 h-8 text-[#FF9530]" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{exp.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-grow">{exp.desc}</p>
                <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                  <span className="text-xl font-black text-gray-900">{exp.price}</span>
                  <button className="text-[#FF9530] font-black flex items-center gap-2 group/btn">
                    Book Now <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Seasonal Highlights */}
      <section className="py-32 px-6 overflow-hidden bg-gray-900 text-white relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF9530]/10 rounded-full blur-[120px] -mr-[300px] -mt-[300px]" />
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl font-black mb-6">Seasonal Highlights</h2>
            <p className="text-gray-400 text-xl font-medium">There's always a reason to visit {location}.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { season: "Monsoon", activities: ["Waterfall Trekking", "Tea Estate Tours"], icon: Compass },
              { season: "Winter", activities: ["Cultural Festivals", "Bonfire Nights"], icon: Star },
              { season: "Summer", activities: ["Adventure Sports", "Cool-off Pool Parties"], icon: Play }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-12 rounded-[48px] hover:bg-white/10 transition-all text-center">
                <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 text-[#FF9530]">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-8">{item.season}</h3>
                <ul className="space-y-4">
                  {item.activities.map(act => (
                    <li key={act} className="text-gray-400 font-bold flex items-center justify-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF9530]" /> {act}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive Map Placeholder */}
      <section className="w-full h-[700px] relative">
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center max-w-[600px] px-6">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg">
              <MapPin className="w-12 h-12 text-[#FF9530] animate-bounce" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">Interactive Explore Map</h2>
            <p className="text-gray-500 text-xl font-medium mb-12 leading-relaxed">
              Toggle between Top Attractions, Dining, and Transport layers to see what's nearby.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Top Attractions", "Dining", "Public Transport"].map(layer => (
                <button key={layer} className="px-8 py-3 rounded-full bg-white border border-gray-200 font-black text-sm hover:border-[#FF9530] transition-all shadow-sm">
                  {layer}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-10 left-10 z-10">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="font-black text-gray-900">{name}</span>
            </div>
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest leading-loose">
              You are here
            </div>
          </div>
        </div>
      </section>

      {/* 6. Local Insights */}
      <section className="py-32 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[#FF9530] font-black uppercase tracking-[0.4em] text-xs mb-6 block">Insider Tips</span>
            <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-10 leading-tight">Local Insights</h2>
            <p className="text-gray-500 text-xl font-medium mb-12 leading-relaxed">
              The best spots as recommended by our staff and past guests who lived the experience.
            </p>
            
            <div className="space-y-8">
              <div className="bg-orange-50 p-10 rounded-[48px] border border-orange-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-orange-200">
                  <Star className="w-24 h-24 fill-current opacity-20" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-[#FF9530] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Staff Pick</span>
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-4">Secret Sunrise Spot</h4>
                  <p className="text-gray-600 font-bold italic text-lg leading-relaxed">
                    "Head to the Nilachal Hills at 5 AM for a view that tourists usually miss. It's the most peaceful start to a day in {location}."
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-12 md:p-20 rounded-[64px] text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-20" />
             <div className="relative z-10">
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-[#FF9530] text-[#FF9530]" />)}
                </div>
                <p className="text-2xl md:text-3xl font-medium leading-relaxed italic mb-10 text-white/90">
                  "Don’t miss the night market – incredible street food! The silk scarves we bought are still our favorite souvenirs."
                </p>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center font-black text-2xl text-[#FF9530]">P</div>
                  <div>
                    <h4 className="text-xl font-black">Priya Malhotra</h4>
                    <p className="text-gray-400 font-bold">Delhi, India</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 7. Day Trip Ideas */}
      <section className="py-32 bg-gray-50 px-6">
        <div className="max-w-[1440px] mx-auto text-center">
          <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-10 leading-tight">Plan Your Day</h2>
          <p className="text-gray-500 text-xl font-medium mb-20">Perfectly timed itineraries for any schedule.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1000px] mx-auto">
            {[
              { type: "Half-Day", title: "Spirit of Guwahati", morning: "Temple Visit", afternoon: "Local Market Shopping", icon: Clock },
              { type: "Full-Day", title: "Adventure & Heritage", morning: "Adventure Park", afternoon: "Local Lunch & Museum", evening: "Sunset River Cruise", icon: MapPin }
            ].map((trip, i) => (
              <div key={i} className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all text-left">
                <div className="flex items-center justify-between mb-10">
                  <span className="bg-orange-50 text-[#FF9530] px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">{trip.type}</span>
                  <trip.icon className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-10">{trip.title}</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-1">M</div>
                    <div>
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Morning</h4>
                      <p className="text-lg font-bold text-gray-900">{trip.morning}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-1">A</div>
                    <div>
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Afternoon</h4>
                      <p className="text-lg font-bold text-gray-900">{trip.afternoon}</p>
                    </div>
                  </div>
                  {trip.evening && (
                    <div className="flex items-start gap-6">
                      <div className="w-8 h-8 bg-[#FF9530] text-white rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-1">E</div>
                      <div>
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Evening</h4>
                        <p className="text-lg font-bold text-gray-900">{trip.evening}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Practical Information */}
      <section className="py-32 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {[
            { title: "Transport Tips", icon: Car, tips: ["Auto-rickshaws: ₹50/km", "Taxi: ₹500/day", "Ask concierge for bookings"] },
            { title: "Best Time to Visit", icon: Clock, tips: ["Sunrise at Hill Spots", "Avoid crowds after 11 AM", "Evening cruises start at 4 PM"] },
            { title: "Pro Tip", icon: Info, tips: ["Carry cash for local markets", "Wear comfortable walking shoes", "Respect religious site rules"] }
          ].map((info, i) => (
            <div key={i} className="bg-gray-50 p-12 rounded-[48px] border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                <info.icon className="w-8 h-8 text-[#FF9530]" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-8">{info.title}</h3>
              <ul className="space-y-4">
                {info.tips.map(tip => (
                  <li key={tip} className="flex items-start gap-4 text-gray-600 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" /> {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Partner Services */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF9530]/5 rounded-full blur-[100px] -ml-[250px] -mb-[250px]" />
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 text-center">
           <span className="text-[#FF9530] font-black uppercase tracking-[0.4em] text-xs mb-6 block">Seamless Travel</span>
           <h2 className="text-4xl md:text-7xl font-black mb-10 leading-tight">Partner Services</h2>
           <p className="text-gray-400 text-xl font-medium mb-20 max-w-[800px] mx-auto">
             Book licensed guides, private transport, and travel essentials directly through our concierge for a hassle-free trip.
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: "Licensed Guides", price: "₹1,000/Day", icon: Users },
                { title: "Car & Driver", price: "₹2,500/Day", icon: Car },
                { title: "Travel Essentials", price: "Medical Kits · SIMs", icon: ShoppingBag }
              ].map((service, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-12 rounded-[48px] hover:bg-white/10 transition-all">
                  <service.icon className="w-12 h-12 text-[#FF9530] mx-auto mb-8" />
                  <h4 className="text-2xl font-black mb-4">{service.title}</h4>
                  <p className="text-[#FF9530] font-black text-xl">{service.price}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 10. Footer Call-to-Action */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
           <div className="bg-gradient-to-r from-gray-900 to-black rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF9530]/10 rounded-full blur-[100px] -mr-[200px] -mt-[200px]" />
              <div className="relative z-10">
                 <h2 className="text-4xl md:text-7xl font-black text-white mb-10 leading-tight">Ready to <span className="text-[#FF9530]">Explore?</span></h2>
                 <p className="text-white/60 text-xl mb-16 font-medium leading-relaxed max-w-[700px] mx-auto">
                    Chat with our concierge on WhatsApp for instant bookings and personalized recommendations.
                 </p>
                 <div className="flex flex-wrap justify-center gap-6">
                    <button className="bg-[#FF9530] text-white px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-4 hover:shadow-2xl transition-all">
                      Chat on WhatsApp <MessageSquare className="w-6 h-6 fill-current" />
                    </button>
                    <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-white/20 transition-all">
                      Call Concierge <Phone className="w-6 h-6" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

    </HotelPageShell>
  );
};

export default ExplorePage;

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
