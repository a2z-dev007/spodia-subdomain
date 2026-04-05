import type { ParsedSubdomain } from "@/types/tenant";

export function hotelJsonLd(opts: {
  name: string;
  url: string;
  description?: string;
  parsed?: ParsedSubdomain;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: opts.name,
    url: opts.url,
    description: opts.description,
    address: opts.parsed?.city
      ? {
          "@type": "PostalAddress",
          addressLocality: opts.parsed.city,
          addressCountry: opts.parsed.country?.toUpperCase(),
        }
      : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
