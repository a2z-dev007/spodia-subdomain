import { BASE_URL } from "@/lib/api/apiClient";
import FAQSectionClient from "./FAQSectionClient";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionSSRProps {
  listingId?: number;
  cityId?: number;
  stateId?: number;
  countryId?: number;
  title?: string;
  subTitle?: string;
  subTitle2?: string;
}

async function fetchFAQs(params: {
  listing?: number;
  city?: number;
  state?: number;
  country?: number;
}) {
  const queryParams = new URLSearchParams();
  
  if (params.listing) queryParams.append('listing', params.listing.toString());
  if (params.city) queryParams.append('city', params.city.toString());
  if (params.state) queryParams.append('state', params.state.toString());
  if (params.country) queryParams.append('country', params.country.toString());

  const url = `${BASE_URL}/faqs/?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600, // 1 hour
        tags: ['faqs'],
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching FAQs:`, error);
    return { status: 'error', records: [] };
  }
}

export default async function FAQSectionSSR({
  listingId,
  cityId,
  stateId,
  countryId,
  title = "Frequently Asked Questions",
  subTitle = "We're here to make your travel stress-free and unforgettable.",
  subTitle2 = "Our support is fast and focused on you."
}: FAQSectionSSRProps) {
  let faqs: FAQ[] = [];
  let error: string | null = null;

  try {
    const response = await fetchFAQs({
      listing: listingId,
      city: cityId,
      state: stateId,
      country: countryId
    });

    if (response.status === 'success' && response.records) {
      faqs = response.records;
    }

    console.log('FAQSection SSR - Fetched FAQs:', faqs.length);
  } catch (err) {
    console.error('Error fetching FAQs:', err);
    error = 'Failed to load FAQs';
  }

  return (
    <FAQSectionClient
      initialFaqs={faqs}
      initialError={error}
      title={title}
      subTitle={subTitle}
      subTitle2={subTitle2}
    />
  );
}
