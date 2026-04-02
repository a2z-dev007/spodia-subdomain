import VenueSectionClient from './VenueSectionClient'

// Venue type IDs for each section - update when API provides specific IDs
const VENUE_TYPE_PREMIUM_BANQUET = 34
const VENUE_TYPE_WEDDING = 34 // TODO: Replace with wedding-specific venue_type when available
const VENUE_TYPE_CORPORATE = 34 // TODO: Replace with corporate-specific venue_type when available

// ── Featured Venues (Premium Banquet Halls) ───────────────────────────────────
export function FeaturedVenuesSection() {
  return (
    <VenueSectionClient
      venueType={VENUE_TYPE_PREMIUM_BANQUET}
      eyebrow="Featured"
      title="Premium Banquet Halls & Event Spaces"
      subtitle="Compare capacity, pricing, and ratings to book with confidence."
      viewAllHref={`/events/search?venue_type=${VENUE_TYPE_PREMIUM_BANQUET}`}
      viewAllText="View all venues"
      bgClass="bg-gray-50"
    />
  )
}

// ── Wedding Venues ───────────────────────────────────────────────────────────
export function WeddingVenuesSection() {
  return (
    <VenueSectionClient
      venueType={VENUE_TYPE_WEDDING}
      eyebrow="Wedding Signature"
      title="Wedding Venue Highlights"
      viewAllHref={`/events/search?venue_type=${VENUE_TYPE_WEDDING}`}
      viewAllText="Browse all wedding venues"
      bgClass="bg-white"
    />
  )
}

// ── Corporate Venues ─────────────────────────────────────────────────────────
export function CorporateVenuesSection() {
  return (
    <VenueSectionClient
      venueType={VENUE_TYPE_CORPORATE}
      eyebrow="Corporate Elite"
      title="Corporate & Conference Picks"
      viewAllHref={`/events/search?venue_type=${VENUE_TYPE_CORPORATE}`}
      viewAllText="Browse all corporate venues"
      bgClass="bg-gray-50"
    />
  )
}
