import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { Check, Info, ShieldCheck, CreditCard, Calendar, Users } from "lucide-react";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export default async function TariffPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, rooms } = propertyData;

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title="Rates & Tariffs"
        subtitle={`Transparent pricing for every budget. Book directly with ${name} for the best rates and exclusive benefits.`}
      />

      {/* 2. Pricing Tables */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Standard Rates</h2>
            <p className="text-gray-600 text-xl font-medium">Choose a plan that fits your travel style.</p>
         </div>

         <div className="overflow-x-auto bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[900px]">
               <thead>
                  <tr className="bg-gray-900 text-white">
                     <th className="p-8 font-black text-lg">Room Type</th>
                     <th className="p-8 font-black text-lg">EP (Room Only)</th>
                     <th className="p-8 font-black text-lg">CP (Breakfast)</th>
                     <th className="p-8 font-black text-lg">MAP (Half Board)</th>
                     <th className="p-8 font-black text-lg">AP (Full Board)</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                       <td className="p-8 font-black text-gray-900 text-xl">{room.name}</td>
                       <td className="p-8 font-black text-gray-600">₹{room.price.toLocaleString()}</td>
                       <td className="p-8 font-black text-[#FF9530]">₹{(room.price + 500).toLocaleString()}</td>
                       <td className="p-8 font-black text-gray-600">₹{(room.price + 1200).toLocaleString()}</td>
                       <td className="p-8 font-black text-gray-600">₹{(room.price + 2000).toLocaleString()}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <p className="mt-8 text-gray-400 text-sm italic">* All rates are exclusive of applicable GST (12% - 18% based on room category).</p>
      </section>

      {/* 4. Plan Inclusions */}
      <section className="py-24 bg-gray-50 px-6">
         <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-16 text-center">What's Included?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 {title: "EP Plan", desc: "Just the room for the minimalist traveler.", items: ["Luxury Accommodation", "Daily Housekeeping"]},
                 {title: "CP Plan", desc: "Start your day with a local feast.", items: ["Room", "Grand Buffet Breakfast"]},
                 {title: "MAP Plan", desc: "Perfect for sightseeing days.", items: ["Room", "Breakfast", "Lunch or Dinner"]},
                 {title: "AP Plan", desc: "The ultimate worry-free stay.", items: ["Room", "All Meals Included"]}
               ].map((plan, i) => (
                 <div key={i} className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:border-[#FF9530] transition-all">
                    <h4 className="text-2xl font-black text-gray-900 mb-4">{plan.title}</h4>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">{plan.desc}</p>
                    <ul className="space-y-4">
                       {plan.items.map((item, j) => (
                         <li key={j} className="flex items-center gap-3 text-gray-900 font-bold text-sm">
                            <Check className="w-5 h-5 text-[#FF9530] shrink-0" /> {item}
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. Extra Charges & Child Policy */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-white p-12 rounded-[48px] border border-gray-100 shadow-lg group hover:border-[#FF9530] transition-all duration-500">
               <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 bg-orange-50 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Users className="w-8 h-8 text-[#FF9530]" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900">Guest Policies</h3>
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-50">
                     <span className="font-bold text-gray-600">Extra Adult (above 12 yrs)</span>
                     <span className="font-black text-gray-900">₹1,500 / night</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-50">
                     <span className="font-bold text-gray-600">Child (6 - 12 yrs)</span>
                     <span className="font-black text-gray-900">₹800 / night</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                     <span className="font-bold text-gray-600">Child (below 6 yrs)</span>
                     <span className="font-black text-[#FF9530]">Complimentary</span>
                  </div>
               </div>
            </div>

            <div className="bg-gray-900 p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF9530]/10 rounded-full blur-[80px] -mr-[150px] -mt-[150px]" />
               <div className="flex items-center gap-6 mb-10 relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center">
                     <Calendar className="w-8 h-8 text-[#FF9530]" />
                  </div>
                  <h3 className="text-3xl font-black">Cancellation Policy</h3>
               </div>
               <div className="space-y-8 relative z-10">
                  <div className="flex gap-6">
                     <div className="w-8 h-8 rounded-full border-2 border-[#FF9530] flex items-center justify-center font-black text-sm shrink-0">1</div>
                     <p className="text-gray-400 font-medium leading-relaxed">Cancel up to <span className="text-white font-bold">48 hours</span> before arrival for a full refund.</p>
                  </div>
                  <div className="flex gap-6">
                     <div className="w-8 h-8 rounded-full border-2 border-[#FF9530] flex items-center justify-center font-black text-sm shrink-0">2</div>
                     <p className="text-gray-400 font-medium leading-relaxed">Cancellations within <span className="text-white font-bold">48-24 hours</span> incur a 50% charge of the first night.</p>
                  </div>
                  <div className="flex gap-6">
                     <div className="w-8 h-8 rounded-full border-2 border-[#FF9530] flex items-center justify-center font-black text-sm shrink-0">3</div>
                     <p className="text-gray-400 font-medium leading-relaxed">No-shows or same-day cancellations are <span className="text-white font-bold">Non-Refundable</span>.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. Best Price Guarantee CTA */}
      <section className="py-24 px-6 text-center">
         <div className="max-w-[1000px] mx-auto">
            <ShieldCheck className="w-20 h-20 text-[#FF9530] mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8">Best Price Guarantee</h2>
            <p className="text-gray-600 text-xl max-w-[700px] mx-auto mb-12 font-medium">
               Find a lower price anywhere else? We'll match it and give you an additional <span className="text-[#FF9530] font-black">10% discount</span> on your booking.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
               <button className="w-full md:w-auto bg-gray-900 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-[#FF9530] transition-all shadow-xl">
                  Book Directly Now
               </button>
               <button className="w-full md:w-auto bg-white text-gray-900 border border-gray-200 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all">
                  Contact Reservations
               </button>
            </div>
         </div>
      </section>

    </HotelPageShell>
  );
}
