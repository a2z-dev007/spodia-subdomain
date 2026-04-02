import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { getNormalizedVideoUrl, isVideoFile } from '@/utils/videoUtils'

interface VideoLightboxProps {
  isOpen: boolean
  onClose: () => void
  videoUrls: string[]
  initialIndex?: number
}

const VideoLightboxComponent = ({ isOpen, onClose, videoUrls, initialIndex = 0 }: VideoLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex)
  }, [isOpen, initialIndex])

  const currentVideoUrl = videoUrls[currentIndex] || null
  
  const normalizedSource = useMemo(() => {
    return getNormalizedVideoUrl(currentVideoUrl, { autoplay: true })
  }, [currentVideoUrl])

  const isDirectFile = isVideoFile(normalizedSource)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoUrls.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videoUrls.length) % videoUrls.length)
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 sm:p-6 md:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full h-full max-w-7xl flex flex-col"
          >
            {/* Top Controls */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FF9530] flex items-center justify-center shadow-[0_0_20px_rgba(255,149,48,0.3)]">
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
                 </div>
                 <div>
                    <h3 className="text-white font-black text-sm md:text-2xl tracking-tight leading-tight">Virtual Experience</h3>
                    <p className="text-white/40 text-[8px] md:text-xs uppercase font-bold tracking-widest leading-none mt-0.5 md:mt-1">
                      Discovery {currentIndex + 1}/{videoUrls.length} • Cinematic Tour
                    </p>
                 </div>
              </div>

              <button 
                onClick={onClose} 
                className="w-9 h-9 md:w-14 md:h-14 bg-white/5 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all group backdrop-blur-md border border-white/10 shrink-0"
              >
                <X className="w-5 h-5 md:h-7 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Main Player Area */}
            <div className="relative flex-1 flex flex-col min-h-0">
              <div className="relative flex-1 w-full bg-black rounded-3xl md:rounded-[3rem] overflow-hidden shadow-3xl border border-white/5 min-h-0">
                {normalizedSource ? (
                  isDirectFile ? (
                    <video 
                      key={normalizedSource}
                      src={normalizedSource} 
                      className="w-full h-full object-contain" 
                      controls 
                      autoPlay 
                      playsInline 
                    >
                      <source src={normalizedSource} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <iframe
                      key={normalizedSource}
                      src={normalizedSource}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-white bg-gray-900/50">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <X className="w-10 h-10 text-white/20" />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-xl text-white mb-2">Source Unavailable</p>
                      <p className="text-white/40 text-sm font-medium">The requested video could not be loaded.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Carousel Navigation - Placed with high z-index and outside player interactions */}
              {videoUrls.length > 1 && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 pointer-events-none z-[10]">
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="pointer-events-auto w-10 h-10 md:w-20 md:h-20 rounded-full bg-black/40 hover:bg-[#FF9530] text-white flex items-center justify-center backdrop-blur-xl transition-all border border-white/10 group active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-10 md:h-10 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="pointer-events-auto w-10 h-10 md:w-20 md:h-20 rounded-full bg-black/40 hover:bg-[#FF9530] text-white flex items-center justify-center backdrop-blur-xl transition-all border border-white/10 group active:scale-90"
                  >
                    <ChevronRight className="w-5 h-5 md:w-10 md:h-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Footer Info */}
            <div className="py-6 md:py-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF9530] animate-pulse" />
                      <p className="text-white font-black text-base md:text-xl tracking-tight">Cinematic Venue Walkthrough</p>
                  </div>
                  <p className="text-white/50 text-[10px] md:text-sm font-medium max-w-3xl leading-relaxed">
                    Experience the luxury, scale, and meticulous design of our premium banquet halls and event spaces in stunning detail. 
                    This tour is protocol-verified for accuracy.
                  </p>
                </div>
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                  <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[#FF9530] text-[9px] md:text-xs font-black uppercase tracking-[0.2em] shadow-lg">Spodia Verified</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export const VideoLightbox = React.memo(VideoLightboxComponent)

