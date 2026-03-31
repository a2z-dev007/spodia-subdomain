import apiClient from "@/lib/api/apiClient";

// Error wrapper for consistent error handling
const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    throw error;
  }
};

export interface TestimonialRecord {
  id: number;
  name: string;
  designation: string;
  location: string;
  description: string;
  file: string;
  key_name: string;
  show_homepage: boolean;
  created: string;
  created_by: number;
  full_name: string;
}

export interface TestimonialsApiResponse {
  totalRecords: number;
  status: string;
  records: TestimonialRecord[];
}

export const getTestimonials = (params?: { show_homepage?: 0 | 1 }) => {
  return handleApiCall(() => apiClient.get("/testimonials/", { params }));
};
