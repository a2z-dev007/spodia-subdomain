// lib/getApiData.ts
import { cache } from "react";

interface UseApiDataResult<T> {
    data: T[];
    error: string | null;
}

const globalCache = new Map<string, { data: any; expiry: number }>();

export const getApiData = cache(
    async function <T = any>(
        apiUrl: string,
        mapFn: (item: any) => T,
        revalidate: number = 60
    ): Promise<UseApiDataResult<T>> {
        try {
            const now = Date.now();

            // ✅ Serve from cache if valid
            const cached = globalCache.get(apiUrl);
            if (cached && cached.expiry > now) {
                return { data: cached.data, error: null };
            }

            // ✅ Fetch with ISR (Next.js will cache this under the hood)
            const res = await fetch(apiUrl, {
                next: { revalidate },
                cache: "force-cache",
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            const records = data.records || data.results || [];

            const mapped = records.map(mapFn);

            // ✅ Save into global runtime cache
            globalCache.set(apiUrl, {
                data: mapped,
                expiry: now + revalidate * 1000,
            });

            return { data: mapped, error: null };
        } catch (err: unknown) {
            return {
                data: [],
                error: err instanceof Error ? err.message : "Failed to load data.",
            };
        }
    }
);
