import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get('host') || ''

  // Define allowed domains (localhost for dev, spodia.com for prod)
  const allowedDomains = ['localhost:3000', 'spodia.com']

  // Check if the current hostname is one of the main domains (no subdomain)
  const isMainDomain = allowedDomains.some(domain => hostname === domain || hostname === `www.${domain}`)

  // If it's a main domain, generic handling (maybe landing page)
  if (isMainDomain) {
    return NextResponse.next()
  }

  // Extract subdomain
  // logic: remove the root domain part
  let currentHost = hostname
  if (hostname.includes('localhost')) {
    currentHost = hostname.replace('.localhost:3000', '')
  } else {
    currentHost = hostname.replace('.spodia.com', '')
  }

  // PRD Structure:
  // in.spodia.com -> Country
  // maharashtra.in.spodia.com -> State
  // mumbai.maharashtra.in.spodia.com -> City
  // colaba.mumbai.maharashtra.in.spodia.com -> Location
  // hotel-name.spodia.com -> Hotel Website

  const parts = currentHost.split('.')

  // Logic to distinguish Hotel Site vs Location Discovery
  // If the last part is a country code (e.g., 'in'), it's a Discovery route.
  // We'll assume 'in' is the country code for now as per PRD.
  // We can expand this list or make it dynamic later.
  const countryCodes = ['in']
  const isDiscoveryRoute = countryCodes.includes(parts[parts.length - 1])

  if (isDiscoveryRoute) {
    // Discovery Route
    // parts: ['mumbai', 'maharashtra', 'in']
    // We want to map to: /site/in/maharashtra/mumbai
    // Reverse the parts -> ['in', 'maharashtra', 'mumbai']
    const pathParts = [...parts].reverse()
    const newPath = `/site/${pathParts.join('/')}${url.pathname}`

    return NextResponse.rewrite(new URL(newPath, req.url))
  } else {
    // Hotel Website Route (Single part typically or doesn't end in country code)
    // e.g. 'hotel-name'
    // Rewrite to /hotel/hotel-name
    // If there are multiple parts but not ending in country, treating as hotel for now (or error)
    // e.g. maybe 'grand.hotel-name'? treat entire string as slug or just last? 
    // Usually hotel subdomains are single level: hotel-name.spodia.com.

    const hotelSlug = parts.join('-') // or just currentHost
    const newPath = `/hotel/${hotelSlug}${url.pathname}`

    return NextResponse.rewrite(new URL(newPath, req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}