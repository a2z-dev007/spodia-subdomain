import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { Search, HelpCircle, MessageCircle, Mail, Phone, ChevronDown } from "lucide-react";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export default async function FAQsPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, faqs } = propertyData;

  const categories = [
    { name: "General", icon: <HelpCircle className="w-6 h-6 text-[#FF9530]" />, items: faqs.slice(0, 2) },
    { name: "Booking & Policy", icon: <HelpCircle className="w-6 h-6 text-blue-500" />, items: faqs.slice(2, 3) },
    { name: "Facilities", icon: <HelpCircle className="w-6 h-6 text-[#FF9530]" />, items: [] },
  ];

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title="Common Questions"
        subtitle="Everything you need to know about your stay at The Nandan. Find quick answers to common queries below."
      />

      {/* 2. Search Bar Section */}
      <section className="px-6 -mt-10 md:-mt-16 relative z-20 w-full flex justify-center">
         <div className="max-w-[800px] w-full bg-white rounded-[32px] p-4 md:p-6 shadow-2xl flex items-center gap-4 border border-gray-100">
            <div className="bg-orange-50 p-4 rounded-2xl">
               <Search className="w-6 h-6 text-[#FF9530]" />
            </div>
            <input type="text" placeholder="Search for questions (e.g., parking, breakfast, check-in)..." className="flex-grow bg-transparent border-none outline-none text-lg font-bold text-gray-900 placeholder:text-gray-400" />
         </div>
      </section>

      {/* 3. Categorized Accordions */}
      <section className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto w-full">
         <div className="space-y-16">
            {categories.map((cat, i) => (
              <div key={i}>
                 <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                       {cat.icon}
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-widest">{cat.name}</h2>
                 </div>
                 
                 <div className="space-y-6">
                    {(cat.items.length > 0 ? cat.items : [{q: "Coming soon", a: "We are updating our facility details."}]).map((faq, j) => (
                      <details key={j} className="group bg-white border border-gray-100 rounded-[32px] hover:border-[#FF9530] transition-all overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                         <summary className="flex items-center justify-between cursor-pointer p-8">
                            <span className="text-xl md:text-2xl font-bold text-gray-900 group-open:text-[#FF9530] transition-colors">{faq.q}</span>
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-open:bg-[#FF9530] group-open:text-white transition-all">
                               <ChevronDown className="w-6 h-6 transition-transform duration-300 group-open:rotate-180" />
                            </div>
                         </summary>
                         <div className="px-8 pb-8 text-gray-600 text-lg leading-relaxed font-medium">
                            {faq.a}
                         </div>
                      </details>
                    ))}
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 4. Still Have Questions? Section */}
      <section className="py-24 px-6 bg-gray-50 overflow-hidden relative">
         <div className="max-w-[1200px] mx-auto">
            <div className="bg-gray-900 rounded-[64px] p-12 md:p-24 text-center text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -mr-[250px] -mt-[250px] pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF9530]/10 rounded-full blur-[100px] -ml-[200px] -mb-[200px] pointer-events-none" />
               
               <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-black mb-8">Still Have Questions?</h2>
                  <p className="text-gray-400 text-xl max-w-[700px] mx-auto mb-16 font-medium">
                     Can't find what you're looking for? Reach out to our support team directly. We're available 24/7.
                  </p>
                  
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                     <button className="w-full md:w-auto bg-[#FF9530] text-white px-12 py-6 rounded-[28px] font-black text-xl flex items-center justify-center gap-4 hover:shadow-2xl transition-all group/btn">
                        Chat on WhatsApp <MessageCircle className="w-7 h-7 group-hover/btn:scale-125 transition-transform" />
                     </button>
                     <div className="flex gap-4">
                        <button className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-white">
                           <Phone className="w-7 h-7" />
                        </button>
                        <button className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-white">
                           <Mail className="w-7 h-7" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Popular FAQs Quick Links */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900">Trending Topics</h2>
         </div>
         <div className="flex flex-wrap justify-center gap-4">
            {["Parking Facilities", "Wifi Password", "Late Checkout", "Pet Policy", "Breakfast Menu", "Airport Shuttle"].map(topic => (
              <span key={topic} className="bg-white border border-gray-100 px-6 py-3 rounded-full text-sm font-bold text-gray-600 hover:border-[#FF9530] hover:text-[#FF9530] transition-all cursor-pointer shadow-sm">
                 #{topic}
              </span>
            ))}
         </div>
      </section>

    </HotelPageShell>
  );
}
