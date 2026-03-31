// FAQ Types
export interface FAQ {
  id: number;
  listing: number | null;
  listing_name: string | null;
  country: number | null;
  state: number | null;
  city: number | null;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  created_by: number;
  full_name: string;
}

export interface FAQResponse {
  totalRecords: number;
  status: string;
  records: FAQ[];
}

export interface FAQSectionProps {
  listingId?: number;
  cityId?: number;
  stateId?: number;
  countryId?: number;
  title?: string;
  subTitle?: string;
  subTitle2?: string;
}
