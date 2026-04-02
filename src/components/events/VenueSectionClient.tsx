'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionHeader from './SectionHeader'
import VenueCard from './VenueCard'
import { fetchVenues } from '@/lib/api/eventsEndpoints'
import type { VenueRecord } from '@/lib/api/eventsEndpoints'
import { ChevronRight, ArrowRight, Search } from 'lucide-react'

const shimmerClass =
  'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer'

function VenueCardShimmer({ delay = 0 }: { delay?: number }) {
  const delayStyle = { animationDelay: `${delay * 100}ms` }
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className={`aspect-[4/3] ${shimmerClass}`} style={delayStyle} />
      <div className="p-6 space-y-4">
        <div className={`h-6 rounded-xl ${shimmerClass} w-3/4`} style={delayStyle} />
        <div className={`h-4 rounded-lg ${shimmerClass} w-1/2`} style={delayStyle} />
        <div className="flex justify-between gap-4 pt-4 border-t border-gray-50">
          <div className={`h-8 rounded-xl ${shimmerClass} w-24`} style={delayStyle} />
          <div className={`h-8 rounded-xl ${shimmerClass} w-28`} style={delayStyle} />
        </div>
      </div>
    </div>
  )
}

/** Format price for display (e.g. "2000.00" -> "₹2,000/day") */
function formatVenuePrice(price: string | undefined): string {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (isNaN(num)) return 'Price on request'
  return `₹${num.toLocaleString('en-IN')}/day`
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'

/** Map API VenueRecord to VenueCard props */
function mapVenueToCard(v: VenueRecord) {
  const coverImage = v.images?.find((img) => img.cover_photo) || v.images?.[0]
  const img = coverImage?.file || PLACEHOLDER_IMAGE
  const price = v.package_details?.[0]?.price
  const capacity = v.venue_configuration != null ? String(v.venue_configuration) : 'N/A'
  return {
    name: v.name,
    city: v.city_name || '',
    capacity,
    price: formatVenuePrice(price),
    img,
    id: v.id,
    slug: v.slug,
  }
}

export interface VenueSectionClientProps {
  venueType: number
  eyebrow?: string
  title: string
  subtitle?: string
  viewAllHref?: string
  viewAllText?: string
  bgClass?: string
}

export default function VenueSectionClient({
  venueType,
  eyebrow,
  title,
  subtitle,
  viewAllHref = '/events/search',
  viewAllText = 'View all venues',
  bgClass = 'bg-gray-50/50',
}: VenueSectionClientProps) {
  const [venues, setVenues] = useState<VenueRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchVenues({ venue_type: venueType })
      .then((res) => {
        if (!cancelled && res.records) setVenues(res.records)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load venues')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [venueType])

  const cardItems = venues.map(mapVenueToCard)

  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-12">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
          />
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-2 text-sm font-black text-[#FF9530] uppercase tracking-widest hover:text-[#FF8000] transition-all shrink-0 sm:mb-8"
          >
            {viewAllText}
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-[#FF9530] group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <VenueCardShimmer key={i} delay={i} />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest">{error}</p>
          </div>
        ) : cardItems.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-gray-300 mb-6 border border-gray-100/50">
              <Search className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">No Venues Found</h4>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              We couldn't find any premium venues in this category at the moment. Please check back later or explore other categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cardItems.map((c) => (
              <VenueCard key={c.id} {...c} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
