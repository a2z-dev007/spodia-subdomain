"use client"

import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { useAppSelector } from "@/lib/hooks"
import { useQuery } from "@tanstack/react-query"
import { getPropertyById } from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin, Users, ChevronDown, ChevronUp, Check,
  ChevronLeft, ChevronRight, X, Bed, Maximize2,
  Cigarette, Baby, Eye, Layers, ZoomIn
} from "lucide-react"
import { format } from "date-fns"

interface LightBoxProps {
  images: string[]
  startIndex: number
  hotelName: string
  onClose: () => void
}

function LightBox({ images, startIndex, hotelName, onClose }: LightBoxProps) {
  const [current, setCurrent] = useState(startIndex)

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose, prev, next])

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-4 py-3 text-white flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm font-semibold text-white/80 truncate max-w-[60%]">{hotelName}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/60 font-mono">{current + 1} / {images.length}</span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center relative px-12 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={current}
          src={images[current]}
          alt={`${hotelName} - Photo ${current + 1}`}
          className="max-h-full max-w-full object-contain rounded-lg select-none"
          onError={(e) => { e.currentTarget.style.display = "none" }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 md:left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 md:right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>

      <div
        className="flex-shrink-0 px-4 pb-4 pt-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2 overflow-x-auto justify-center scrollbar-none pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-14 h-10 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                i === current ? "border-white scale-110 shadow-lg" : "border-white/20 opacity-60 hover:opacity-90"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ImageSliderProps {
  images: string[]
  hotelName: string
  onImageClick: (index: number) => void
}

