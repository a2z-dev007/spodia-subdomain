import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { Download, Play, Instagram, Filter } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export default async function GalleryPage({ params }: Props) {
  const { entityKey } = await params;
  const { name } = propertyData;

  const categories = ["All", "Rooms", "Dining", "Exterior", "Events", "Amenities"];

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title="Glimpses of Luxury"
        subtitle={`Explore the beauty of ${name} through our lens. From serene landscapes to opulent interiors.`}
      />

      {/* 2. Filterable Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
         <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Filter className="w-5 h-5 text-[#FF9530] mr-2" />
            {categories.map(cat => (
              <button key={cat} className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${cat === "All" ? "bg-[#FF9530] text-white shadow-xl" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                 {cat}
              </button>
            ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
              <div key={i} className={`relative overflow-hidden rounded-[40px] group cursor-pointer ${i % 3 === 0 ? "md:row-span-2 h-[600px]" : "h-[300px]"}`}>
                 <Image src={IMAGES.bgSection.src} alt={`Gallery ${i}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6">
                    <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">View Fullscreen</span>
                    <h4 className="text-xl font-bold text-center">Beautiful {i % 2 === 0 ? "Interiors" : "Landscapes"}</h4>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 4. Property Videos */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
         <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-[#FF9530]/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
         <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black mb-6">Virtual Tours</h2>
               <p className="text-gray-400 text-xl font-medium">Experience {name} from anywhere in the world.</p>
            </div>
            <div className="relative aspect-video rounded-[64px] overflow-hidden border border-white/10 group cursor-pointer">
               <Image src={IMAGES.eventHero.src} alt="Video Preview" fill className="object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-24 h-24 bg-[#FF9530] rounded-full flex items-center justify-center group-hover:scale-125 transition-transform shadow-[0_0_50px_rgba(255,149,48,0.5)]">
                     <Play className="w-10 h-10 text-white fill-current ml-2" />
                  </div>
               </div>
               <div className="absolute bottom-12 left-12">
                  <h3 className="text-3xl font-black mb-2">Cinematic Property Tour</h3>
                  <p className="text-white/70 font-medium">4K Experience · 3:45 Mins</p>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Instagram Feed */}
      <section className="py-24 px-6">
         <div className="max-w-[1200px] mx-auto text-center mb-16">
            <Instagram className="w-16 h-16 text-[#FF9530] mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Live From Instagram</h2>
            <p className="text-gray-600 text-xl font-medium italic">Tag us in your stories @the_nandan_hotel</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[1440px] mx-auto">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative group cursor-pointer border border-gray-100">
                 <Image src={IMAGES.bgSection.src} alt="Insta" fill className="object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-bold text-xs">@guest_user_{i}</span>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 6. Download Brochure */}
      <section className="py-24 px-6 bg-[#FF9530]">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-white">
            <div>
               <h2 className="text-4xl md:text-6xl font-black mb-6">Want More Details?</h2>
               <p className="text-white/90 text-xl font-medium">Download our digital brochure for full details, menus, and high-res imagery.</p>
            </div>
            <button className="bg-gray-900 text-white px-12 py-6 rounded-[32px] font-black text-xl hover:shadow-2xl transition-all flex items-center gap-4 group">
               Download Brochure <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
            </button>
         </div>
      </section>

    </HotelPageShell>
  );
}
