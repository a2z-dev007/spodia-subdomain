'use client'

import React, { useState } from 'react'
import { Plus, Check, Utensils, X, ArrowRight, ChefHat, Heart, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeading } from './SharedComponents'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, FreeMode } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

interface Dish {
  id: string | number
  name: string
}

interface Package {
  id: string | number
  name: string
  type?: string
  suitable_for?: string
  description?: string
  file?: string | null
  venue_dish_details?: Dish[]
}

interface EventPackagesProps {
  packages: Package[]
  getImageUrl: (path: string | null | undefined) => string
  venueTitle: string
}

export function EventPackages({ packages, getImageUrl, venueTitle }: EventPackagesProps) {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null)
  const [isSeeAllOpen, setIsSeeAllOpen] = useState(false)

  if (!packages || packages.length === 0) return null

  const hasMore = packages.length > 4

  return (
    <section id="packages" className="scroll-mt-[100px] border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <SectionHeading 
          title="Exclusive Event Packages" 
          subtitle={`Discover meticulously crafted experiences designed for every occasion at ${venueTitle}`}
        />
        
        <div className="flex items-center gap-4">
          {hasMore && (
            <button 
              onClick={() => setIsSeeAllOpen(true)}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-orange-50 text-gray-900 font-black text-[11px] uppercase tracking-widest rounded-2xl border border-gray-100 transition-all active:scale-95"
            >
              See All {packages.length} Packages
              <ArrowRight className="w-4 h-4 text-[#FF9530]" />
            </button>
          )}
          
          {/* Custom Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              className="swiper-prev-packages flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-600 [-webkit-tap-highlight-color:transparent]"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="swiper-next-packages flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-600 [-webkit-tap-highlight-color:transparent]"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative group/swiper">
        <Swiper
          modules={[Navigation, Autoplay, FreeMode]}
          spaceBetween={24}
          slidesPerView={1.2}
          freeMode={true}
          navigation={{
            prevEl: '.swiper-prev-packages',
            nextEl: '.swiper-next-packages',
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
            1280: { slidesPerView: 4 }
          }}
          className="packages-swiper !pb-12"
        >
          {packages.map((pkg) => (
            <SwiperSlide key={pkg.id} className="!h-auto">
              <PackageCard 
                pkg={pkg} 
                getImageUrl={getImageUrl} 
                onClick={() => setSelectedPkg(pkg)} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {hasMore && (
        <div className="mt-4 md:hidden flex justify-center">
          <button 
            onClick={() => setIsSeeAllOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-gray-50 text-gray-900 font-black text-[11px] uppercase tracking-widest rounded-2xl border border-gray-100"
          >
            See All Packages (+{packages.length - 4})
          </button>
        </div>
      )}

      {/* Full Screen Modal For Package Data */}
      <AnimatePresence>
        {selectedPkg && (
          <PackageDetailModal 
            pkg={selectedPkg} 
            onClose={() => setSelectedPkg(null)} 
            getImageUrl={getImageUrl} 
          />
        )}
      </AnimatePresence>

      {/* See All Modal */}
      <AnimatePresence>
        {isSeeAllOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-5xl max-h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">All Venue Packages</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Explore all {packages.length} options for your event</p>
                </div>
                <button 
                  onClick={() => setIsSeeAllOpen(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <PackageCard 
                      key={pkg.id} 
                      pkg={pkg} 
                      getImageUrl={getImageUrl} 
                      onClick={() => {
                        setSelectedPkg(pkg);
                        setIsSeeAllOpen(false);
                      }} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .packages-swiper .swiper-slide {
          height: auto;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </section>
  )
}

function PackageCard({ pkg, getImageUrl, onClick }: { pkg: Package, getImageUrl: any, onClick: () => void }) {
  return (
    <div 
      className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-44 overflow-hidden">
        <img 
          src={getImageUrl(pkg.file)} 
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/600x400/orange/white?text=Spodia+Package';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        <div className="absolute top-4 left-4">
          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-lg border border-white/20">
            {pkg.type || 'Special'}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-black text-gray-900 mb-2 leading-tight drop-shadow-sm group-hover:text-[#FF9530] transition-colors">
          {pkg.name}
        </h3>
        <p className="text-[11px] text-gray-500 font-bold leading-relaxed mb-4 line-clamp-2">
          {pkg.description?.replace(/<[^>]*>/g, '') || "Experience a celebration tailored to perfection."}
        </p>
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
            <Heart className="w-3 h-3 text-[#FF9530]" />
            <span className="truncate">{pkg.suitable_for || 'Multiple Occasions'}</span>
          </div>
          <button className="w-full py-3 rounded-xl bg-gray-50 group-hover:bg-[#FF9530] text-gray-900 group-hover:text-white font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm">
            Explore Details
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

function PackageDetailModal({ pkg, onClose, getImageUrl }: { pkg: Package, onClose: () => void, getImageUrl: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-xl p-4 md:p-10"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 50 }}
        className="bg-white w-full max-w-6xl h-full max-h-[92vh] md:max-h-[95vh] rounded-[1.5rem] md:rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row relative shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 bg-black/20 hover:bg-black/30 md:bg-black/10 md:hover:bg-black/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all group"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-white md:text-black group-hover:scale-110 transition-transform" />
        </button>

        {/* Left Side: Visual & Identity */}
        <div className="h-[240px] md:h-auto md:w-5/12 relative shrink-0 overflow-hidden bg-gray-900">
          <img 
            src={getImageUrl(pkg.file)} 
            alt={pkg.name}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white space-y-3 md:space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 bg-[#FF9530] rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">
                {pkg.type || 'Exclusive'}
              </span>
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 bg-white/20 backdrop-blur-md rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/20">
                Spodia Verified
              </span>
            </div>
            <h2 className="text-2xl md:text-5xl font-black leading-tight tracking-tight">
              {pkg.name}
            </h2>
          </div>
        </div>

        {/* Right Side: Detailed Content */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/10 overflow-hidden">
          <div className="p-6 md:p-14 overflow-y-auto custom-scrollbar flex-1">
            <div className="space-y-8 md:space-y-12">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-center pb-8 md:pb-12 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-orange-100 flex items-center justify-center shadow-sm shrink-0">
                    <ChefHat className="w-6 h-6 md:w-7 md:h-7 text-[#FF9530]" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Catering Excellence</p>
                    <p className="text-xs md:text-[13px] font-black text-gray-900">Customized Live Stations</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm shrink-0">
                    <Heart className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Event Suitability</p>
                    <p className="text-xs md:text-[13px] font-black text-gray-900">{pkg.suitable_for || 'All Occasions'}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-1 h-5 md:w-1.5 md:h-6 bg-[#FF9530] rounded-full" />
                  <h4 className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Package Highlights</h4>
                </div>
                <div 
                  className="text-gray-600 font-bold leading-relaxed text-sm md:text-base space-y-4 md:space-y-6 prose prose-slate max-w-none prose-sm md:prose-base"
                  dangerouslySetInnerHTML={{ __html: pkg.description || '' }}
                />
              </div>

              {pkg.venue_dish_details && pkg.venue_dish_details.length > 0 && (
                <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
                    <div className="flex items-center gap-3">
                      <Utensils className="w-5 h-5 md:w-6 md:h-6 text-[#FF9530]" />
                      <h4 className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Menu Experience</h4>
                    </div>
                    <span className="self-start sm:self-auto text-[9px] md:text-[10px] font-black text-[#FF9530] uppercase tracking-widest bg-orange-50 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-orange-100">
                      {pkg.venue_dish_details.length} Delicacies Included
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {pkg.venue_dish_details.map((dish) => (
                      <div key={dish.id} className="group/item flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-lg hover:border-orange-100 border border-transparent transition-all">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-50 flex items-center justify-center shadow-inner shrink-0 group-hover/item:scale-110 transition-transform">
                          <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        </div>
                        <span className="text-xs md:text-sm font-black text-gray-700 group-hover/item:text-gray-900 transition-colors">
                          {dish.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-10 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-[#FF9530]" />
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Spodia Assurance</p>
              </div>
              <p className="text-[13px] font-bold text-gray-600 italic">Seamless coordination from venue selection to final celebration.</p>
            </div>
            <button 
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('OPEN_QUOTE_MODAL'));
              }}
              className="w-full lg:w-auto px-8 py-5 md:px-4 md:py-6 bg-gradient-to-br from-[#FF9530] to-[#FF8000] text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-[12px] rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl shadow-orange-500/30 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              Select & Get Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
