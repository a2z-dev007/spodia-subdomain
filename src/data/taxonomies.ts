import { TaxonomyType } from "./types";
import { propertyTypes } from "./const";

export const DEMO_STAY_CATEGORIES: TaxonomyType[] = propertyTypes.map((type) => ({
    id: type.id,
    name: type.name,
    href: `/listing/${type.id}`,
    count: 0,
    taxonomy: "category" as const,
    listingType: "stay" as const,
}));