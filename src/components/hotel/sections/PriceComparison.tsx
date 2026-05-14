import React from "react";
import { ShieldCheck, TrendingDown, Info } from "lucide-react";

const PriceComparison = () => {
  const comparisonData = [
    { platform: "Spodia (Direct)", price: "₹6,400", highlight: true, note: "Best Price + 10% Extra Off" },
    { platform: "Booking.com", price: "₹7,200", highlight: false, note: "+ ₹800 convenience fee" },
    { platform: "MakeMyTrip", price: "₹7,450", highlight: false, note: "Standard Rate" },
    { platform: "Expedia", price: "₹7,100", highlight: false, note: "Non-refundable" },
  ];

  return (
    <section className="py-24 bg-gray-50 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-[#FF9530] px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">Best Rate Guarantee</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Transparency is our Policy</h2>
          <p className="text-gray-600 text-xl font-medium max-w-2xl mx-auto">
            We promise you the lowest price when you book direct. Found a lower rate? We’ll match it + give 10% extra off!
          </p>
        </div>

        <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {comparisonData.map((item, index) => (
              <div 
                key={index} 
                className={`p-10 text-center transition-all duration-300 ${item.highlight ? "bg-gray-900 text-white scale-105 z-10 shadow-2xl" : "hover:bg-gray-50"}`}
              >
                <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${item.highlight ? "text-[#FF9530]" : "text-gray-400"}`}>
                  {item.platform}
                </h4>
                <p className="text-4xl font-black mb-4">{item.price}</p>
                <div className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block ${item.highlight ? "bg-white/10 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {item.note}
                </div>
                {item.highlight && (
                  <div className="mt-8 flex items-center justify-center gap-2 text-[#FF9530]">
                    <TrendingDown className="w-5 h-5 animate-bounce" />
                    <span className="font-black text-sm uppercase">Cheapest Option</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-8 bg-gray-100/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                   <Info className="w-6 h-6 text-[#FF9530]" />
                </div>
                <p className="text-gray-600 font-bold text-sm leading-relaxed">
                   Rates compared as of {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}. <br/>
                   <span className="text-gray-400 text-xs">Excludes flash sales and member-only coupons on third-party sites.</span>
                </p>
             </div>
             <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#FF9530] transition-all">
                Claim Price Match
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceComparison;
