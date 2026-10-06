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
    <section className="py-12 md:py-24 bg-gray-50 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-[#FF9530] px-4 py-2 rounded-full mb-4 md:mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">Best Rate Guarantee</span>
          </div>
          <h2 className="text-[28px] md:text-4xl font-black text-gray-900 mb-3 md:mb-6 leading-[1.2]">Transparency is our Policy</h2>
          <p className="text-gray-600 text-base md:text-lg font-medium max-w-2xl mx-auto">
            We promise you the lowest price when you book direct. Found a lower rate? We’ll match it + give 10% extra off!
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-gray-100 gap-[1px]">
            {comparisonData.map((item, index) => (
              <div 
                key={index} 
                className={`p-6 md:p-8 text-center transition-all duration-300 ${item.highlight ? "bg-gray-900 text-white scale-105 z-10 shadow-2xl relative" : "bg-white hover:bg-gray-50"}`}
              >
                <h4 className={`text-[11px] font-black uppercase tracking-widest mb-3 ${item.highlight ? "text-[#FF9530]" : "text-gray-400"}`}>
                  {item.platform}
                </h4>
                <p className="text-3xl font-bold mb-3">{item.price}</p>
                <div className={`text-[9px] xl:text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block ${item.highlight ? "bg-white/10 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {item.note}
                </div>
                {item.highlight && (
                  <div className="mt-6 flex items-center justify-center gap-1.5 text-[#FF9530]">
                    <TrendingDown className="w-4 h-4 animate-bounce" />
                    <span className="font-black text-xs uppercase">Cheapest Option</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-6 md:p-8 bg-gray-100/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
             <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                   <Info className="w-6 h-6 text-[#FF9530]" />
                </div>
                <p className="text-gray-600 font-bold text-sm leading-relaxed">
                   Rates compared as of {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}. <br className="hidden md:block" />
                   <span className="text-gray-400 text-xs mt-1 md:mt-0 block md:inline">Excludes flash sales and member-only coupons on third-party sites.</span>
                </p>
             </div>
             <button className="bg-gray-900 text-white px-6 py-3 rounded-[16px] font-bold text-xs uppercase tracking-widest hover:bg-[#FF9530] transition-all whitespace-nowrap">
                Claim Price Match
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceComparison;
