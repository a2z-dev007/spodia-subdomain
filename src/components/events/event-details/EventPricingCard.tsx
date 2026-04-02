'use client'

import React from 'react'
import { Users, Utensils, ShieldCheck } from 'lucide-react'

interface PackageDetail {
  id: string
  name: string
  price: number | string
  file: string | null
  type?: string
  suitable_for?: string
}

interface EventPricingCardProps {
  packageDetails: PackageDetail[]
  getImageUrl: (path: string | null | undefined) => string
  setQuoteOpen: (open: boolean) => void
}

export function EventPricingCard({ packageDetails, getImageUrl, setQuoteOpen }: EventPricingCardProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-700">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
        {/* Left Side: Text and Stats */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">Plan Your Event with Excellence</h3>
            <p className="text-sm md:text-base text-gray-500 font-bold leading-relaxed max-w-2xl">Connect with our event specialists to get a personalized quote tailored to your specific requirements and guest count.</p>
          </div>
          
          <div className="flex flex-wrap gap-8 items-center border-t border-gray-50 pt-8">
            {[
              { icon: <Users className="w-5 h-5 text-[#FF9530]" />, text: "Custom Guest Capacity" },
              { icon: <Utensils className="w-5 h-5 text-[#FF9530]" />, text: "Gourmet Catering Sync" }
            ].map((it, i) => (
              <div key={i} className="flex items-center gap-4 text-gray-800 font-bold text-sm tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                  {it.icon}
                </div>
                {it.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Packages and CTA */}
        <div className="lg:w-[400px] shrink-0 space-y-8">
          {packageDetails && packageDetails.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Available Packages</h4>
              <div className="grid grid-cols-1 gap-3">
                {packageDetails.slice(0, 2).map((pkg) => (
                  <div key={pkg.id} className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex gap-4 hover:border-orange-200 transition-colors cursor-default group">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                      <img 
                        src={getImageUrl(pkg.file)} 
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/400x400/orange/white?text=Package';
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <p className="font-black text-[13px] text-gray-900 leading-tight truncate">{pkg.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 truncate">{pkg.type || pkg.suitable_for}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={() => setQuoteOpen(true)} 
              className="w-full bg-gradient-to-br from-[#FF9530] to-[#FF8000] text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-orange-500/30 active:scale-95 transition-all outline-none"
            >
              Get a Quote
            </button>
            <p className="text-center text-[10px] text-gray-300 font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Spodia Elite Certified
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
