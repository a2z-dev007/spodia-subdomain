'use client'

import React, { useState } from 'react'
import { ChevronRight, Star, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function SectionHeading({ 
  title, 
  subtitle, 
  action,
  titleClassName = "text-gray-900",
  subtitleClassName = "text-gray-500"
}: { 
  title: React.ReactNode; 
  subtitle?: React.ReactNode; 
  action?: React.ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className="mb-2 flex items-end justify-between gap-4  ">
      <div className='pt-4'>
        <h2 className={`text-lg sm:text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 md:gap-3 mb-4 ${titleClassName}`}>
          <div className="w-1 md:w-1.5 h-5 md:h-8 bg-[#FF9530] rounded-full" />
          {title}
        </h2>
        {subtitle && (
          <p className={`${subtitleClassName} mt-1 md:mt-2 font-medium text-[10px] sm:text-xs md:text-base`}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function ExpandableHtml({ htmlContent }: { htmlContent: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Only show toggle if content appears reasonably long (approx > 250 chars)
  const shouldShowToggle = htmlContent.replace(/<[^>]*>?/gm, '').length > 250

  return (
    <div className="flex flex-col items-start w-full relative">
      <div 
        className={`prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none text-gray-600 font-medium leading-relaxed antialiased w-full relative transition-all duration-300 ${!isExpanded && shouldShowToggle ? 'line-clamp-4 overflow-hidden' : ''}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      {!isExpanded && shouldShowToggle && (
        <div className="w-full h-16 bg-gradient-to-t from-white to-transparent absolute bottom-10 left-0 pointer-events-none" />
      )}
      {shouldShowToggle && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-[#FF9530] hover:text-[#d9771e] text-[13px] md:text-[15px] font-black tracking-widest uppercase flex items-center gap-2 transition-colors border-none bg-transparent group z-10 relative"
        >
          {isExpanded ? 'See Less' : 'See More'}
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
        </button>
      )}
    </div>
  )
}

export function ExpandableText({ text, className = "", limit = 150 }: { text: string, className?: string, limit?: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldExpand = text.length > limit

  return (
    <div className="flex flex-col items-start w-full relative mt-1">
      <p className={`w-full relative transition-all duration-300 ${!isExpanded && shouldExpand ? 'line-clamp-4 overflow-hidden' : ''} ${className}`}>
        {text}
      </p>
      {shouldExpand && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-[#FF9530] hover:text-[#d9771e] text-[10px] md:text-[11px] font-black tracking-widest uppercase flex items-center gap-1 transition-colors border-none bg-transparent group z-10 relative"
        >
          {isExpanded ? 'See Less' : 'See More'}
          <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
        </button>
      )}
    </div>
  )
}

export function DetailSkeleton() {
  const shimmerClass = "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Skeleton ── */}
      <div className={`relative w-full ${shimmerClass} flex flex-col items-center justify-center text-center px-4 min-h-[500px] mt-[70px] h-[calc(100vh-70px)] md:mt-[80px] md:h-[calc(100vh-80px)] lg:mt-[116px] lg:h-[calc(100vh-116px)]`}>
        {/* Advanced Gradients Mimic */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
        
        <div className="relative z-10 max-w-4xl w-full flex flex-col items-center pt-16">
          {/* Breadcrumb Skeleton */}
          <div className="hidden md:flex items-center justify-center gap-3 mb-8 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
             <div className={`h-3 w-48 rounded-full bg-white/20 ${shimmerClass} opacity-40`} />
          </div>

          <div className="flex flex-col items-center gap-4 md:gap-8 w-full">
            <div className="flex items-center gap-3">
              {/* Elite Badge Skeleton */}
              <div className="bg-[#FF9530]/50 h-8 w-40 rounded-full shadow-lg backdrop-blur-sm" />
              {/* Rating Skeleton */}
              <div className="bg-[#039c4d]/50 h-8 w-12 rounded-xl shadow-lg backdrop-blur-sm" />
            </div>

            {/* Title Skeleton */}
            <div className={`h-12 md:h-16 lg:h-20 w-[85%] md:w-2/3 rounded-2xl bg-white/20 backdrop-blur-sm ${shimmerClass} opacity-40`} />

            {/* Location Skeleton */}
            <div className={`h-6 w-64 md:w-80 rounded-full bg-white/20 backdrop-blur-sm ${shimmerClass} opacity-30 mt-2`} />
          </div>
        </div>

        {/* Navigation Arrows Mimic */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10" />
        </div>
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10" />
        </div>

        {/* Slide Indicators Mimic */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <div className="h-1.5 w-8 md:w-12 bg-[#FF9530] rounded-full" />
          {[...Array(4)].map((_, i) => (
             <div key={i} className="h-1.5 w-3 md:w-4 bg-white/20 rounded-full" />
          ))}
        </div>

      </div>

      {/* ── Sticky Nav Skeleton ── */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center gap-6 md:gap-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-4 w-20 md:w-24 rounded-full shrink-0 ${shimmerClass}`} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {/* ── Gallery Skeleton ── */}
        <section id="gallery">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[400px] md:h-[600px]">
            <div className={`md:col-span-2 md:row-span-2 rounded-[2rem] ${shimmerClass}`} />
            {[...Array(4)].map((_, i) => (
               <div key={i} className={`hidden md:block rounded-3xl ${shimmerClass}`} />
            ))}
          </div>
        </section>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 md:gap-12 lg:gap-20">
          
          <div className="space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gray-50 rounded-[2.5rem]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className={`w-10 h-10 rounded-2xl ${shimmerClass}`} />
                  <div className={`h-4 w-20 rounded-lg ${shimmerClass}`} />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div className={`h-10 w-64 rounded-xl ${shimmerClass}`} />
              <div className="space-y-4">
                <div className={`h-4 w-full rounded-lg ${shimmerClass}`} />
                <div className={`h-4 w-full rounded-lg ${shimmerClass}`} />
                <div className={`h-4 w-full rounded-lg ${shimmerClass}`} />
                <div className={`h-4 w-3/4 rounded-lg ${shimmerClass}`} />
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-8">
              <div className={`h-10 w-48 rounded-xl ${shimmerClass}`} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${shimmerClass}`} />
                    <div className={`h-4 w-24 rounded-lg ${shimmerClass}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-40 space-y-8">
              <div className={`h-[500px] rounded-[2.5rem] shadow-sm border border-gray-100 ${shimmerClass}`} />
              <div className={`h-48 rounded-[2rem] shadow-sm border border-gray-100 ${shimmerClass}`} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export function ErrorState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <div className="w-24 h-24 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6">
        <ShieldCheck className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Venue Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">We couldn't find the elite venue you're looking for. It may have been relocated or the link is expired.</p>
      <Link href="/events/search" className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#FF9530] transition-all">Back to Search</Link>
    </div>
  )
}
