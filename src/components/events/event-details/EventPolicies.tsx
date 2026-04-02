import React, { useState } from 'react'
import { ShieldAlert, Info, CheckCircle2, X, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TermCondition {
  id: string | number
  name: string
  description?: string | null | undefined
}

interface EventPoliciesProps {
  policies: TermCondition[]
  setQuoteOpen: (open: boolean) => void
  venueTitle: string
  venueLoc: string
}

export function EventPolicies({ policies, setQuoteOpen, venueTitle, venueLoc }: EventPoliciesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!policies || policies.length === 0) return null

  const displayPolicies = policies.slice(0, 2)

  return (
    <section id="policies" className="scroll-mt-[142px] pt-16 md:pt-12 border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl">
            <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">General Information, Terms & Policies for {venueTitle}</h2>
            <p className="text-[9px] md:text-[11px] font-black text-[#FF9530] uppercase tracking-[0.2em] mt-1">Important Information for Social & Corporate Events at {venueTitle}, {venueLoc}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayPolicies.map((t) => (
          <div key={t.id} className="group flex flex-col p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:border-black hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-bl-[3rem] md:rounded-bl-[4rem] flex items-center justify-center -mr-6 -mt-6 md:-mr-8 md:-mt-8 group-hover:bg-black group-hover:text-white transition-colors">
              <Info className="w-4 h-4 md:w-5 md:h-5 translate-x-[-10px] translate-y-[10px] md:translate-x-[-12px] md:translate-y-[12px]" />
            </div>
            
            <div className="mb-4 md:mb-6 pr-8">
              <h4 className="font-black text-gray-900 text-[12px] md:text-[14px] uppercase tracking-widest mb-2 md:mb-3 leading-tight">{t.name}</h4>
              <div className="w-6 h-1 bg-[#FF9530] rounded-full group-hover:w-12 transition-all duration-500" />
            </div>
            
            <div className="relative">
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-semibold italic line-clamp-3">
                {t.description?.replace(/<[^>]*>?/gm, '') || ''}
              </p>
            </div>
            
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-widest">Protocol Verified</span>
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {policies.length > 2 && (
        <div className="mt-6 md:mt-8 flex justify-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2.5 px-6 py-3 md:px-8 md:py-3.5 rounded-full border border-gray-200 bg-white text-[10px] md:text-xs font-black uppercase tracking-widest text-[#FF9530] hover:bg-[#FF9530] hover:text-white hover:border-[#FF9530] transition-all shadow-sm hover:shadow-lg group"
          >
            <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
            View All {policies.length} Policies
          </button>
        </div>
      )}
      
      <div className="mt-12 p-6 md:p-8 rounded-[2rem] md:rounded-3xl bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center text-[#FF9530] border border-white/5 shrink-0"><Info className="w-5 h-5 md:w-6 md:h-6" /></div>
          <div>
            <p className="font-black text-xs md:text-sm tracking-tight leading-none mb-1.5">Need clarification on these terms?</p>
            <p className="text-gray-400 text-[10px] md:text-[11px] font-medium leading-none">Our legal concierge is available 24/7 to assist with any policy inquiries.</p>
          </div>
        </div>
        <button onClick={() => setQuoteOpen(true)} className="w-full md:w-auto whitespace-nowrap px-8 md:px-10 py-3 md:py-4 bg-[#FF9530] text-black font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-lg active:scale-95">Consult Concierge</button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white w-full sm:max-w-4xl max-h-[85vh] rounded-2xl sm:rounded-[3rem] shadow-4xl flex flex-col overflow-hidden"
            >
              {/* Sticky Header */}
              <div className="shrink-0 flex items-start justify-between p-6 md:px-16 md:pt-12 md:pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 md:mb-4 pr-10">
                    Full Policy Disclosure
                  </h3>
                  <p className="text-gray-500 font-bold text-sm sm:text-base">Elite venue agreements and operational guidelines</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 hover:bg-black hover:text-white transition-all shrink-0 ml-4"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-16 md:pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                  {policies.map((t) => (
                    <div key={t.id} className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-gray-50/50 border border-gray-100 flex flex-col hover:border-[#FF9530]/20 transition-all group">
                      <h4 className="font-black text-gray-900 text-[11px] sm:text-xs md:text-sm uppercase tracking-widest mb-3 group-hover:text-[#FF9530] transition-colors">{t.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold italic">
                        {t.description?.replace(/<[^>]*>?/gm, '') || ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
