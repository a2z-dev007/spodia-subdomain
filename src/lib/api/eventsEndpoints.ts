import apiClient from "@/lib/api/apiClient";
import type { Venue } from "@/components/events/event-search/types";
import type { FAQResponse } from "@/types/faq";
import {
  getTestimonials,
  type TestimonialRecord,
  type TestimonialsApiResponse,
} from "@/services/testimonialsService";

export type { TestimonialRecord };

export type VenueRecord = Venue;

export interface VenuesResponse {
  status?: string;
  totalRecords?: number;
  records: VenueRecord[];
}

export interface EventTypeRecord {
  id: number;
  name: string;
  file?: string | null;
}

export interface VenueTypeRecord {
  id: number;
  name: string;
  file?: string | null;
}

export type EventTypesResponse = {
  records?: EventTypeRecord[];
  totalRecords?: number;
};

export type VenueTypesResponse = {
  records?: VenueTypeRecord[];
  totalRecords?: number;
};

export interface SearchVenuesParams {
  page_number?: number;
  number_of_records?: number;
  city?: string | number | "";
  venue_type?: number | number[] | string | "";
  event_type?: number | number[] | string | "";
}

function normalizeListParam(
  v: number | number[] | string | "" | undefined
): string | number | undefined {
  if (v === "" || v === undefined) return undefined;
  if (Array.isArray(v)) return v.length ? v.join(",") : undefined;
  return v;
}

export async function fetchVenueTypes(): Promise<VenueTypesResponse> {
  const { data } = await apiClient.get<VenueTypesResponse>("/event-venue-types/");
  return data;
}

export async function fetchEventTypes(): Promise<EventTypesResponse> {
  const { data } = await apiClient.get<EventTypesResponse>("/event-types/");
  return data;
}

export async function fetchVenues(params: {
  venue_type?: number;
  page_number?: number;
  number_of_records?: number;
}): Promise<VenuesResponse> {
  const { data } = await apiClient.get<VenuesResponse>("/event-venues/", {
    params: {
      venue_type: params.venue_type,
      page_number: params.page_number ?? 1,
      number_of_records: params.number_of_records ?? 12,
    },
  });
  return data;
}

export async function searchVenues(
  params: SearchVenuesParams
): Promise<VenuesResponse> {
  const { data } = await apiClient.get<VenuesResponse>("/search-event-venues/", {
    params: {
      page_number: params.page_number ?? 1,
      number_of_records: params.number_of_records ?? 15,
      city: params.city === "" ? undefined : params.city,
      venue_type: normalizeListParam(params.venue_type),
      event_type: normalizeListParam(params.event_type),
    },
  });
  return data;
}

export async function fetchVenueBySlug(slug: string): Promise<VenuesResponse> {
  const { data } = await apiClient.get<VenuesResponse>(
    `/event-venue/find-by-name/${encodeURIComponent(slug)}/`
  );
  return data;
}

export async function fetchVenueFaqs(venueId: number): Promise<FAQResponse> {
  const { data } = await apiClient.get<FAQResponse>("/faqs/", {
    params: { listing: venueId },
  });
  return data;
}

export async function fetchSpodiaTestimonials(): Promise<TestimonialsApiResponse> {
  const res = await getTestimonials({ show_homepage: 1 });
  return res.data as TestimonialsApiResponse;
}

export interface EventEnquiryPayload {
  guest_name: string;
  guest_mobile: string;
  guest_email: string;
  no_of_guests: number;
  meal_preference: string;
  message: string;
  venue: number[];
  event_type: number;
  event_start_date: string;
  event_end_date: string;
  page_url: string;
}

export async function addEventEnquiry(payload: EventEnquiryPayload) {
  const { data } = await apiClient.post("/add-events-enquiry/", payload);
  return data;
}
