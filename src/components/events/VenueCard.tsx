'use client'

import { useRouter } from 'next/navigation'
import { MapPin, Users, Heart } from 'lucide-react'
import { toSlug } from '@/components/events/event-details/toSlug'

const STAR_PATH = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.196-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'

interface VenueCardProps {
  id: number | string
  slug?: string
  name: string
  city: string
  rating?: string
  capacity: string
  price: string
  img: string
}

export default function VenueCard({ id, slug, name, city, rating, capacity, price, img }: VenueCardProps) {
  const router = useRouter()
  const detailsHref = `/events/details/${slug || toSlug(name)}`

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked the heart/wishlist button, don't trigger card click
    const target = e.target as HTMLElement
    if (target.closest('button')) {
      return
    }
    router.push(detailsHref)
  }

  return (
    <article 
      onClick={handleCardClick}
      className="group relative bg-white rounded-3xl border border-gray-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden hover:-translate-y-2 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-4 right-4 backdrop-blur-md bg-white/90 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-sm border border-white/50">
            <svg className="w-3.5 h-3.5 text-[#FF9530] stroke-[3px]" viewBox="0 0 20 20" fill="currentColor">
              <path d={STAR_PATH} />
            </svg>
            <span className="text-xs font-bold text-gray-900">{rating}</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-4 left-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-[#FF9530] hover:border-[#FF9530] transition-all duration-300 group/heart">
          <Heart className="w-4 h-4 group-hover/heart:fill-white transition-all shadow-sm" />
        </button>

        {/* Dynamic Tag on Hover */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="inline-flex items-center gap-1.5 bg-[#FF9530] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
            Best Rated Choice
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-1 text-[#FF9530]">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{city}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-[#FF9530] transition-colors line-clamp-1">
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-50 text-[#FF9530]">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Capacity</span>
              <span className="text-xs font-bold text-gray-700">{capacity} Guests</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end leading-none">
            <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Starting from</span>
            <span className="text-lg font-black text-gray-900">{price}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
