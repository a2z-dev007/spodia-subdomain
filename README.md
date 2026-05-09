# Spodia - Hotel Booking Platform

A multi-tenant Next.js 16 hotel booking platform that serves both marketing pages and tenant-specific hotel pages through subdomain-based routing.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS (globals.css, globals-map.css)
- **State Management**: Redux Toolkit + React Query
- **UI Components**: Radix UI + custom components
- **Animations**: Framer Motion, Swiper, Lottie
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Date Handling**: date-fns, react-datepicker, react-day-picker

## Architecture Overview

### Route Groups

The app uses Next.js route groups `(marketing)` and `(subdomain)` to organize routes:

```
src/app/
├── (marketing)/           # Public marketing site
│   └── page.tsx          # Home page (/)
├── (subdomain)/           # Multi-tenant pages
│   ├── layout.tsx         # Shared tenant shell
│   ├── hotel/[entityKey]/ # Individual hotel pages
│   │   ├── page.tsx       # Hotel overview
│   │   ├── about/
│   │   ├── book/
│   │   ├── contact/
│   │   ├── dine/
│   │   ├── events/
│   │   ├── explore/
│   │   ├── gallery/
│   │   ├── rooms/
│   │   ├── services/
│   │   └── tariff/
│   └── site/[...slug]/    # Location landing pages
│       ├── page.tsx
│       ├── CountryLandingPage.tsx
│       └── GenericLandingPage.tsx
├── hotel/[slug]/          # Legacy/placeholder
└── layout.tsx            # Root layout
```

## Routing System

### Middleware-Based Routing

The routing is controlled by `middleware.ts` at the project root. It analyzes the request hostname and rewrites URLs internally:

#### 1. Main Marketing Host
- `localhost`, `127.0.0.1`
- `spodia.com`, `www.spodia.com`
- `*.netlify.app`, `*.vercel.app`
- Custom hosts via `MAIN_SITE_HOSTNAMES` env var

**Behavior**: Serves marketing site at `/`

#### 2. Discovery Routes (Country-based)
Format: `{location}.{country}.spodia.com` (e.g., `mumbai.india.spodia.com`)

**Behavior**: Rewrites to `/site/{country}/{state}/{city}/...`

Uses `isDiscoveryCountrySegment()` in `src/lib/resolver/discoveryCountry.ts` to identify valid country codes (ISO 3166-1 alpha-2 or custom slugs via `SPODIA_DISCOVERY_COUNTRY_SLUGS`).

#### 3. Hotel Tenant Routes
Format: `{slug}.spodia.com` (e.g., `taj.hotel.spodia.com`)

**Behavior**: Rewrites to `/hotel/{slug}{pathname}`

### URL Rewriting Examples

| Request URL | Rewritten To |
|------------|--------------|
| `https://spodia.com/` | `/` (marketing) |
| `https://mumbai.india.spodia.com/` | `/site/in/maharashtra/mumbai` |
| `https://taj.hotel.spodia.com/` | `/hotel/taj-hotel` |
| `https://mumbai.india.spodia.com/hotels` | `/site/in/maharashtra/mumbai/hotels` |

### Header Injection

The middleware injects custom headers for tenant-aware backend requests:
- `x-subdomain`: The extracted subdomain/key
- `x-spodia-tenant-host`: The original public hostname

## Key Files

### Configuration
- `middleware.ts` - URL rewriting and tenant detection
- `src/lib/resolver/discoveryCountry.ts` - Country code validation
- `src/utils/const.ts` - All LINKS constants for navigation

### API Layer
- `src/lib/api/apiClient.ts` - Axios client with interceptors
- `src/services/api.ts` - API service functions
- `src/lib/auth/tokenRefresh.ts` - Token refresh logic

### Location Services
- `src/lib/locationUtils.ts` - Location ID resolution from slugs
- `src/services/countryService.ts` - Country data fetching
- `src/services/entityService.ts` - Entity landing data

### UI Components
- `src/components/layout/` - Header, Footer, BottomTab, ConditionalShell
- `src/components/home/` - Home page sections
- `src/components/hotels/` - Hotel-related components
- `src/components/ui/` - Reusable UI components (Radix-based)

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=        # API base URL
NEXT_PUBLIC_SITE_URL=            # Public site URL for OG images
MAIN_SITE_HOSTNAMES=             # Comma-separated additional marketing hosts
SPODIA_DISCOVERY_COUNTRY_SLUGS=  # Extra country codes (comma-separated)
```

## Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/       # Marketing route group
│   ├── (subdomain)/       # Tenant route group
│   └── providers.tsx      # Context providers
├── assets/                 # Static assets (images)
├── components/            # React components
│   ├── home/             # Home page components
│   ├── layout/           # Layout components
│   ├── hotels/           # Hotel components
│   ├── ui/               # UI primitives
│   └── Footer/           # Footer components
├── data/                  # Static data (types, taxonomies)
├── hooks/                 # Custom React hooks
├── lib/                   # Core library code
│   ├── api/              # API client
│   ├── auth/             # Authentication
│   ├── features/         # Redux slices
│   ├── hooks/            # Redux hooks
│   └── resolver/         # Resolution utilities
├── services/             # Business logic services
├── shared/               # Shared/common components
└── utils/                # Utility functions
    └── const.ts          # Link constants
```

## Development Notes

### Tenant Detection
Use `x-subdomain` header in API requests to identify the current tenant. The header is automatically injected by middleware when rewriting URLs.

### API Integration
All API calls go through `src/lib/api/apiClient.ts` which handles:
- Token injection from localStorage
- Error handling
- Response parsing

### Adding New Hotel Pages
1. Create the page component in `src/app/(subdomain)/hotel/[entityKey]/`
2. The `[entityKey]` parameter receives the hotel slug from middleware rewrite
3. Use tenant-aware API calls with the injected subdomain header

### Adding Discovery Pages
1. Add routes in `src/app/(subdomain)/site/[...slug]/`
2. Handle URL depth: 1=country, 2=state, 3=city, 4=location
3. Use `resolveLocationIds()` to map slugs to location IDs

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)


Routing Analysis for Testing
Page Name	URL Pattern (Local Dev)	Slug Depth	Purpose for Creation
Main Platform Home	http://localhost:3000/	-	Primary search and discovery hub.
Country Page	http://localhost:3000/site/in	1	National discovery (Already implemented).
State Page	http://localhost:3000/site/in/maharashtra	2	Regional exploration (To be created).
City Page	http://localhost:3000/site/in/maharashtra/mumbai	3	High-intent conversion (To be created).
Location Page	http://localhost:3000/site/in/maharashtra/mumbai/colaba	4	Hyper-local booking focus (To be created).
Hotel Details	http://localhost:3000/hotel/[hotel-slug]	-	Final conversion and booking page.