function ImageSlider({ images, hotelName, onImageClick }: ImageSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (images.length === 0) {
    return (
      <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-2">
        <span className="text-4xl">🏨</span>
        <span className="text-xs text-gray-400 font-medium">No room photos available</span>
      </div>
    )
  }

  const visibleImages = images.slice(0, 5)
  const extraCount = images.length - 5

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-4 py-4 scrollbar-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {visibleImages.map((src, i) => {
          const isLast = i === visibleImages.length - 1 && extraCount > 0
          return (
            <div
              key={i}
              onClick={() => onImageClick(i)}
              className="relative flex-shrink-0 cursor-pointer group"
              style={{ width: "calc(20% - 7px)", minWidth: 110, scrollSnapAlign: "start" }}
            >
              <div className="relative h-36 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <img
                  src={src}
                  alt={`${hotelName} - ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = "/placeholder.jpg" }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
                {isLast && (
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center rounded-xl">
                    <span className="text-white font-black text-xl">+{extraCount + 1}</span>
                    <span className="text-white/80 text-[10px] font-semibold mt-0.5">More photos</span>
                  </div>
                )}
              </div>
              {!isLast && (
                <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {i + 1}/{images.length}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
        <Maximize2 className="w-3 h-3" />
        {images.length} Photos
      </div>
    </div>
  )
}

const BookingHotelDetailsCard = () => {
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const hotelId = bookingFormData.hotelId

  const { data: hotelApiResponse } = useQuery({
    queryKey: ["hotelDetails", hotelId],
    queryFn: () => getPropertyById(String(hotelId)),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
  })
  const hotelApiData = hotelApiResponse?.data?.listing_detail

  const roomImages = useMemo(() => {
    if (!hotelApiData?.rooms || !bookingFormData.rooms?.length) return []
    const selectedRoomIds = new Set(bookingFormData.rooms.map((r: any) => r.roomId))
    const imgs: string[] = []
    hotelApiData.rooms.forEach((room: any) => {
      if (selectedRoomIds.has(room.id) && room.images?.length) {
        room.images.forEach((img: any) => {
          if (img.file) imgs.push(img.file)
        })
      }
    })
    return imgs
  }, [hotelApiData, bookingFormData.rooms])

  const selectedRoomDetails = useMemo(() => {
    if (!hotelApiData?.rooms || !bookingFormData.rooms?.length) return null
    const firstSelectedId = bookingFormData.rooms[0]?.roomId
    return hotelApiData.rooms.find((r: any) => r.id === firstSelectedId) || null
  }, [hotelApiData, bookingFormData.rooms])

  const nights = useMemo(() => {
    if (bookingFormData.checkInDate && bookingFormData.checkOutDate) {
      const checkIn = new Date(bookingFormData.checkInDate)
      const checkOut = new Date(bookingFormData.checkOutDate)
      const diffDays = Math.ceil(Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays || 1
    }
    return 1
  }, [bookingFormData.checkInDate, bookingFormData.checkOutDate])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "--"
    try { return format(new Date(dateStr), "EEE, dd MMM yyyy") } catch { return dateStr }
  }

  const checkInFormatted = formatDate(bookingFormData.checkInDate || "")
  const checkOutFormatted = formatDate(bookingFormData.checkOutDate || "")

  const guestText = `${bookingFormData.adults || 0} ${(bookingFormData.adults || 0) > 1 ? "Adults" : "Adult"}${
    (bookingFormData.children || 0) > 0 ? `, ${bookingFormData.children} Child` : ""
  }`

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <Card className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer select-none bg-white hover:bg-gray-50/50 transition-colors"
        >
          <h3 className="text-base font-extrabold text-gray-900 tracking-wide uppercase">
            PROPERTY INFO
          </h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isCollapsed && (
          <>
            <ImageSlider
              images={roomImages}
              hotelName={bookingFormData.hotelName || "Hotel"}
              onImageClick={openLightbox}
            />

            <CardContent className="p-6 space-y-5">
              <div className="space-y-1">
                {(bookingFormData as any).hotelRating > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-700 w-fit">
                    {(bookingFormData as any).hotelRating}-Star Hotel
                  </div>
                )}
                <h4 className="text-lg font-extrabold text-gray-900 tracking-tight leading-tight">
                  {bookingFormData.hotelName || "--"}
                </h4>
                {bookingFormData.hotelLocation && (
                  <p className="text-xs text-gray-400 flex items-start gap-1 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>{bookingFormData.hotelLocation}</span>
                  </p>
                )}
              </div>

              {selectedRoomDetails && (
                <div className="flex flex-wrap gap-2">
                  {selectedRoomDetails.bed_type && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[11px] font-semibold text-blue-700">
                      <Bed className="w-3 h-3" /> {selectedRoomDetails.bed_type} Bed
                    </span>
                  )}
                  {selectedRoomDetails.dimensions && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-lg text-[11px] font-semibold text-purple-700">
                      <Layers className="w-3 h-3" /> {selectedRoomDetails.dimensions}
                    </span>
                  )}
                  {selectedRoomDetails.maximum_occupancy > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-100 rounded-lg text-[11px] font-semibold text-green-700">
                      <Users className="w-3 h-3" /> Max {selectedRoomDetails.maximum_occupancy} Guests
                    </span>
                  )}
                  {selectedRoomDetails.room_view && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 rounded-lg text-[11px] font-semibold text-sky-700">
                      <Eye className="w-3 h-3" /> {selectedRoomDetails.room_view}
                    </span>
                  )}
                  {selectedRoomDetails.suitable_for_kids && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-50 border border-pink-100 rounded-lg text-[11px] font-semibold text-pink-700">
                      <Baby className="w-3 h-3" /> Kids Friendly
                    </span>
                  )}
                  {selectedRoomDetails.smoking_allowed !== undefined && (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                      selectedRoomDetails.smoking_allowed
                        ? "bg-orange-50 border border-orange-100 text-orange-700"
                        : "bg-gray-50 border border-gray-200 text-gray-500"
                    }`}>
                      <Cigarette className="w-3 h-3" />
                      {selectedRoomDetails.smoking_allowed ? "Smoking Allowed" : "Non-Smoking"}
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 border border-gray-100 rounded-xl p-4 bg-gray-50/40">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Check In</span>
                  <p className="text-sm font-extrabold text-gray-800 leading-tight">{checkInFormatted}</p>
                  {(bookingFormData as any).hotelCheckInTime && (
                    <span className="text-[10px] text-gray-500 font-medium">{(bookingFormData as any).hotelCheckInTime}</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Check Out</span>
                  <p className="text-sm font-extrabold text-gray-800 leading-tight">{checkOutFormatted}</p>
                  {(bookingFormData as any).hotelCheckOutTime && (
                    <span className="text-[10px] text-gray-500 font-medium">{(bookingFormData as any).hotelCheckOutTime}</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Guests</span>
                  <p className="text-sm font-extrabold text-gray-800 leading-tight">{guestText}</p>
                  <span className="text-[10px] text-gray-500 font-medium">{nights} {nights > 1 ? "Nights" : "Night"}</span>
                </div>
              </div>

              {bookingFormData.rooms?.length > 0 && (
                <div className="border border-gray-100 rounded-xl p-5 bg-white space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                      Great Choice!
                    </span>
                    <h5 className="text-sm font-extrabold text-gray-900">Your Room</h5>
                  </div>

                  {bookingFormData.rooms.map((room: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 first:pt-0 border-t first:border-0 border-gray-100">
                      <div className="space-y-2">
                        <p className="text-sm font-extrabold text-gray-800">
                          {room.quantity || 1}× {room.roomName || room.room}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>{room.adults} Adults occupancy</span>
                        </div>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                          {room.planName || room.plan}
                        </span>
                      </div>
                      {room.planFeatures?.length > 0 && (
                        <div className="space-y-1.5 border-l border-gray-100 md:pl-5">
                          {room.planFeatures.map((feat: string, fIdx: number) => (
                            <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedRoomDetails?.facilitiesDetails?.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-2">Room Amenities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRoomDetails.facilitiesDetails.slice(0, 8).map((f: any) => (
                      <span key={f.id} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-[11px] font-medium text-gray-600">
                        {f.name}
                      </span>
                    ))}
                    {selectedRoomDetails.facilitiesDetails.length > 8 && (
                      <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-[11px] font-medium text-gray-400">
                        +{selectedRoomDetails.facilitiesDetails.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>

      {lightboxOpen && roomImages.length > 0 && (
        <LightBox
          images={roomImages}
          startIndex={lightboxIndex}
          hotelName={bookingFormData.hotelName || "Hotel"}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}

export default BookingHotelDetailsCard
