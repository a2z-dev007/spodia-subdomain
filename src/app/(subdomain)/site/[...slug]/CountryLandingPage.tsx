import { CountryPageData } from "@/services/countryService";
import HeroSection from "@/components/country/HeroSection";
import TrendingDestinations from "@/components/country/TrendingDestinations";
import WhySpodia from "@/components/country/WhySpodia";
import HotelChains from "@/components/country/HotelChains";
import TravelInspiration from "@/components/country/TravelInspiration";
import HotelEcosystem from "@/components/country/HotelEcosystem";
import DealsSection from "@/components/country/DealsSection";
import SEOListings from "@/components/country/SEOListings";
import CountryStructuredData from "@/components/country/CountryStructuredData";

interface CountryLandingPageProps {
  data: CountryPageData;
  countryCode: string;
}

export default function CountryLandingPage({
  data,
  countryCode,
}: CountryLandingPageProps) {
  return (
    <main className="min-h-screen bg-background">
      {/* Section 1: Hero */}
      <HeroSection data={data.data.hero} />

      {/* Section 2: Trending Destinations */}
      <TrendingDestinations
        cities={data.data.topCities}
        collections={data.data.collections}
      />

      {/* Section 3: Why Spodia */}
      <WhySpodia features={data.data.whySpodia} />

      {/* Section 4: Hotel Chains */}
      <HotelChains chains={data.data.hotelChains} />

      {/* Section 5: Travel Inspiration */}
      <TravelInspiration blogs={data.data.blogs} />

      {/* Section 6: Hotel Ecosystem (KEY FEATURE) */}
      <HotelEcosystem ecosystem={data.data.ecosystem} />

      {/* Section 7: Deals & Offers */}
      <DealsSection deals={data.data.deals} />

      {/* Section 8: SEO Listings */}
      <SEOListings seoData={data.data.seoSections} />

      {/* Structured Data for SEO */}
      <CountryStructuredData data={data} countryCode={countryCode} />
    </main>
  );
}
