import React from 'react'
import { CheckCircle, Star, Users, ShieldCheck } from 'lucide-react'

function StatStrip() {
  const stats = [
    { val: '15,000+', lbl: 'Verified Venues', icon: <CheckCircle className="w-6 h-6" /> },
    { val: '98%', lbl: 'Listing Accuracy', icon: <ShieldCheck className="w-6 h-6" /> },
    { val: '4.8/5', lbl: 'Average Rating', icon: <Star className="w-6 h-6" /> },
    { val: '24/7', lbl: 'Concierge Support', icon: <Users className="w-6 h-6" /> },
  ]

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-[#111827] overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#FF9530]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#FF9530]/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <div key={stat.lbl} className="flex flex-col items-center sm:items-start text-center sm:text-left group cursor-default">
              <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 text-[#FF9530] group-hover:bg-[#FF9530] group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-lg shadow-black/20">
                {stat.icon}
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight">
                {stat.val}
              </p>
              <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">
                {stat.lbl}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatStrip