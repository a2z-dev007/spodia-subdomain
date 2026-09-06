export interface PincodeLookupResult {
  success: boolean
  country: string
  state: string
  city: string
  district?: string
  formattedAddress?: string
  message?: string
}

export interface SelectOption {
  value: string | number
  label: string
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

/**
 * Parses Google Maps Geocoding address_components to extract Country, State, and City.
 */
function parseGoogleAddressComponents(result: any): {
  country: string
  state: string
  city: string
  district?: string
  formattedAddress?: string
} {
  const components: Array<{ long_name: string; short_name: string; types: string[] }> =
    result.address_components || []

  let country = ""
  let state = ""
  let locality = ""
  let adminAreaLevel2 = ""
  let adminAreaLevel3 = ""

  for (const comp of components) {
    const types = comp.types || []
    if (types.includes("country")) {
      country = comp.long_name
    } else if (types.includes("administrative_area_level_1")) {
      state = comp.long_name
    } else if (types.includes("locality")) {
      locality = comp.long_name
    } else if (types.includes("administrative_area_level_2")) {
      adminAreaLevel2 = comp.long_name
    } else if (types.includes("administrative_area_level_3")) {
      adminAreaLevel3 = comp.long_name
    }
  }

  const city = locality || adminAreaLevel2 || adminAreaLevel3 || ""

  return {
    country: country || "India",
    state,
    city,
    district: adminAreaLevel2,
    formattedAddress: result.formatted_address || "",
  }
}

/**
 * Fetches location details (Country, State, City) using Google Maps Geocoding API.
 */
export async function lookupLocationByPincode(pincode: string): Promise<PincodeLookupResult> {
  const cleanPincode = pincode.trim().replace(/\s+/g, "")

  if (!cleanPincode || cleanPincode.length < 4) {
    return { success: false, country: "", state: "", city: "", message: "Invalid PIN code" }
  }

  // 1. Try browser window.google.maps.Geocoder if loaded
  if (typeof window !== "undefined" && window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder()
      const geocodePromise = new Promise<PincodeLookupResult>((resolve) => {
        geocoder.geocode(
          {
            address: cleanPincode,
            componentRestrictions: { country: "IN" },
          },
          (results, status) => {
            if (status === "OK" && results && results.length > 0) {
              const parsed = parseGoogleAddressComponents(results[0])
              if (parsed.state || parsed.city) {
                resolve({ success: true, ...parsed })
                return
              }
            }
            resolve({
              success: false,
              country: "",
              state: "",
              city: "",
              message: "Location not found for this PIN code in Google Maps",
            })
          }
        )
      })

      const res = await geocodePromise
      if (res.success) return res
    } catch (e) {
      console.warn("Google Maps JS Geocoder failed, trying Google REST API", e)
    }
  }

  // 2. Fallback to Google Maps Geocoding REST API with Google API key
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      cleanPincode
    )}&components=country:IN&key=${GOOGLE_MAPS_API_KEY}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Google Maps API HTTP ${response.status}`)
    }

    const data = await response.json()
    if (data.status === "OK" && data.results && data.results.length > 0) {
      const parsed = parseGoogleAddressComponents(data.results[0])
      return {
        success: true,
        ...parsed,
      }
    } else {
      return {
        success: false,
        country: "",
        state: "",
        city: "",
        message: data.error_message || "No location details found for this PIN code",
      }
    }
  } catch (error: any) {
    console.error("Google Maps Geocoding error:", error)
    return {
      success: false,
      country: "",
      state: "",
      city: "",
      message: error?.message || "Google Maps lookup failed",
    }
  }
}

/**
 * Normalizes text for comparison (lowercase, removes special characters and spaces)
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "")
}

/**
 * Finds the best matching option from a list of SelectOption objects for a given location name.
 */
export function findBestMatchingOption(options: SelectOption[], targetName: string): SelectOption | null {
  if (!options || options.length === 0 || !targetName) return null

  const targetNorm = normalize(targetName)
  if (!targetNorm) return null

  // 1. Exact match normalized
  const exact = options.find((opt) => normalize(opt.label) === targetNorm)
  if (exact) return exact

  // 2. Option label starts with target or target starts with option label
  const prefix = options.find(
    (opt) => normalize(opt.label).startsWith(targetNorm) || targetNorm.startsWith(normalize(opt.label))
  )
  if (prefix) return prefix

  // 3. Substring match
  const contains = options.find(
    (opt) => normalize(opt.label).includes(targetNorm) || targetNorm.includes(normalize(opt.label))
  )
  if (contains) return contains

  return null
}
