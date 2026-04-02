'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, Users, Utensils, Info, ArrowRight, ShieldCheck, Plus, ChevronRight, Send } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Venue } from './types'
import { toSlug } from '@/components/events/event-details/toSlug'
import { IMAGES } from '@/assets/images'
import { Lightbox, useLightbox } from '@/components/ui/Lightbox'

export function VenueResultCard({ venue, viewType = 'list' }: { venue: Venue, viewType?: 'grid' | 'list' }) {
  const router = useRouter()
  const [imgIdx, setImgIdx] = useState(0)
  const [highlightsModalOpen, setHighlightsModalOpen] = useState(false)
  const { isOpen, images, currentIndex, openLightbox, closeLightbox, setIndex } = useLightbox()
  
  const allImages = venue.images?.map(img => img.file) || []
  const mainImage = venue.images?.length > 0 
    ? venue.images[imgIdx % venue.images.length].file 
    : IMAGES.placeholder.src
    
  // Show up to 3 normal thumbnails
  const thumbnails = venue.images?.slice(0, 3) || []
  const hasMore = venue.images?.length > 3
  
  const venueTitle = venue.name || "Premium Venue"
  const venueLocation = [
    (venue as any)?.area,
    venue.city_name,
    venue.state_name,
    venue.country_name
  ].filter(val => val && val !== 'null').join(", ") || "No address found"
  const detailsHref = `/events/details/${venue.slug || toSlug(venueTitle)}`
  
  // Dynamic Data
  const rating = venue.rating || 0
  const reviews = venue.reviews || 0
  const packagePrice = venue.package_details?.[0]?.price ? Number(venue.package_details[0].price) : 0
  
  // Features/Highlights
  const highlights = venue.highlights_details?.slice(0, 3) || []
  const cuisines = venue.cuisine_details?.slice(0, 2).map(c => c.name).join(', ') || "Global Cuisines"

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked a button, a link, or an image thumbnail, don't trigger card click
    const target = e.target as HTMLElement
    if (
      target.closest('button') || 
      target.closest('a') || 
      target.closest('.mini-thumb') ||
      target.closest('.image-container') ||
      target.closest('[role="dialog"]')
    ) {
      return
    }
    router.push(detailsHref)
  }

  return (
    <article 
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(255,149,48,0.12)] hover:border-[#FF9530]/30 transition-all duration-500 overflow-hidden h-full flex flex-col cursor-pointer`}
    >
      <div className={`flex flex-col ${viewType === 'list' ? 'md:flex-row md:min-h-[320px]' : 'h-full'}`}>

        {/* ── Left: Interactive Image Section ── */}
        <div className={`image-container relative shrink-0 ${viewType === 'list' ? 'md:w-80 lg:w-96 aspect-[16/10] sm:aspect-[4/3] md:aspect-auto' : 'aspect-[16/10]'}`}>
          <div 
            className="relative w-full h-full overflow-hidden cursor-pointer"
            onClick={() => openLightbox(allImages, imgIdx)}
          >
            <img
              src={mainImage}
              alt={venueTitle}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

            {/* Premium Badge */}
            {/* <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase tracking-wider rounded-full px-3 py-1.5 shadow-xl border border-white/50">
              <ShieldCheck className="w-3 h-3 text-[#FF9530]" />
              Verified Venue
            </div> */}

            {/* Image Counter */}
            {venue.images?.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold rounded-full px-2.5 py-1">
                {imgIdx + 1} / {venue.images.length}
              </div>
            )}
          </div>

          {/* Mini thumbnails overlay - Always visible */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-1.5 transition-all duration-500 z-10">
            {thumbnails.map((img, i) => (
              <button 
                key={img.id} 
                className={`mini-thumb w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${imgIdx === i ? 'border-[#FF9530] scale-105' : 'border-white/50 hover:border-white'}`}
                onMouseEnter={() => setImgIdx(i)}
                onClick={(e) => {
                   e.stopPropagation();
                   openLightbox(allImages, i);
                }}
              >
                <img src={img.file} className="w-full h-full object-cover" />
              </button>
            ))}
            
            {hasMore && (
              <button 
                className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/50 hover:border-white bg-black/40 backdrop-blur-md flex flex-col items-center justify-center transition-all hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(allImages, 3);
                }}
              >
                <Plus className="w-3 h-3 text-white" />
                <span className="text-[8px] text-white font-black">ALL</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Right: Content Section ── */}
        <div className={`flex flex-col flex-1 p-4 lg:p-7 justify-between`}>
          
          <div className="space-y-4">
            {/* Header: Title & Rating */}
            {/* Header: Title & Rating */}
            <div className={`flex items-start justify-between gap-4 ${viewType === 'grid' ? 'flex-col sm:flex-row' : ''}`}>
              <div className="flex-1 text-left">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <div className="bg-gray-100 p-1 rounded-md shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold line-clamp-1" title={venueLocation}>{venueLocation}</span>
                  </div>
                  <Link href={detailsHref} className="block group/title">
                    <h3 className={`font-black text-gray-900 leading-tight group-hover/title:text-[#FF9530] transition-colors ${viewType === 'grid' ? 'text-base line-clamp-1' : 'text-xl sm:text-2xl'}`}>
                      {venueTitle}
                    </h3>
                  </Link>
                </div>
              </div>
              {reviews > 0 && (
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1.5 bg-[#039c4d] text-white rounded-lg px-2.5 py-1 shadow-lg shadow-green-500/20">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[11px] font-black">{rating}</span>
                  </div>
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mt-1 whitespace-nowrap">
                    {reviews} Verified Reviews
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {highlights.map(h => (
                <span key={h.id} className="bg-orange-50 text-[#FF9530] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-orange-100">
                  {h.name}
                </span>
              ))}
              {venue.highlights_details && venue.highlights_details.length > 3 && (
                <button 
                  onClick={() => setHighlightsModalOpen(true)}
                  className="text-[#FF9530] text-[10px] font-black uppercase tracking-wider px-2 hover:underline flex items-center gap-0.5"
                >
                  +{venue.highlights_details.length - 3} More
                </button>
              )}
            </div>

            {/* Details Row */}
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-dashed border-gray-100">
              {/* <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Capacity</span>
                  <span className="text-[11px] font-black text-gray-700">200-1500</span>
                </div>
              </div> */}
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5 w-20">Cuisine</span>
                  <span className="text-[11px] font-black text-gray-700 truncate ">{cuisines}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div 
              className={`text-xs text-gray-500 leading-relaxed italic ${viewType === 'grid' ? 'line-clamp-1' : 'line-clamp-2'}`}
              dangerouslySetInnerHTML={{ __html: venue.description || "Indulge in a world-class event experience with our bespoke services." }}
            />
          </div>

          {/* Footer: Price & Actions */}
          <div className="flex flex-col gap-5 pt-5 mt-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Package Starts</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-gray-900 leading-none">
                    ₹{packagePrice.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
              {reviews > 0 && viewType === 'grid' && (
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                   {reviews} verified reviews
                 </span>
              )}
            </div>

            <div className="flex gap-3">
              <Link 
                href={detailsHref}
                className="flex-1 flex items-center justify-center whitespace-nowrap bg-white border-2 border-[#FF9530] text-[#FF9530] font-black py-3 rounded-2xl hover:bg-orange-50 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-sm"
              >
                Send Inquiry
              </Link>
              <Link 
                href={detailsHref} 
                className="flex-[1.2] flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-white font-black py-3 rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest group/btn"
              >
                {viewType === 'grid' ? 'Details' : 'View Details'}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Lightbox 
        images={images}
        isOpen={isOpen}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onIndexChange={setIndex}
        altText={venueTitle}
      />

      <Dialog open={highlightsModalOpen} onOpenChange={setHighlightsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl lg:rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
              Venue Highlights & Services
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 py-4 max-h-[60vh] overflow-y-auto">
            {venue.highlights_details?.map(h => (
              <span key={h.id} className="bg-orange-50 text-[#FF9530] text-[11px] font-bold uppercase tracking-wide px-4 py-1.5 rounded-full border border-orange-100">
                {h.name}
              </span>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}
