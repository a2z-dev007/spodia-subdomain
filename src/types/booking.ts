export interface BookingImage {
  id: number
  file: string
  cover_photo: boolean
  images_tag?: any[]
  order: number
  status: number
  status_remark: string | null
}

export interface ListingDetails {
  id: number
  user_id: number
  name: string
  name_hindi: string
  description: string
  address: string
  city: number
  state: number
  country: number
  city_name: string
  state_name: string
  country_name: string
  star_category: string
  check_in: string
  check_out: string
  images: BookingImage[]
  lat: number
  lon: number
  property_type: string
  hotel_chain_name: string
}

export interface TravellerDetails {
  id: number
  username: string
  first_name: string
  last_name: string
  mobile: string
  email: string
  full_name: string
  user_type: string
  role_name: string
}

export interface Booking {
  id: number
  user_id: number
  listing_id: number
  firstname: string
  lastname: string
  phone: string
  arrival_date: string
  departure_date: string
  no_of_adults: number
  no_of_child: number
  total_rooms: number
  booking_number: string
  invoice_number: string
  total_price: string
  price: string
  tax: string
  service_charge: string
  status: string
  city: string
  state: string
  country: string
  no_of_days: number
  created: string
  payment_method: string
  payment_type: string
  listingdetails: ListingDetails
  traveller_details: TravellerDetails
  child_age: string
  total_without_service_charge: string
  discount: string
  owner_earning: string
  booking_type: string
  rental_policies_agreed: boolean
  message: string
  step_completed: number
  payment: any
  room_notes: string
  already_reviewed?: number
}

export interface BookingApiResponse {
  status: string
  records: Booking[]
  total_count?: number
}

export interface BookingFilters {
  status: string
  dateRange: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}