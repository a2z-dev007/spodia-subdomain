'use client'

import React, { useState } from 'react'
import { Check, Plus, ShieldCheck, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from './SharedComponents'
import { ItemGridModal } from '@/components/ui/ItemGridModal'

interface Amenity {
  id: string | number
  name: string
}

interface EventAmenitiesProps {
  highlights: Amenity[]
  amenities: Amenity[]
  services: Amenity[]
  venueTitle: string
  venueLoc: string
}

export function EventAmenities({ highlights, amenities, services, venueTitle, venueLoc }: EventAmenitiesProps) {
  const [amenityModalType, setAmenityModalType] = useState<'features' | 'services' | 'amenities' | null>(null)

  const hasContent = (highlights?.length || 0) > 0 || (amenities?.length || 0) > 0 || (services?.length || 0) > 0
  if (!hasContent) return null

  return (
    <section id="amenities" className="scroll-mt-[142px] pt-4  md:pb-12 border-t border-gray-100 mt-2">
      <div className="flex items-center gap-3 mb-3">

        <SectionHeading title={`World-Class Amenities at ${venueTitle}, ${venueLoc}`} />
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 md:gap-10 items-stretch">
        {/* 1. VENUE HIGHLIGHTS */}
        {highlights && highlights.length > 0 && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8 shrink-0">
              <div className="w-1.5 h-5 bg-[#039c4d] rounded-full shadow-[0_0_10px_rgba(3,156,77,0.3)]" />
              <h4 className="font-black text-gray-900 text-[10px] md:text-[11px] tracking-widest uppercase bg-green-50/50 px-2 py-1 rounded-md border border-green-100/50">Venue Highlights</h4>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {(highlights || []).slice(0, 2).map((h) => (
                <div key={h.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#039c4d] hover:shadow-md transition-all group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-green-50 text-[#039c4d] flex items-center justify-center shrink-0 group-hover:bg-[#039c4d] group-hover:text-white transition-all">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] font-bold text-gray-800 tracking-tight">{h.name}</span>
                </div>
              ))}
              
              {highlights.length > 2 && (
                <button 
                  onClick={() => setAmenityModalType('features')}
                  className="w-full mt-auto p-4 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-extrabold text-[10px] uppercase tracking-widest hover:border-[#039c4d] hover:text-[#039c4d] hover:bg-green-50/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                  {highlights.length - 2} MORE HIGHLIGHTS
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. CORE AMENITIES */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8 shrink-0">
              <div className="w-1.5 h-5 bg-[#FF9530] rounded-full shadow-[0_0_10px_rgba(255,149,48,0.3)]" />
              <h4 className="font-black text-gray-900 text-[10px] md:text-[11px] tracking-widest uppercase bg-orange-50/50 px-2 py-1 rounded-md border border-orange-100/50">Property Amenities</h4>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {(amenities || []).slice(0, 2).map((a) => (
                <div key={a.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#FF9530] hover:shadow-md transition-all group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF9530] flex items-center justify-center shrink-0 group-hover:bg-[#FF9530] group-hover:text-white transition-all">
                    <div className="w-2.5 h-2.5 rounded-full bg-current" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-800 tracking-tight">{a.name}</span>
                </div>
              ))}
              
              {(amenities || []).length > 2 && (
                <button 
                  onClick={() => setAmenityModalType('amenities')}
                  className="w-full mt-auto p-4 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-extrabold text-[10px] uppercase tracking-widest hover:border-[#FF9530] hover:text-[#FF9530] hover:bg-orange-50/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                  {amenities.length - 2} MORE FACILITIES
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* 3. PREMIUM SERVICES */}
        {services && services.length > 0 && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8 shrink-0">
              <div className="w-1.5 h-5 bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]" />
              <h4 className="font-black text-gray-900 text-[10px] md:text-[11px] tracking-widest uppercase bg-gray-50 px-2 py-1 rounded-md border border-gray-100">In-house Services</h4>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {(services || []).slice(0, 2).map(s => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#FF9530] hover:shadow-md transition-all group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center shrink-0 group-hover:bg-gray-800 group-hover:text-white transition-all">
                    <ShieldCheck className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <span className="text-[13px] font-bold text-gray-800 tracking-tight">{s.name}</span>
                </div>
              ))}
              
              {(services || []).length > 2 && (
                <button 
                  onClick={() => setAmenityModalType('services')}
                  className="w-full mt-auto p-4 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-extrabold text-[10px] uppercase tracking-widest hover:border-[#FF9530] hover:text-[#FF9530] hover:bg-orange-50/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                  {services.length - 2} MORE SERVICES
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <ItemGridModal 
        isOpen={amenityModalType !== null} 
        onClose={() => setAmenityModalType(null)} 
        title={amenityModalType === 'features' ? 'Exclusive Highlights' : amenityModalType === 'amenities' ? 'Property Amenities' : 'Premium Services'}
        subtitle={`Discover every premium ${amenityModalType === 'features' ? 'highlight' : amenityModalType === 'amenities' ? 'amenity' : 'service'} available at ${venueTitle}`}
        items={amenityModalType === 'features' ? highlights : amenityModalType === 'amenities' ? amenities : services}
        type={amenityModalType === 'features' ? 'check' : amenityModalType === 'amenities' ? 'bullet' : 'shield'}
      />
    </section>
  )
}
