import { parseSubdomain } from "@/lib/resolver/parseSubdomain";
import { isDiscoveryCountrySegment } from "@/lib/resolver/discoveryCountry";
import type { ResolvedEntity, TenantEntityType } from "@/types/tenant";

function locationTypeFromDepth(depth: number): TenantEntityType | null {
  if (depth === 1) return "country";
  if (depth === 2) return "state";
  if (depth >= 3) return "city";
  return null;
}

/**
 * Classifies a discovery hostname segment (before TLD) such as `guwahati-in` or dotted `in`.
 * Aligns with middleware: last segment matching a country code ⇒ discovery chain.
 */
export function isDiscoveryTenantKey(parts: string[]): boolean {
  if (parts.length === 0) return false;
  const last = parts[parts.length - 1] ?? "";
  return isDiscoveryCountrySegment(last);
}

export function resolveEntityFromHotelKey(entityKey: string): ResolvedEntity {
  return {
    type: "hotel",
    parsed: parseSubdomain(entityKey),
  };
}

export function resolveEntityFromLocationSlug(slug: string[]): ResolvedEntity {
  const type = locationTypeFromDepth(slug.length);
  return {
    type: type ?? "country",
    locationSlug: slug,
  };
}

/**
 * Async hook for future API-backed resolution (hotel id, canonical slug, redirects).
 */
export async function resolveHotelTenant(_entityKey: string): Promise<ResolvedEntity> {
  return resolveEntityFromHotelKey(_entityKey);
}
