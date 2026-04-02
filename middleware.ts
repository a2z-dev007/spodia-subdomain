import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Public hostname for this request (Netlify/proxies may set x-forwarded-host).
 * Strips trailing :port so `*.netlify.app:443` still matches `.netlify.app`.
 */
function getPublicHost(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-host");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return stripPort(first.toLowerCase());
  }
  const host = req.headers.get("host") || "";
  return stripPort(host.trim().toLowerCase());
}

function stripPort(host: string): string {
  if (!host) return host;
  if (host.startsWith("[")) return host;
  return host.replace(/:\d+$/, "");
}

/**
 * Hosts that serve the marketing app at `/` (no subdomain → /hotel/* rewrite).
 * https://spodia-subdomain.netlify.app/ must hit `/`, not `/hotel/spodia-subdomain-netlify-app`.
 */
function isMainMarketingHost(host: string): boolean {
  if (!host) return true;

  const hostNoPort = stripPort(host);

  if (hostNoPort === "localhost" || hostNoPort === "127.0.0.1") return true;

  if (hostNoPort === "spodia.com" || hostNoPort === "www.spodia.com") return true;

  if (hostNoPort.endsWith(".netlify.app")) return true;
  if (hostNoPort.endsWith(".vercel.app")) return true;

  const extras = process.env.MAIN_SITE_HOSTNAMES?.split(",")
    .map((s) => stripPort(s.trim().toLowerCase()))
    .filter(Boolean);
  if (extras?.length && extras.includes(hostNoPort)) return true;

  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = getPublicHost(req);

  if (isMainMarketingHost(hostname)) {
    return NextResponse.next();
  }

  let currentHost = hostname;
  if (hostname.includes("localhost")) {
    currentHost = hostname.replace(/\.localhost(:\d+)?$/i, "");
  } else {
    currentHost = hostname.replace(/\.spodia\.com$/i, "");
  }

  const parts = currentHost.split(".");

  const countryCodes = ["in"];
  const isDiscoveryRoute = countryCodes.includes(parts[parts.length - 1]);

  if (isDiscoveryRoute) {
    const pathParts = [...parts].reverse();
    const newPath = `/site/${pathParts.join("/")}${url.pathname}`;
    return NextResponse.rewrite(new URL(newPath, req.url));
  }

  const hotelSlug = parts.join("-");
  const newPath = `/hotel/${hotelSlug}${url.pathname}`;
  return NextResponse.rewrite(new URL(newPath, req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
