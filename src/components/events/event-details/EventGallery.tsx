'use client'
import React, { useState, useEffect } from 'react'
import { Play } from 'lucide-react'

interface EventGalleryProps {
  venueImagesList: string[]
  venueVideosList: string[]
  openLightbox: (images: string[], index: number) => void
  openVideoModal: (index: number) => void
}

export function EventGallery({ venueImagesList, venueVideosList, openLightbox, openVideoModal }: EventGalleryProps) {
  const [isMobile, setIsMobile] = useState(false)
  const videoCount = venueVideosList.length
  const hasVideos = videoCount > 0

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return (
    <section id="gallery" className="scroll-mt-[142px] mb-6 md:mb-8 lg:mb-10">
      <div className="grid grid-cols-4 lg:grid-cols-4 grid-rows-2 md:grid-rows-[repeat(3,minmax(0,1fr))] gap-1 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px]">
        {venueImagesList.slice(0, 9).map((img, idx) => {
          const isFirst = idx === 0;
          
          // Layout:
          // Mobile: 5 items total. 4th is Photo Overlay, 5th is Video Overlay (if any)
          // Desktop: 9 items total. 8th is Photo Overlay, 9th is Video Overlay (if any)
          
          const isPhotoOverlayMobile = hasVideos ? idx === 3 : idx === 4;
          const isVideoOverlayMobile = hasVideos && idx === 4;
          
          const isPhotoOverlayDesktop = hasVideos ? idx === 7 : idx === 8;
          const isVideoOverlayDesktop = hasVideos && idx === 8;
          
          const photoLimitMobile = hasVideos ? 3 : 4;
          const photoLimitDesktop = hasVideos ? 7 : 8;

          const extraPhotosMobile = venueImagesList.length - photoLimitMobile;
          const extraPhotosDesktop = venueImagesList.length - photoLimitDesktop;
          
          const bentoClass = isFirst ? "col-span-2 row-span-2" : "col-span-1 row-span-1";
          const displayClass = idx > 4 ? "hidden md:block" : "block";

          const isVideoCard = isMobile ? isVideoOverlayMobile : isVideoOverlayDesktop;

          return (
            <div 
              key={idx}
              onClick={() => {
                if (isVideoCard) {
                    openVideoModal(0);
                } else {
                    openLightbox(venueImagesList, idx);
                }
              }}
              className={`relative group cursor-pointer overflow-hidden rounded-lg md:rounded-2xl transition-all duration-500 w-full h-full ${bentoClass} ${displayClass}`}
            >
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

              {/* Photo Overlays */}
              <div className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] flex-col items-center justify-center transition-all hover:bg-black/80 ${isPhotoOverlayMobile && extraPhotosMobile > 0 ? 'flex md:hidden' : 'hidden'}`}>
                <span className="text-white text-xl sm:text-2xl font-black drop-shadow-lg">+{extraPhotosMobile}</span>
                <span className="text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-80 text-center leading-tight">Photos</span>
              </div>
              <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex-col items-center justify-center transition-all hover:bg-black/80 ${isPhotoOverlayDesktop && extraPhotosDesktop > 0 ? 'hidden md:flex' : 'hidden'}`}>
                <span className="text-white text-3xl md:text-5xl font-black drop-shadow-lg">+{extraPhotosDesktop}</span>
                <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-2 opacity-80 text-center">Photos</span>
              </div>

              {/* Video Overlays */}
              <div className={`absolute inset-0 bg-black/70 backdrop-blur-[4px] flex flex-col items-center justify-center transition-all hover:bg-black/90 ${isVideoOverlayMobile ? 'flex md:hidden' : 'hidden'}`}>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-white text-lg sm:text-xl font-black">+{videoCount}</span>
                <span className="text-white text-[7px] sm:text-[9px] font-black uppercase tracking-[0.15em] opacity-80">Videos</span>
              </div>
              <div className={`absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center transition-all hover:bg-black/90 ${isVideoOverlayDesktop ? 'hidden md:flex' : 'hidden'}`}>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" />
                </div>
                <span className="text-white text-3xl md:text-5xl font-black">+{videoCount}</span>
                <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-2 opacity-80">Videos</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}
