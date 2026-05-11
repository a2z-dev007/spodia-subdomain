import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { Users, Maximize, Mic2, Tv, Wifi, Utensils, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export default async function EventsPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, events } = propertyData;

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title="Unforgettable Events"
        subtitle={`From grand weddings to corporate summits, ${name} provides the perfect backdrop for your most important moments.`}
        image={IMAGES.eventHero.src}
      />

      {/* 2. Venue Showcase */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {events.venues.map((venue, i) => (
              <div key={i} className="bg-white rounded-[48px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
                 <div className="relative h-[400px] w-full overflow-hidden">
                    <Image src={IMAGES.bgSection.src} alt={venue.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8">
                       <h3 className="text-3xl font-black text-white">{venue.name}</h3>
                    </div>
                 </div>
                 <div className="p-10">
                    <div className="flex flex-wrap gap-6 mb-8">
                       <div className="flex items-center gap-3 text-gray-600 font-bold">
                          <Users className="w-5 h-5 text-[#FF9530]" /> {venue.capacity}
                       </div>
                       <div className="flex items-center gap-3 text-gray-600 font-bold">
                          <Maximize className="w-5 h-5 text-[#FF9530]" /> {i === 0 ? "5,000 sq. ft" : "800 sq. ft"}
                       </div>
                    </div>
                    <ul className="space-y-4 mb-10">
                       {venue.features.map((feature, j) => (
                         <li key={j} className="flex items-center gap-3 text-gray-900 font-bold">
                            <span className="w-2 h-2 bg-[#FF9530] rounded-full"></span> {feature}
                         </li>
                       ))}
                    </ul>
                    <button className="text-[#FF9530] font-black text-lg flex items-center gap-2 group/btn">
                       Inquire Now <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 3. Capacity & Layout Table */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FF9530]/5 rounded-full blur-[120px] -ml-[300px] -mt-[300px] pointer-events-none" />
         <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-16 text-center">Seating Capacities</h2>
            <div className="overflow-x-auto bg-white/5 rounded-[40px] border border-white/10 overflow-hidden backdrop-blur-md">
               <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                     <tr className="bg-white/10 text-[#FF9530]">
                        <th className="p-8 font-black text-lg">Venue Name</th>
                        <th className="p-8 font-black text-lg">Theater</th>
                        <th className="p-8 font-black text-lg">Cluster</th>
                        <th className="p-8 font-black text-lg">Reception</th>
                        <th className="p-8 font-black text-lg">U-Shape</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {events.venues.map((venue, i) => (
                       <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="p-8 font-black text-white text-xl">{venue.name}</td>
                          <td className="p-8 font-bold text-gray-400">{i === 0 ? "450" : "25"}</td>
                          <td className="p-8 font-bold text-gray-400">{i === 0 ? "300" : "15"}</td>
                          <td className="p-8 font-bold text-gray-400">{i === 0 ? "500" : "30"}</td>
                          <td className="p-8 font-bold text-gray-400">{i === 0 ? "120" : "12"}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </section>

      {/* 5. Technical Amenities */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Built for Excellence</h2>
            <p className="text-gray-600 text-xl font-medium">State-of-the-art facilities to ensure your event runs smoothly.</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {icon: Tv, label: "LED Screens"},
              {icon: Mic2, label: "Surround Sound"},
              {icon: Wifi, label: "High-Speed WiFi"},
              {icon: Utensils, label: "Custom Catering"}
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-[32px] flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-xl hover:border-[#FF9530] border border-transparent transition-all">
                 <div className="text-[#FF9530] mb-6 scale-[1.5] group-hover:scale-[1.8] transition-transform">
                   <item.icon />
                 </div>
                 <span className="font-black text-gray-900 text-lg">{item.label}</span>
              </div>
            ))}
         </div>
      </section>

      {/* 7. Event Inquiry Form */}
      <section className="py-24 px-6 bg-gray-50">
         <div className="max-w-[900px] mx-auto bg-white p-12 md:p-20 rounded-[64px] shadow-2xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#FF9530]" />
            <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-12 text-center">Plan Your Event</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="flex flex-col gap-3">
                     <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Contact Name</label>
                     <input type="text" className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] outline-none" />
                  </div>
                  <div className="flex flex-col gap-3">
                     <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Event Type</label>
                     <select className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] outline-none appearance-none">
                        <option>Wedding</option>
                        <option>Conference</option>
                        <option>Birthday Party</option>
                        <option>Other</option>
                     </select>
                  </div>
                  <div className="flex flex-col gap-3">
                     <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Guest Count</label>
                     <input type="number" className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] outline-none" />
                  </div>
                  <div className="flex flex-col gap-3">
                     <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Preferred Date</label>
                     <input type="date" className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] outline-none" />
                  </div>
               </div>
               <div className="flex flex-col gap-3 mb-10">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Special Requirements</label>
                  <textarea rows={4} className="bg-gray-50 border-none rounded-2xl p-6 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] outline-none resize-none"></textarea>
               </div>
               <button className="w-full bg-gray-900 text-white py-6 rounded-[28px] font-black text-xl hover:bg-[#FF9530] transition-all flex items-center justify-center gap-4">
                  Request a Proposal <Calendar className="w-6 h-6" />
               </button>
            </div>
         </div>
      </section>

    </HotelPageShell>
  );
}
