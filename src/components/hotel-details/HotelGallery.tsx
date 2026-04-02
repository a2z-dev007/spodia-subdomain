"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface HotelGalleryProps {
  hotelId: string
}

const HotelGallery = ({ hotelId }: HotelGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const images = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-2 h-96">
        <div className="col-span-2 relative">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt="Hotel main image"
            fill
            className="object-cover rounded-l-2xl cursor-pointer"
            onClick={() => setShowLightbox(true)}
          />
        </div>
        <div className="grid grid-rows-2 gap-2">
          <div className="relative">
            <Image
              src={images[1] || "/placeholder.svg"}
              alt="Hotel image"
              fill
              className="object-cover cursor-pointer"
              onClick={() => setShowLightbox(true)}
            />
          </div>
          <div className="relative">
            <Image
              src={images[2] || "/placeholder.svg"}
              alt="Hotel image"
              fill
              className="object-cover cursor-pointer"
              onClick={() => setShowLightbox(true)}
            />
          </div>
        </div>
        <div className="grid grid-rows-2 gap-2">
          <div className="relative">
            <Image
              src={images[3] || "/placeholder.svg"}
              alt="Hotel image"
              fill
              className="object-cover rounded-tr-2xl cursor-pointer"
              onClick={() => setShowLightbox(true)}
            />
          </div>
          <div className="relative">
            <Image
              src={images[4] || "/placeholder.svg"}
              alt="Hotel image"
              fill
              className="object-cover rounded-br-2xl cursor-pointer"
              onClick={() => setShowLightbox(true)}
            />
            <div className="absolute inset-0 bg-black/50 rounded-br-2xl flex items-center justify-center cursor-pointer">
              <span className="text-white font-medium">+{images.length - 5} more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <button onClick={prevImage} className="absolute left-4 text-white p-2 hover:bg-white/20 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl h-96">
            <Image src={images[currentImage] || "/placeholder.svg"} alt="Hotel image" fill className="object-contain" />
          </div>

          <button onClick={nextImage} className="absolute right-4 text-white p-2 hover:bg-white/20 rounded-full">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}

export default HotelGallery
