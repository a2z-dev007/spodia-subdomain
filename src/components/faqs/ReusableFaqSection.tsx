'use client'

import React from 'react'
import SectionHeader from '@/components/events/SectionHeader'
import FaqItem from '@/components/events/FaqItem'
import { HelpCircle, MessageCircle, PhoneIcon } from 'lucide-react'
import { FAQShimmer } from '@/components/faqs/FAQShimmers'

export interface FaqData {
  q: string
  a: string
}

interface ReusableFaqSectionProps {
  faqs?: FaqData[]
  isLoading?: boolean
  eyebrow?: string
  title?: string
  subtitle?: string
}

export default function ReusableFaqSection({
  faqs = [],
  isLoading = false,
  eyebrow = "Expert Guidance",
  title = "Everything You Need to Know",
  subtitle = "Providing clarity and confidence for your venue booking journey. Can't find an answer? Our concierge is ready to assist."
}: ReusableFaqSectionProps) {

  const hasData = faqs && faqs.length > 0
  
  const midPoint = Math.ceil((hasData ? faqs.length : 0) / 2)
  const leftFaqs = hasData ? faqs.slice(0, midPoint) : []
  const rightFaqs = hasData ? faqs.slice(midPoint) : []

  return (
    <section className="py-12 md:py-16 lg:py-12 bg-[#F9FAFB] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF9530]/20 to-transparent" />
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-orange-100/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -right-20 top-1/3 -translate-y-1/2 w-96 h-96 bg-blue-50/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-12 md:mb-20 animate-fade-in-up">
          <SectionHeader 
            eyebrow={eyebrow}
            title={title} 
            subtitle={subtitle}
          />
        </div>

        {isLoading ? (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start px-6">
            <div className="space-y-6">
               <FAQShimmer />
            </div>
            <div className="space-y-6">
               <FAQShimmer />
            </div>
          </div>
        ) : hasData ? (
          <div className="max-h-[460px] md:max-h-[350px] lg:max-h-[280px] overflow-y-auto pb-8 pt-2 px-6 scroll-smooth scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
            <div className={`grid grid-cols-1 ${faqs.length > 1 ? 'md:grid-cols-2' : ''} gap-6 lg:gap-8 items-start pl-2`}>
              {faqs.map((f, idx) => (
                <div key={idx} className="relative group animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="absolute -left-4 top-6 w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 items-center justify-center text-[10px] font-black text-gray-300 group-hover:text-[#FF9530] group-hover:border-[#FF9530]/30 transition-all z-10 hidden xl:flex">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  <FaqItem q={f.q} a={f.a} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 font-medium">
            No frequently asked questions available at the moment.
          </div>
        )}
        
        <div className="mt-16 md:mt-24 p-8 md:p-12 bg-white rounded-3xl md:rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500 group animate-fade-in-up [animation-delay:1000ms]">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-gray-900 flex items-center justify-center text-[#FF9530] shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
              <HelpCircle className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-xl md:text-2xl tracking-tighter mb-2">Still have questions?</h4>
              <p className="text-gray-500 font-medium max-w-md text-sm md:text-base leading-relaxed">Our dedicated venue concierge team is available 24/7 to help you find and shortlist the perfect space for your special event.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 md:mt-0">
            <button className="bg-[#FF9530] flex items-center justify-center gap-2 hover:bg-black text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-200 group-hover:shadow-none">
              <MessageCircle className="w-5 h-5"/> Chat With Support
            </button>
            <button className="bg-white flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-900 border-2 border-gray-900 px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95">
              <PhoneIcon className="w-5 h-5"/> Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
