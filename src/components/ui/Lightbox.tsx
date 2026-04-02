"use client"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize, Grid3X3, Play, Pause } from "lucide-react"
import Image from "next/image"
import { useSwipeable } from "react-swipeable"

interface LightboxProps {
    images: string[]
    isOpen: boolean
    currentIndex: number
    onClose: () => void
    onIndexChange: (index: number) => void
    altText?: string
}

export function Lightbox({
    images,
    isOpen,
    currentIndex,
    onClose,
    onIndexChange,
    altText = "Image"
}: LightboxProps) {
    const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
    const [zoom, setZoom] = useState(1)
    const [showThumbnails, setShowThumbnails] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isSlideshow, setIsSlideshow] = useState(false)
    const slideshowRef = useRef<NodeJS.Timeout | null>(null)

    // Scroll active thumbnail into center view
    useEffect(() => {
        if (thumbnailRefs.current[currentIndex]) {
            thumbnailRefs.current[currentIndex]?.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            })
        }
    }, [currentIndex])

    const nextImage = () => {
        onIndexChange((currentIndex + 1) % images.length)
    }

    const prevImage = () => {
        onIndexChange((currentIndex - 1 + images.length) % images.length)
    }

    // Zoom functions
    const zoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 3))
    }

    const zoomOut = () => {
        setZoom(prev => Math.max(prev - 0.5, 0.5))
    }

    const resetZoom = () => {
        setZoom(1)
    }

    // Fullscreen functions
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    // Slideshow functions
    const toggleSlideshow = () => {
        setIsSlideshow(prev => !prev)
    }

    // Effect to handle slideshow
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isSlideshow) {
            interval = setInterval(() => {
                onIndexChange((currentIndex + 1) % images.length)
            }, 3000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isSlideshow, currentIndex, images.length, onIndexChange])

    // Cleanup slideshow on unmount or close
    useEffect(() => {
        return () => {
            if (slideshowRef.current) {
                clearInterval(slideshowRef.current)
            }
        }
    }, [])

    // Stop slideshow when lightbox closes
    useEffect(() => {
        if (!isOpen && isSlideshow) {
            setIsSlideshow(false)
            if (slideshowRef.current) {
                clearInterval(slideshowRef.current)
                slideshowRef.current = null
            }
        }
    }, [isOpen, isSlideshow])

    // Reset zoom when image changes
    useEffect(() => {
        setZoom(1)
    }, [currentIndex])

    // Swipe handlers for the main image area
    const mainImageHandlers = useSwipeable({
        onSwipedLeft: () => nextImage(),
        onSwipedRight: () => prevImage(),
        preventScrollOnSwipe: true,
        trackMouse: true,
        trackTouch: true,
        delta: 10, // Minimum distance for swipe
        swipeDuration: 500, // Maximum time for swipe
    })

    // General swipe handlers for the entire lightbox (fallback)
    const generalHandlers = useSwipeable({
        onSwipedLeft: () => nextImage(),
        onSwipedRight: () => prevImage(),
        preventScrollOnSwipe: true,
        trackMouse: false, // Only track touch for general area
        trackTouch: true,
        delta: 20, // Slightly higher threshold for general area
    })

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose()
                    break
                case 'ArrowLeft':
                    prevImage()
                    break
                case 'ArrowRight':
                    nextImage()
                    break
                case '+':
                case '=':
                    zoomIn()
                    break
                case '-':
                    zoomOut()
                    break
                case '0':
                    resetZoom()
                    break
                case 'f':
                case 'F':
                    toggleFullscreen()
                    break
                case 't':
                case 'T':
                    setShowThumbnails(!showThumbnails)
                    break
                case ' ':
                    e.preventDefault()
                    if (images.length > 1) toggleSlideshow()
                    break
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, currentIndex])

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen || images.length === 0) return null

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            {...generalHandlers}
        >
            <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
                {/* Control Bar */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
                    {/* Zoom Out */}
                    <button
                        onClick={zoomOut}
                        disabled={zoom <= 0.5}
                        className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>

                    {/* Zoom In */}
                    <button
                        onClick={zoomIn}
                        disabled={zoom >= 3}
                        className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>

                    {/* Fullscreen */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title="Toggle Fullscreen"
                    >
                        <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>

                    {/* Toggle Thumbnails */}
                    <button
                        onClick={() => setShowThumbnails(!showThumbnails)}
                        className={`p-2 rounded-full transition-colors ${showThumbnails
                            ? 'bg-white/30 hover:bg-white/40'
                            : 'bg-white/20 hover:bg-white/30'
                            }`}
                        title="Toggle Thumbnails"
                    >
                        <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>

                    {/* Slideshow */}
                    {images.length > 1 && (
                        <button
                            onClick={toggleSlideshow}
                            className={`p-2 rounded-full transition-colors ${isSlideshow
                                ? 'bg-white/30 hover:bg-white/40'
                                : 'bg-white/20 hover:bg-white/30'
                                }`}
                            title={isSlideshow ? "Stop Slideshow" : "Start Slideshow"}
                        >
                            {isSlideshow ? (
                                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            )}
                        </button>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                </div>

                {/* Navigation Arrows at Viewport Edges (desktop only) */}
                {images.length > 1 && (
                    <>
                        {/* Left Arrow */}
                        <div className="hidden lg:flex absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10">
                            <button
                                onClick={prevImage}
                                className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full shadow-md transition-all"
                            >
                                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </button>
                        </div>

                        {/* Right Arrow */}
                        <div className="hidden lg:flex absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10">
                            <button
                                onClick={nextImage}
                                className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full shadow-md transition-all"
                            >
                                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </button>
                        </div>
                    </>
                )}

                {/* Main Image */}
                <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[55vh] px-2 sm:px-12 md:px-16 flex items-center justify-center">
                    {/* Main Image Container with Enhanced Swipe and Zoom */}
                    <div
                        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-x"
                        {...mainImageHandlers}
                        style={{ touchAction: zoom > 1 ? 'pan-x pan-y' : 'pan-x' }}
                        onDoubleClick={zoom > 1 ? resetZoom : zoomIn}
                    >
                        <div
                            className="relative flex items-center justify-center transition-transform duration-300 ease-out max-w-full max-h-full"
                            style={{
                                transform: `scale(${zoom})`,
                                cursor: zoom > 1 ? 'move' : 'grab'
                            }}
                        >
                            <Image
                                src={images[currentIndex]}
                                alt={`${altText} ${currentIndex + 1}`}
                                width={1920}
                                height={1080}
                                className="select-none rounded-2xl md:rounded-[1rem] w-auto h-auto max-w-full max-h-[50vh] sm:max-h-[60vh] md:h-[55vh] object-contain drop-shadow-2xl"
                                sizes="100vw"
                                priority
                                draggable={false}
                            />
                        </div>

                        {/* Invisible swipe areas for better touch targets on mobile */}
                        {images.length > 1 && (
                            <>
                                <div
                                    className="absolute left-0 top-0 w-1/3 h-full z-10 lg:hidden"
                                    onClick={prevImage}
                                    style={{ touchAction: 'manipulation' }}
                                />
                                <div
                                    className="absolute right-0 top-0 w-1/3 h-full z-10 lg:hidden"
                                    onClick={nextImage}
                                    style={{ touchAction: 'manipulation' }}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Arrow Buttons (mobile/tablet below image) */}
                {images.length > 1 && (
                    <div className=" hidden items-center justify-center gap-6 mt-3 sm:mt-4">
                        <button
                            onClick={prevImage}
                            className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full shadow-md transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full shadow-md transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </div>
                )}

                {/* Image Counter */}
                {images.length > 1 && showThumbnails && (<div className="absolute bottom-8 sm:bottom-8 left-1/2 transform -translate-x-1/2 px-3 sm:px-2 py-1.5 sm:py-1 bg-white/50 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full">
                    {currentIndex + 1} / {images.length}
                </div>)}


                {/* Thumbnail Strip (scrollable & auto-center) */}
                {images.length > 1 && showThumbnails && (
                    <div className="absolute bottom-24 sm:bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-2 sm:p-2 hide-scrollbar transition-opacity duration-300">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                ref={(el) => {
                                    thumbnailRefs.current[index] = el
                                }}
                                onClick={() => onIndexChange(index)}
                                className={`relative w-14 h-10 sm:w-16 sm:h-12 flex-shrink-0 rounded overflow-hidden border-2 transition-all duration-300 ${index === currentIndex
                                    ? "border-white bg-white/20 scale-110 shadow-lg"
                                    : "border-transparent bg-black/40 hover:bg-black/60"
                                    }`}
                            >
                                <Image
                                    src={image}
                                    alt=""
                                    fill
                                    className="object-cover rounded"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Zoom Level Indicator */}
                {zoom !== 1 && (
                    <div className="absolute bottom-8 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                        {Math.round(zoom * 100)}%
                    </div>
                )}
            </div>
        </div>
    )
}

// Hook for easier lightbox management
export function useLightbox() {
    const [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const openLightbox = (imageList: string[], startIndex: number = 0) => {
        setImages(imageList)
        setCurrentIndex(startIndex)
        setIsOpen(true)
    }

    const closeLightbox = () => {
        setIsOpen(false)
        setImages([])
        setCurrentIndex(0)
    }

    const setIndex = (index: number) => {
        setCurrentIndex(index)
    }

    return {
        isOpen,
        images,
        currentIndex,
        openLightbox,
        closeLightbox,
        setIndex
    }
}