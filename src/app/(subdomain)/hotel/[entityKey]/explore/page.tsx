import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { MapPin, Navigation, Compass, Camera, ShoppingBag, Landmark, Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export default async function ExplorePage({ params }: Props) {
  const { entityKey } = await params;
  const { name, location, localGems } = propertyData;

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title={`Discover ${location}`}
        subtitle={`Experience the hidden gems and local treasures of ${location}, all within easy reach of ${name}.`}
      />

      {/* 2. Top 3 Places Near Property */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="text-center mb-16">
            <span className="text-[#FF9530] text-sm font-bold uppercase tracking-widest block mb-4">Local Guide</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Top 3 Places Nearby</h2>
            <p className="text-gray-600 text-xl font-medium">Curated by our concierge for the ultimate local experience.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {localGems.map((gem, i) => (
              <div key={i} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
                 <div className="relative h-[300px] w-full overflow-hidden">
                    <Image src={IMAGES.bgSection.src} alt={gem.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
                       <Navigation className="w-4 h-4 text-[#FF9530] fill-current" />
                       <span className="text-sm font-black text-gray-900">{gem.distance}</span>
                    </div>
                 </div>
                 <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-[#FF9530] transition-colors">{gem.name}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed mb-8">
                       A must-visit destination known for its stunning architecture and historical significance.
                    </p>
                    <button className="text-gray-900 font-black text-sm flex items-center gap-2 group/btn border-b-2 border-transparent hover:border-[#FF9530] transition-all pb-1">
                       Explore Details <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 3. Categories Grid */}
      <section className="py-24 bg-gray-50 px-6">
         <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 {icon: Landmark, label: "Spiritual", color: "orange"},
                 {icon: Compass, label: "Nature", color: "blue"},
                 {icon: ShoppingBag, label: "Shopping", color: "orange"},
                 {icon: Camera, label: "History", color: "blue"}
               ].map((cat, i) => (
                 <div key={i} className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform cursor-pointer">
                    <div className={`w-20 h-20 rounded-[28px] ${cat.color === "orange" ? "bg-orange-50 text-[#FF9530]" : "bg-blue-50 text-blue-500"} flex items-center justify-center mb-6`}>
                       <cat.icon className="w-10 h-10" />
                    </div>
                    <span className="text-xl font-black text-gray-900">{cat.label}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. Interactive Map Placeholder */}
      <section className="w-full h-[600px] relative bg-gray-200">
         <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
               <div className="w-24 h-24 bg-[#FF9530]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-[#FF9530] animate-bounce" />
               </div>
               <h2 className="text-3xl font-black text-gray-900 mb-2">Neighborhood Map</h2>
               <p className="text-gray-500 font-medium">Explore attractions, dining, and more near {name}.</p>
            </div>
         </div>
      </section>

      {/* 6. Distance Table */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Proximity at a Glance</h2>
            <p className="text-gray-600 text-xl font-medium">Plan your day with easy travel times.</p>
         </div>
         <div className="overflow-x-auto bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[600px]">
               <thead>
                  <tr className="bg-gray-900 text-white">
                     <th className="p-8 font-black text-lg">Destination</th>
                     <th className="p-8 font-black text-lg">Distance</th>
                     <th className="p-8 font-black text-lg">Travel Time (Car)</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {localGems.map((gem, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                       <td className="p-8 font-black text-gray-900 text-xl">{gem.name}</td>
                       <td className="p-8 font-bold text-gray-600">{gem.distance}</td>
                       <td className="p-8 font-black text-[#FF9530]">
                          <div className="flex items-center gap-3">
                             <Clock className="w-5 h-5" />
                             {parseInt(gem.distance) * 5} mins
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* 5. Curated Tours CTA */}
      <section className="py-24 px-6">
         <div className="max-w-[1200px] mx-auto bg-gray-900 rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF9530]/10 rounded-full blur-[100px] -mr-[250px] -mt-[250px] pointer-events-none" />
            <div className="relative z-10">
               <span className="text-[#FF9530] text-sm font-black uppercase tracking-[0.4em] block mb-6">Concierge Picks</span>
               <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">Handpicked Local Tours</h2>
               <p className="text-white/60 text-xl max-w-[700px] mx-auto mb-12 font-medium leading-relaxed">
                  Let us guide you through the soul of {location}. We offer personalized guided tours to temples, markets, and nature trails.
               </p>
               <button className="bg-[#FF9530] text-white px-12 py-6 rounded-2xl font-black text-xl hover:shadow-[0_10px_40px_rgba(255,149,48,0.5)] transition-all active:scale-95">
                  Book a Guided Tour
               </button>
            </div>
         </div>
      </section>

    </HotelPageShell>
  );
}
