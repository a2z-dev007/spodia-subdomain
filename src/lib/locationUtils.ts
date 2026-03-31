import { getCountries, getStates, getCities } from "@/services/api";
import { Country, State, City } from "@/lib/types/location";

// Helper to normalize strings for comparison (kebab-case from url vs Name)
const normalize = (str: string) => str.toLowerCase().replace(/-/g, " ");

export async function resolveLocationIds(slug: string[]) {
    // slug: ['in', 'maharashtra', 'mumbai']
    // 1. Country
    // default to India (id=101?) if 'in'.
    // We need to fetch countries to be sure.

    let countryId: number | undefined;
    let stateId: number | undefined;
    let cityId: number | undefined;

    try {
        const countriesRes = await getCountries();
        // Inspect response structure. Assuming .data is array or .data.data
        const countries: Country[] = countriesRes.data?.data || countriesRes.data || [];

        const countrySlug = slug[0];
        // Match by shortname or name
        const country = countries.find(c =>
            c.shortname?.toLowerCase() === countrySlug.toLowerCase() ||
            normalize(c.name) === normalize(countrySlug)
        );

        if (country) countryId = country.id;

        if (countryId && slug.length > 1) {
            const stateSlug = slug[1];
            const statesRes = await getStates(countryId);
            const states: State[] = statesRes.data?.data || statesRes.data || [];

            const state = states.find(s => normalize(s.name) === normalize(stateSlug));
            if (state) stateId = state.id;

            if (stateId && slug.length > 2) {
                const citySlug = slug[2];
                const citiesRes = await getCities(stateId);
                const cities: City[] = citiesRes.data?.data || citiesRes.data || [];

                const city = cities.find(c => normalize(c.name) === normalize(citySlug));
                if (city) cityId = city.id;
            }
        }

    } catch (error) {
        console.error("Error resolving location IDs:", error);
    }

    return { countryId, stateId, cityId };
}
