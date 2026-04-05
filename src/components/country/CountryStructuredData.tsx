import { CountryPageData } from "@/services/countryService";

interface CountryStructuredDataProps {
  data: CountryPageData;
  countryCode: string;
}

export default function CountryStructuredData({
  data,
  countryCode,
}: CountryStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Book Hotels in ${countryCode.toUpperCase()} | Spodia`,
    description: data.data.hero.subtitle,
    url: `https://${countryCode}.spodia.com`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://spodia.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: countryCode.toUpperCase(),
          item: `https://${countryCode}.spodia.com`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: data.data.topCities.map((city, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "City",
          name: city.name,
          url: `https://${city.slug}.spodia.com`,
          image: city.image,
        },
      })),
    },
    publisher: {
      "@type": "Organization",
      name: "Spodia",
      logo: {
        "@type": "ImageObject",
        url: "https://spodia.com/logo.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
