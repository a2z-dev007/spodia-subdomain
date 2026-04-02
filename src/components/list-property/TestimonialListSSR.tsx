import { fetchTestimonials } from "@/lib/serverDataFetching";
import TestimonialListClient from "./TestimonialListClient";
import { TestimonialRecord } from "@/services/testimonialsService";

// Server Component with ISR
export default async function TestimonialListSSR() {
  let testimonials: TestimonialRecord[] = [];
  let error: string | null = null;

  try {
    const response: any = await fetchTestimonials();
    // API returns: { status: "success", records: [...], totalRecords: 1 }
    testimonials = response?.records || [];
    
    console.log('TestimonialList SSR - Fetched testimonials:', testimonials.length);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    error = 'Failed to load testimonials';
  }

  return <TestimonialListClient initialTestimonials={testimonials} initialError={error} />;
}
