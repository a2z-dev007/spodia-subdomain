import { fetchTestimonials } from "@/lib/serverDataFetching";
import TestimonialsClient from "./TestimonialsClient";
import { TestimonialRecord } from "@/services/testimonialsService";

// Server Component with ISR
export default async function TestimonialsSSR() {
  let testimonials: TestimonialRecord[] = [];
  let error: string | null = null;

  try {
    const response: any = await fetchTestimonials();
    // API returns: { status: "success", records: [...], totalRecords: 1 }
    testimonials = response?.records || [];
    
    console.log('Testimonials SSR - Fetched testimonials:', response);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    error = 'Failed to load testimonials';
  }

  return <TestimonialsClient initialTestimonials={testimonials} initialError={error} />;
}
