'use client'

import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { SectionHeading, ExpandableHtml } from './SharedComponents'

interface EventDescriptionProps {
  description: string
  venueTags: any[]
  eventTags: any[]
  venueCity: string
  venueName: string
}

export function EventDescription({ description, venueTags, eventTags, venueCity, venueName }: EventDescriptionProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTagsExpanded, setIsTagsExpanded] = useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const allTags = [
    ...(venueTags?.map((vt: any) => ({ ...vt, type: 'venue' })) || []),
    ...(eventTags?.map((et: any) => ({ ...et, type: 'event' })) || [])
  ]

  const limit = isMobile ? 3 : 6
  const displayTags = isTagsExpanded ? allTags : allTags.slice(0, limit)

  return (
    <section id="overview" className="scroll-mt-32">
      <SectionHeading 
        title={`Craft Unforgettable Events in ${venueCity}`} 
        titleClassName="text-gray-900"
        subtitle={`Celebrate Corporate & Social Events – Weddings, Exhibitions & Anniversaries at ${venueName}, ${venueCity}`}
        subtitleClassName="text-[#FF9530]"
      />
      
      <div className="space-y-8">
        <ExpandableHtml htmlContent={description || "Relish an elite atmosphere tailored for grand celebrations."} />
        
        <div className="pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#FF9530] rounded-full" />
            <h4 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
              Celebrate Premium Events at {venueName}, {venueCity}
            </h4>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {displayTags.map((tag: any) => (
              <span 
                key={`${tag.type}-${tag.id}`} 
                className={`${tag.type === 'venue' ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-orange-50 text-[#FF9530] border-orange-100'} text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border shadow-sm cursor-default transition-all hover:scale-105 active:scale-95`}
              >
                {tag.name}
              </span>
            ))}
            
            {allTags.length > limit && (
              <button 
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                className="bg-white text-[#FF9530] border border-orange-100 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-sm hover:bg-orange-50 transition-all flex items-center gap-2 active:scale-95 group"
              >
                {isTagsExpanded ? 'Show Less' : `+${allTags.length - limit} More`}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isTagsExpanded ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
