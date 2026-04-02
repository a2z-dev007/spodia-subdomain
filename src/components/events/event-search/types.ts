// ─── Venue Search — Shared Types ─────────────────────────────────────────────

export interface VenueImage {
  id: number;
  file: string;
  cover_photo: boolean;
  images_tag: string[];
  order: number;
  status: number;
  status_remark: string | null;
}

export interface ContactDetail {
  id: number;
  name: string;
  email: string;
  mobile: string;
  contact_type: string;
}

export interface ServiceDetail {
  id: number;
  name: string;
  created: string;
  created_by: number;
}

export interface CuisineDetail {
  id: number;
  name: string;
  description: string;
  file: string | null;
  key_name: string | null;
  created: string;
  created_by: number;
}

export interface FacilityDetail {
  id: number;
  name: string;
  name_hindi: string;
  parent: number | null;
  amenities_tags: string[];
  image: string;
  created: string;
}

export interface HighlightDetail {
  id: number;
  name: string;
  created: string;
  created_by: number;
}

export interface PackageDetail {
  id: number;
  venue: number;
  type: string | null;
  venue_name: string;
  file: string | null;
  key_name: string | null;
  name: string;
  suitable_for: string;
  price: string;
  description: string | null;
  created: string;
  status: boolean;
  status_remark: string | null;
  created_by: number;
}

export interface Venue {
  id: number;
  slug?: string;
  name: string;
  description: string;
  order: number;
  listing: number;
  venue_type: number;
  event_type: number;
  contact_details: ContactDetail[];
  venue_services: number[];
  services_details: ServiceDetail[];
  venue_cuisines: number[];
  cuisine_details: CuisineDetail[];
  venue_facilities: number[];
  facilities_details: FacilityDetail[];
  venue_terms_conditions: number[];
  terms_conditions_details: any[];
  venue_highlights: number[];
  highlights_details: HighlightDetail[];
  package_details: PackageDetail[];
  images: VenueImage[];
  address: string;
  city_id: number;
  city_name: string;
  state_id: number;
  state_name: string;
  country_id: number;
  country_name: string;
  country_short_name: string;
  lat: number;
  lon: number;
  is_hotel_venue: boolean;
  // Optional/Derived UI fields
  rating?: number;
  reviews?: number;
  badge?: string;
}

export interface Filters {
  location: string
  venueTypes: number[]
  eventTypes: number[]
  minCap: number
  maxCap: number
  minVeg: number
  maxVeg: number
}
