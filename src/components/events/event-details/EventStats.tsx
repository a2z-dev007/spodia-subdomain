'use client'

import React from 'react'

interface StatItem {
  icon: React.ReactNode
  label: string
  value: string
}

interface EventStatsProps {
  coreStats: StatItem[]
}

export function EventStats({ coreStats }: EventStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
      {coreStats.map((stat, i) => (
        <div key={i} className="bg-gray-50/80 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-gray-100 flex flex-col items-center text-center group hover:bg-orange-50 transition-all">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white text-[#FF9530] flex items-center justify-center mb-2 md:mb-3 shadow-sm border border-orange-100/30 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{stat.label}</p>
          <p className="text-[11px] md:text-[13px] font-black text-gray-900 leading-tight">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
