import type { Metadata } from "next";
import { headers } from "next/headers";

function titleCaseFromKey(key: string) {
  return key
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function getRequestHost(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-host");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.replace(/:\d+$/, "").toLowerCase();
  }
  const host = h.get("host");
  return host ? host.replace(/:\d+$/, "").toLowerCase() : "spodia.com";
}

export async function buildHotelSegmentMetadata(opts: {
  entityKey: string;
  segment: string;
  description?: string;
}): Promise<Metadata> {
  const host = await getRequestHost();
  const display = titleCaseFromKey(opts.entityKey);
  const segmentLabel =
    opts.segment === "home"
      ? "Book your stay"
      : opts.segment.charAt(0).toUpperCase() + opts.segment.slice(1);

  const pathname =
    opts.segment === "home" ? `/hotel/${opts.entityKey}` : `/hotel/${opts.entityKey}/${opts.segment}`;

  const protocol = host.includes("localhost") ? "http" : "https";
  const canonical = `${protocol}://${host}${pathname}`;

  return {
    title: `${display} | ${segmentLabel} | Spodia`,
    description:
      opts.description ??
      `${display} — ${segmentLabel}. Book directly on Spodia with instant confirmation.`,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${display} | ${segmentLabel}`,
      url: canonical,
      siteName: "Spodia",
      type: "website",
    },
  };
}

export async function buildLocationListingMetadata(opts: {
  title: string;
  description?: string;
  pathname: string;
}): Promise<Metadata> {
  const host = await getRequestHost();
  const protocol = host.includes("localhost") ? "http" : "https";
  const canonical = `${protocol}://${host}${opts.pathname}`;

  return {
    title: opts.title,
    description: opts.description ?? opts.title,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: opts.title,
      url: canonical,
      siteName: "Spodia",
      type: "website",
    },
  };
}
