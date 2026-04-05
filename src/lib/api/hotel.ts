import { getPropertyByName } from "@/services/api";

/**
 * Fetch listing/property context for a hotel subdomain key (best-effort; optional for shell pages).
 */
export async function fetchHotelByTenantKey(entityKey: string) {
  const nameHint = entityKey.replace(/-/g, " ");
  try {
    const res = await getPropertyByName(nameHint);
    return res?.data ?? null;
  } catch {
    return null;
  }
}
