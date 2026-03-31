export interface HotelData {
  id?: number;
  name?: string;
  lat?: number;
  lon?: number;
  city_name?: string;
  state_name?: string;
  address?: string;
  star_category?: string;
  review_rating?: number | null;
  review_rating_count?: number | null;
  sbr_rate?: number;
  images?: Image[];
  facilities?: number[];
  facilitiesDetails?: FacilitiesDetail[];
  property_type?: string;
  instant_booking?: boolean;
}

export interface Image {
  id?: number;
  file?: string;
  cover_photo?: boolean;
  images_tag?: any[];
  order?: number;
  status?: number;
  status_remark?: null;
}

export interface FacilitiesDetail {
  id?: number;
  name?: string;
  name_hindi?: string;
  parent?: null;
  amenities_tags?: any[];
  image?: string;
  created?: Date;
}

export interface Contactdetail {
  id?: number;
  name?: string;
  email?: string;
  mobile?: string;
  contact_type?: string;
}
