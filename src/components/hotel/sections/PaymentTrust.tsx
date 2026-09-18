import React from "react";
import { CreditCard, Smartphone, Globe, ShieldCheck, Zap } from "lucide-react";

const PaymentTrust = () => {
  const methods = [
    { icon: <CreditCard className="w-8 h-8" />, title: "Cards", desc: "Visa, Master, Amex" },
    { icon: <Smartphone className="w-8 h-8" />, title: "UPI", desc: "GPay, PhonePe, Paytm" },
    { icon: <Zap className="w-8 h-8" />, title: "NetBanking", desc: "50+ Supported Banks" },
    { icon: <Globe className="w-8 h-8" />, title: "International", desc: "PayPal, Stripe" },
  ];

  return (
    <section className="py-24 bg-white px-6 border-y border-gray-100">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
              Secure Payments, <br/>
              <span className="text-[#FF9530]">Flexible Options.</span>
            </h2>
            <p className="text-gray-600 text-xl font-medium mb-12 leading-relaxed">
              We offer multiple ways to pay for your stay. From instant UPI transfers to convenient monthly installments, booking has never been easier.
            </p>
            
            <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9530]/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
               <div className="relative z-10">
                  <h4 className="text-2xl font-black text-gray-900 mb-4">No Cost EMI Available</h4>
                  <p className="text-gray-500 font-medium mb-8">Pay in 3 interest-free installments with our partner banks.</p>
                  <div className="flex flex-wrap gap-4">
                     {["HDFC BANK", "ICICI Bank", "SBI", "Axis Bank"].map((bank, i) => (
                       <span key={i} className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-gray-400 border border-gray-100">
                         {bank}
                       </span>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {methods.map((method, index) => (
              <div key={index} className="group bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 hover:border-orange-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(255,149,48,0.15)] hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110" />
                
                {/* Icon Container */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF9530] mb-6 relative z-10 group-hover:bg-[#FF9530] group-hover:text-white transition-colors duration-500 shadow-sm group-hover:shadow-orange-500/30 group-hover:rotate-3">
                  {React.cloneElement(method.icon, { className: "w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:scale-110" })}
                </div>
                
                {/* Text Content */}
                <div className="relative z-10">
                  <h4 className="text-lg md:text-xl font-black text-gray-900 mb-2 group-hover:text-[#FF9530] transition-colors">{method.title}</h4>
                  <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed">{method.desc}</p>
                </div>
              </div>
            ))}
            
            <div className="col-span-2 bg-gray-900 p-8 rounded-[32px] flex items-center justify-between text-white">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                     <ShieldCheck className="w-8 h-8 text-[#FF9530]" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black">SSL Secure Gateway</h4>
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">PCI-DSS Compliant Transactions</p>
                  </div>
               </div>
               <div className="hidden md:block">
                  <div className="flex gap-2">
                     <div className="w-2 h-2 bg-[#FF9530] rounded-full" />
                     <div className="w-2 h-2 bg-white/20 rounded-full" />
                     <div className="w-2 h-2 bg-white/20 rounded-full" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentTrust;
