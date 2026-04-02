'use client'

import React from 'react'
import { MapPin, Building2, Phone, Mail } from 'lucide-react'
import { CONTACT_INFO } from '@/utils/const'

interface VenueQuickInfoProps {
  venueName: string
  venueLoc: string
}

export function VenueQuickInfo({ venueName, venueLoc }: VenueQuickInfoProps) {
  return (
    <div className="w-full bg-white mb-6 md:mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border border-gray-100/60 rounded-[2.5rem] p-2 md:p-3 shadow-sm hover:shadow-md transition-shadow">
        
        {/* Venue Name & Detail Column - 5 cols */}
        <div className="lg:col-span-4 flex items-center gap-4 p-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
            <Building2 className="w-7 h-7 md:w-8 md:h-8 text-gray-400" />
          </div>
          <h1 className="text-lg md:text-xl lg:text-2xl font-black text-gray-900 leading-tight tracking-tight">
            {venueName}
          </h1>
        </div>

        {/* Address Column - 4 cols */}
        <div className="lg:col-span-4 flex items-start gap-3 p-4 border-t lg:border-t-0 lg:border-l border-gray-100">
          <MapPin className="w-5 h-5 text-[#FF9530] shrink-0 mt-1" />
          <p className="text-sm md:text-base font-bold text-gray-600 leading-relaxed">
            {venueLoc}
          </p>
        </div>

        {/* Direct Contact Card - 3 cols */}
        <div className="lg:col-span-4 bg-gray-50/80 p-5 md:p-6 rounded-[2rem] border border-gray-100 relative overflow-hidden group">
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 bg-black rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Direct Contact</span>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-x-6 gap-y-3">
              <a href={`tel:${CONTACT_INFO.mobile2}`} className="flex items-center gap-3 group/item">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/item:text-[#FF9530] group-hover/item:border-[#FF9530] transition-all shadow-sm">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-black text-gray-700 group-hover/item:text-[#FF9530] transition-colors">{CONTACT_INFO.mobile2}</span>
              </a>

              <a href={`mailto:${CONTACT_INFO.email1}`} className="flex items-center gap-3 group/item overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/item:text-[#FF9530] group-hover/item:border-[#FF9530] transition-all shadow-sm shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-black text-gray-700 truncate group-hover/item:text-[#FF9530] transition-colors">{CONTACT_INFO.email1}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
