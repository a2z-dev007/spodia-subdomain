import SectionHeader from './SectionHeader'
import { whyReasons } from './data'
import { CheckCircle2 } from 'lucide-react'

export default function WhySpodiaSection() {
  return (
    <section className="py-16 lg:py-24 bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div className="relative group">
            <SectionHeader
              eyebrow="The Spodia Advantage"
              title="Experience Venue Booking Refined"
              subtitle="We bridge the gap between premium event spaces and planning excellence with verified inventory and dedicated concierge support."
            />
            
            <ul className="mt-8 space-y-4">
              {['Exclusive Partner Network', 'Transparent Pricing Structure', 'Dedicated Event Concierge'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700 font-semibold group/item">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center group-hover/item:bg-[#FF9530] transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-[#FF9530] group-hover/item:text-white transition-colors" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex gap-4">
              <button className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200">
                Partner With Us
              </button>
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0 max-w-2xl lg:max-w-none mx-auto w-full">
            {/* Main Image */}
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[3/2] sm:aspect-square lg:aspect-[4/5] border-8 border-gray-50 shadow-2xl skew-y-1 group-hover:skew-y-0 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
                alt="Premium Event Space"
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
            </div>

            {/* Floating Glass Cards */}
            <div className="absolute -left-8 top-1/4 backdrop-blur-xl bg-white/80 border border-white/50 p-4 rounded-2xl shadow-2xl animate-bounce-slow hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF9530] flex items-center justify-center text-white">
                  <Star fill="currentColor" className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Top Rated</p>
                  <p className="text-[10px] font-bold text-gray-500">Verified by Hosts</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-1/4 backdrop-blur-xl bg-gray-900/90 border border-white/10 p-4 rounded-2xl shadow-2xl animate-float hidden sm:block">
              <p className="text-2xl font-black text-white tracking-tighter">5,000+</p>
              <p className="text-[10px] font-bold text-[#FF9530] uppercase tracking-widest">Global Events</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyReasons.map((c, idx) => (
            <div
              key={c.title}
              className="group bg-gray-50/50 hover:bg-white p-8 rounded-[2rem] border border-transparent hover:border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                {c.icon}
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-3 tracking-tight group-hover:text-[#FF9530] transition-colors">{c.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

import { Star } from 'lucide-react'
