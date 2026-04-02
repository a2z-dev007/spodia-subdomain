'use client'

import React from 'react'
import { Navigation } from 'lucide-react'

interface EventLocationProps {
  venueTitle: string
  venueLoc: string
  lat: string | number | null
  lon: string | number | null
}

export function EventLocation({ venueTitle, venueLoc, lat, lon }: EventLocationProps) {
  return (
    <section id="location" className="scroll-mt-[142px]  w-full overflow-hidden bg-white border-t border-gray-100">
      <div className="relative h-[600px] md:h-[800px] w-full group">
        <iframe
          src={`https://maps.google.com/maps?q=${lat || venueTitle},${lon || ''}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
        
        {/* Compact Top-Left Card */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-8 left-4 right-4 md:left-8 md:right-auto md:max-w-sm bg-white/95 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-4xl border border-white/50 pointer-events-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-1 bg-[#FF9530] rounded-full" />
                <p className="text-[10px] font-black text-[#FF9530] uppercase tracking-widest leading-none">Venue Map</p>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{venueTitle}</h3>
              <p className="text-[13px] font-bold text-gray-500 leading-relaxed mb-8 line-clamp-2">{venueLoc}</p>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat || ''},${lon || ''}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-black text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF9530] transition-all group/btn shadow-2xl active:scale-95"
              >
                Get Directions <Navigation className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
