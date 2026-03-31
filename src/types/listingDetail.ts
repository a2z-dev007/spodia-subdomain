export interface ListingDetailTypes {
  status?: string;
  listing_detail?: ListingDetail;
}

export interface ListingDetail {
  id?: number;
  user_id?: number;
  ownerdetails?: Ownerdetails;
  name?: string;
  name_hindi?: string;
  rate_type?: null;
  description?: string;
  description_hindi?: string;
  order?: number;
  property_type?: string;
  property_chain?: string;
  hotel_chain?: number;
  hotel_chain_name?: string;
  star_category?: string;
  no_of_rooms?: number;
  lat?: number;
  lon?: number;
  no_of_floors?: number;
  no_of_buildings?: number;
  is_favourite?: number;
  images?: Image[];
  documents_required_for_check_in?: boolean;
  contactdetails?: Contactdetail[];
  address?: string;
  city?: number;
  state?: number;
  country?: number;
  guest_cancellation_type?: null;
  check_in?: string;
  check_out?: string;
  check_in_age?: string;
  check_in_policies?: string;
  step_completed?: number;
  status?: boolean;
  status_remark?: string;
  instant_booking?: boolean;
  b2c_commission_rate?: number;
  website?: string;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
  meta_tags?: string;
  created?: Date;
  video_request_status?: null;
  check_in_document?: string;
  servicedetails?: Servicedetail[];
  b2b_commission_rate?: number;
  videos?: any[];
  city_name?: string;
  state_name?: string;
  country_short_name?: string;
  country_name?: string;
  show_landing?: boolean;
  show_landing2?: boolean;
  show_featured?: boolean;
  show_popular?: boolean;
  show_top_rated?: boolean;
  show_best_deals?: boolean;
  review_rating?: number;
  sbr_rate?: number;
  review_rating_count?: number;
  video_url?: null;
  rooms?: Room[];
  facilities?: number[];
  facilitiesDetails?: FacilitiesDetail[];
  other_rules?: string;
  highlights?: string;
  guest_description?: null;
  title_highlights?: string;
  meta_names?: string;
  property_highlights?: any[];
  property_highlights_details?: any[];
  cancellation_policies?: CancellationPolicy[];
  taxation_details?: TaxationDetail[];
  deduction_details?: any[];
  promotion_details?: PromotionDetails;
}

export interface CancellationPolicy {
  id?: number;
  cancellation_policy?: number;
  policy_name?: string;
  policy_no_of_days?: number;
  policy_description?: string;
  policy_start_date?: string;
  policy_end_date?: string;
  created?: Date | string;
  status?: boolean;
  status_remark?: null | string;
  created_by?: number;
}

export interface Contactdetail {
  id?: number;
  name?: string;
  email?: string;
  mobile?: string;
  contact_type?: string;
}

export interface FacilitiesDetail {
  id?: number;
  name?: string;
  name_hindi?: string;
  parent?: null;
  amenities_tags?: RoomTypeDetails[];
  image?: string;
  created?: Date;
}

export interface RoomTypeDetails {
  id?: number;
  name?: string;
  created?: Date;
  created_by?: number;
}

export interface Image {
  id?: number;
  file?: string;
  cover_photo?: boolean;
  images_tag?: any[];
  order?: number;
  status?: number;
  status_remark?: null;
  room_images_tag?: any[];
}

export interface Ownerdetails {
  url?: string;
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  mobile?: null;
  profile_image?: null;
  email?: string;
  permissions?: string[];
  role_id?: string;
  is_superuser?: boolean;
  user_type?: string;
  city_id?: string;
  region_id?: string;
  password?: string;
  address_line1?: null;
  address_line2?: null;
  country_id?: string;
  company_name?: null;
  secondary_phone_ext?: null;
  city?: string;
  secondary_phone?: null;
  gender?: null;
  languages_spoken?: null;
  language?: string;
  about_me?: null;
  hometown?: null;
  school?: null;
  created_at?: Date;
  region?: string;
  country?: string;
  pin_code?: null;
  latitude?: null;
  longitude?: null;
  office?: null;
  parent?: null;
  status?: boolean;
  status_remark?: null;
  role_name?: string;
  full_name?: string;
}

export interface PromotionDetails {
  basic_promotion?: any[];
  early_bird_promotion?: any[];
  last_minute_promotion?: any[];
  long_stay_promotion?: any[];
  advance_purchase_promotion?: any[];
  hotel_offer_promotion?: any[];
  member_only_promotion?: any[];
  value_added_promotion?: any[];
}

export interface Room {
  room_name?: string;
  created?: Date;
  description?: string;
  suitable_for_kids?: boolean;
  pets_allowed?: boolean;
  smoking_allowed?: boolean;
  room_type?: number;
  id?: number;
  room_location?: string;
  room_view?: string;
  no_of_rooms?: string;
  costume_room_name?: string;
  base_adults?: number;
  maximum_adults?: number;
  maximum_children?: number;
  dimensions?: string;
  bed_type?: string;
  images?: Image[];
  no_of_beds?: number;
  extra_bed_allowed?: boolean;
  extra_bed_type?: string;
  maximum_occupancy?: number;
  ep_highlights?: string;
  cp_highlights?: string;
  map_highlights?: string;
  ap_highlights?: string;
  room_type_details?: RoomTypeDetails;
  videos?: any[];
  facilitiesDetails?: FacilitiesDetail[];
  facilities?: number[];
  ap_rate?: number;
  map_rate?: number;
  cp_rate?: number;
  ep_rate?: number;
  plans?: Plan[];
}

export interface Plan {
  id?: number;
  plan?: number;
  plan_name?: string;
  plan_items?: RoomTypeDetails[];
  room?: number;
}

export interface Servicedetail {
  id?: number;
  name?: string;
  serviceType?: string;
  openTime?: string;
  closeTime?: string;
  typeofService?: string;
  images?: any[];
}

export interface TaxationDetail {
  id?: number;
  country?: number;
  country_name?: string;
  name?: string;
  code?: string;
  tax_type?: string;
  tax_category?: null;
  amount_or_percentage?: number;
  from_date?: Date;
  to_date?: Date;
  sac_code?: string;
  tax_entries?: TaxEntry[];
  status?: boolean;
  status_remark?: string;
  created?: Date;
  deleted?: boolean;
  created_by?: number;
  full_name?: string;
}

export interface TaxEntry {
  id?: number;
  tax?: number;
  tax_category?: string;
  amount_or_percentage?: number;
  amount_from?: number;
  amount_to?: number;
}
