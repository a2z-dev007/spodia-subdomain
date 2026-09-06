import { getPropertyByName, getPropertyById } from "@/services/api";
import type { ListingDetail } from "@/types/hotelDetails";

/**
 * Fetches dynamic hotel listing details from backend API based on entityKey (slug or ID).
 */
export async function fetchHotelDetails(entityKey: string): Promise<ListingDetail | null> {
  if (!entityKey) return null;

  try {
    // 1. If entityKey is numeric ID
    if (/^\d+$/.test(entityKey)) {
      const res = await getPropertyById(entityKey);
      const detail = res?.data?.listing_detail;
      const hotel = Array.isArray(detail) ? detail[0] : detail;
      if (hotel && Object.keys(hotel).length > 0) return hotel;
    }

    // 2. Search by exact slug / name
    try {
      const res = await getPropertyByName(entityKey);
      const detail = res?.data?.listing_detail;
      const hotel = Array.isArray(detail) ? detail[0] : detail;
      if (hotel && Object.keys(hotel).length > 0) return hotel;
    } catch {
      // Ignore and try formatted name
    }

    // 3. Try with space replaced name (e.g. "palm-resort" -> "palm resort")
    const formattedName = entityKey.replace(/-/g, " ");
    try {
      const res = await getPropertyByName(formattedName);
      const detail = res?.data?.listing_detail;
      const hotel = Array.isArray(detail) ? detail[0] : detail;
      if (hotel && Object.keys(hotel).length > 0) return hotel;
    } catch {
      // Ignore
    }

    return null;
  } catch (error) {
    console.error(`[fetchHotelDetails] Failed to fetch details for key "${entityKey}":`, error);
    return null;
  }
}
