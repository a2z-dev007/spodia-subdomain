'use client'

import React from 'react'
import { Phone, Mail, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONTACT_INFO } from '@/utils/const'
import { ItemGridModal } from '@/components/ui/ItemGridModal'

interface ContactDetail {
  id: string | number
  name: string
  mobile: string
  email: string | null
  contact_type?: string
}

interface EventConciergeProps {
  contacts: ContactDetail[]
  highlights?: { id: string | number, name: string }[]
  venueTitle?: string
}

export function EventConcierge({ contacts, highlights, venueTitle = 'this property' }: EventConciergeProps) {
  const [isHighlightsModalOpen, setIsHighlightsModalOpen] = React.useState(false)
  const displayHighlights = highlights?.slice(0, 2) || []
  const hasMoreHighlights = (highlights?.length || 0) > 2

  return (
    <div className="bg-white rounded-[2.5rem] mb-4 p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden relative group">
      <div className="absolute h-40 w-40 bg-orange-500/5 blur-[80px] -top-10 -right-10 pointer-events-none" />
      

      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-6 bg-black rounded-full" />
        <h4 className="font-black text-gray-900 text-lg tracking-tight">VIP Concierge</h4>
      </div>

      <div className="space-y-4">
        {[
          {
            name: CONTACT_INFO.eventTitle,
            mobile: CONTACT_INFO.mobile2,
            email: CONTACT_INFO.email1,
            contactEmail:CONTACT_INFO.contactEmail,
            contact_type: 'PRIMARY'
          }
        ].map((c, i) => (
          <div key={i} className="flex flex-col gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 w-[calc(100%-48px)]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center font-black text-lg border-2 border-white shadow-sm relative shrink-0 uppercase">
                   {c.name.charAt(0)}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#039c4d] border-2 border-white rounded-full" />
                </div>
                <div className="overflow-hidden w-full pr-2">
                  <p className="text-[13px] md:text-[14px] font-black text-gray-900 leading-none mb-1.5 truncate">{c.name}</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{c.contact_type}</p>
                </div>
              </div>
              <a href={`tel:${c.mobile}`} className="w-10 h-10 shrink-0 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-[#FF9530] hover:text-white transition-all shadow-md border border-gray-100 active:scale-90 touch-none">
                <Phone className="w-4 h-4" />
              </a>
            </div>
            {c.email && (
              <div className="flex items-center gap-2 pt-3 mt-1 border-t border-gray-100/50">
                <div className="w-6 h-6 rounded-full bg-orange-50/50 flex items-center justify-center shrink-0">
                  <Mail className="w-3 h-3 text-[#FF9530]" />
                </div>
                <a href={`mailto:${c.email}`} className="text-[11px] font-bold text-gray-500 hover:text-[#FF9530] transition-colors truncate mb-0.5">
                  {c.email}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {highlights && highlights.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[#FF9530] rounded-full" />
            <h4 className="font-black text-gray-900 text-lg tracking-tight">Venue Highlights</h4>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {displayHighlights.map((h) => (
              <span key={h.id} className="bg-green-50/50 text-[#039c4d] border border-green-100/50 text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl cursor-default flex items-center gap-1.5 whitespace-nowrap">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                {h.name}
              </span>
            ))}

            {hasMoreHighlights && (
              <button 
                onClick={() => setIsHighlightsModalOpen(true)}
                className="bg-gray-50 text-gray-400 border border-gray-100 text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all flex items-center gap-1.5 active:scale-95"
              >
                + {highlights.length - 2} See All
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
          <Mail className="w-5 h-5 text-[#FF9530]" />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Global Support</p>
          <p className="text-[13px] font-bold text-gray-700">{CONTACT_INFO.contactEmail}</p>
        </div>
      </div>

      <ItemGridModal 
        isOpen={isHighlightsModalOpen} 
        onClose={() => setIsHighlightsModalOpen(false)} 
        title="Venue Highlights" 
        subtitle={`Discover every exclusive highlight available at ${venueTitle}`}
        items={highlights || []}
        type="check"
      />
    </div>
  )
}

