'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, FileText, Plus } from 'lucide-react'

interface EventSpeedDialProps {
  whatsappLink: string
  phoneNum: string
  setQuoteOpen: (open: boolean) => void
}

export function EventSpeedDial({ whatsappLink, phoneNum, setQuoteOpen }: EventSpeedDialProps) {
  const [speedDialOpen, setSpeedDialOpen] = useState(false)
  const speedDialRef = useRef<HTMLDivElement>(null)

  // Auto-close speed dial on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedDialRef.current && !speedDialRef.current.contains(event.target as Node)) {
        setSpeedDialOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={speedDialRef} className="fixed bottom-20 lg:bottom-10 right-4 lg:right-10 z-[101] flex flex-col items-end gap-6">
      <AnimatePresence>
        {speedDialOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="flex flex-col items-end gap-4"
          >
            {[
              { icon: <MessageCircle className="w-5 h-5" />, label: 'WhatsApp', color: 'bg-[#25D366]', href: whatsappLink },
              { icon: <Phone className="w-5 h-5" />, label: 'Call Venue', color: 'bg-black', href: `tel:${phoneNum}` },
              { icon: <FileText className="w-5 h-5" />, label: 'Get a Quote', color: 'bg-[#FF9530]', onClick: () => setQuoteOpen(true) },
            ].map((action, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 group cursor-pointer" 
                onClick={() => { 
                  if(action.onClick) action.onClick(); 
                  setSpeedDialOpen(false); 
                }}
              >
                <motion.span 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-gray-100/50"
                >
                  {action.label}
                </motion.span>
                {action.href ? (
                  <a href={action.href} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 md:w-14 md:h-14 ${action.color} text-white rounded-full flex items-center justify-center shadow-3xl hover:scale-110 active:scale-90 transition-all border-[3px] border-white`}>{action.icon}</a>
                ) : (
                  <button className={`w-12 h-12 md:w-14 md:h-14 ${action.color} text-white rounded-full flex items-center justify-center shadow-3xl hover:scale-110 active:scale-90 transition-all border-[3px] border-white`}>{action.icon}</button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative">
        {!speedDialOpen && (
          <div className="absolute inset-0 bg-[#FF9530]/40 rounded-full animate-ping" />
        )}
        <button 
          onClick={() => setSpeedDialOpen(!speedDialOpen)} 
          className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 hover:scale-110 active:scale-95 z-10 ${speedDialOpen ? 'bg-black text-white rotate-[135deg]' : 'bg-gradient-to-br from-[#FF9530] to-[#FF8000] text-white shadow-orange-500/30'}`}
        >
          {speedDialOpen ? <Plus className="w-7 h-7 md:w-8 md:h-8" /> : <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />}
        </button>
      </div>
    </div>
  )
}
