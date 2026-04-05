import type { ParsedSubdomain } from "@/types/tenant";

/**
 * Parses a tenant key like `hotel-nandan-guwahati-in` into slug + city + country
 * using the convention: `{slug}-{city}-{country}` (country is the last segment, city second-to-last).
 */
export function parseSubdomain(subdomain: string): ParsedSubdomain {
  const raw = subdomain.trim().toLowerCase();
  const parts = raw.split("-").filter(Boolean);

  if (parts.length < 2) {
    return { slug: raw, city: undefined, country: undefined, raw };
  }

  const country = parts.at(-1);
  const city = parts.at(-2);
  const slug = parts.slice(0, -2).join("-") || raw;

  return {
    slug: slug || raw,
    city,
    country,
    raw,
  };
}
