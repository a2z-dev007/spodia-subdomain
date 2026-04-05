/**
 * Use with `fetch(..., { next: { revalidate } })` or future segment config.
 * Hotel App Router pages use request-aware metadata (`headers()`), so they stay dynamic;
 * apply these values at the data layer when you add cached API calls.
 */
export const REVALIDATE_HOTEL_SHELL = 300;
export const REVALIDATE_HOTEL_STATIC = 120;
