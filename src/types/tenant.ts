export type TenantEntityType = "hotel" | "city" | "state" | "country";

export type ParsedSubdomain = {
  /** Property slug segment (everything before city–country pair when using hotel pattern). */
  slug: string;
  city: string | undefined;
  country: string | undefined;
  raw: string;
};

export type ResolvedEntity = {
  type: TenantEntityType;
  parsed?: ParsedSubdomain;
  locationSlug?: string[];
};
