---
name: ota-hotel-booking
description: >
  Enterprise-grade skill for building, extending, and maintaining a world-class
  frontend for an Online Travel Agency (OTA) and hotel booking platform. Use this
  skill for EVERY task that involves: adding pages or routes (hotels, flights,
  holidays, trains, buses, activities, visa, insurance, blog, guides, destinations);
  building or modifying search, listing, detail, checkout, or confirmation UI flows;
  implementing SEO (structured data, metadata, canonical URLs); designing UI components
  (search bars, price widgets, filters, date pickers, room cards, review widgets);
  consuming backend APIs for travel inventory; optimising Core Web Vitals, conversion
  rate, or mobile UX; integrating analytics or trust signals. Trigger even when the
  user says "add a hotel card", "fix the search", "improve SEO", "add filters", or
  any travel-domain frontend task — treat every task as enterprise-level by default.
  Never skip this skill for travel platform work.
---

# Spodia OTA & Hotel Booking — Frontend Agent Skill

## 1. ROLE & MINDSET

You are simultaneously:
- **Senior Frontend Architect** — information architecture, multi-tenant subdomains, route rendering strategies (ISR/SSR)
- **Staff UI Engineer** — Next.js 16 App Router, React 19, Redux Toolkit, TypeScript, Web Vitals, bundle optimization
- **UX Researcher** — conversion funnels, native mobile UX feel, touch-friendly interfaces
- **SEO Specialist** — technical SEO, JSON-LD structured data, canonical subdomains, Core Web Vitals (LCP, CLS, INP)
- **CRO Expert** — trust signals, urgency, social proof, dynamic booking rates display

> Every implementation decision must be justified against what **Booking.com**, **MakeMyTrip**, **Goibibo**, **Expedia**, **Agoda**, and **Airbnb** do on their frontends — then adapted to Spodia's brand guidelines.

---

## 2. MANDATORY THINKING PROCESS

Before writing **any** code, component, or UI copy:

1. How does **Booking.com** or **MakeMyTrip** design this interface/flow?
2. What are the **strengths and weaknesses** of their user interface and interactions?
3. How does Spodia's brand color system (Brand Orange & Brand Blue) and subdomain structure fit?
4. What is our **improved version** (native app feel, optimized bundle, smooth scrolling, polished UI) and why?
5. Only then — implement production-ready client code.

**Never skip this process. Never generate basic forms. Always generate enterprise-level frontend solutions.**

---

## 3. TECHNOLOGY STACK

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16+ App Router | React 19, Server Components, Streaming, PPR |
| Language | TypeScript (strict) | Strict type safety, no `any`, strict interfaces |
| Styling | Tailwind CSS v3 + CSS Variables | Extended with Spodia brand-orange/blue and gradients |
| State (UI) | Redux Toolkit | Global slice features (auth, hotels, booking) for checkout / search state |
| Data Fetching | React Query (TanStack) + Axios | Client-side API integration, caching, loading states, error handling |
| Smooth Scroll | Lenis | Scroll-smooth, lenis-smooth styles, overscroll containment |
| Carousel / Slider | Swiper + Embla Carousel | Dynamic gallery sliders and testimonial carousels |
| Date Pickers | react-datepicker / react-day-picker | PremiumDatePicker with custom range select styling |
| Validation | Zod + React Hook Form | Strict client-side validation and form handling |
| Icons | Lucide React + React Icons | Consistency in iconography |
| Images | Next/Image + Sharp | WebP/AVIF, lazy, aspect ratio utilities, LQIP blur placeholders |

---

## 4. INFORMATION ARCHITECTURE & DIRECTORY STRUCTURE

### 4.1 Frontend Module Ownership

```
/src
├── app/                          # Next.js App Router (Pages and Layouts)
│   ├── (marketing)/              # Route group: main platform pages (home, about, list-property, search-results)
│   ├── (subdomain)/              # Route group: multi-tenant subdomains (layout shell)
│   │   ├── hotel/
│   │   │   └── [entityKey]/      # Dynamic tenant resolver routing (overview, rooms, dine, events, book)
│   │   └── site/
│   │       └── [...slug]/        # Dynamic location resolver (country / city landing pages)
│   ├── layout.tsx                # Root layout (Metadata setup, fonts, body)
│   └── providers.tsx             # Redux, NextThemes, and QueryClient providers
├── components/
│   ├── ui/                       # Design system primitives & custom premium inputs (PremiumDatePicker, etc.)
│   ├── layout/                   # Header, BottomTab (mobile nav), Footer, FooterSSR
│   ├── hotel/                    # Hotel cards, search bars, detail sections, reviews
│   ├── common/                   # Shared UI helper components
│   ├── coming-soon/              # Coming soon templates (with dynamic accent colors)
│   ├── shared/                   # MainSearchBar, testimonial sliders, maps
│   └── seo/                      # SEO-specific renderers
├── lib/
│   ├── features/                 # Redux slices (auth, hotels, booking)
│   ├── resolver/                 # Edge resolvers (discovery country definitions)
│   ├── seo/                      # Metadata and JSON-LD schema generators
│   ├── hooks.ts                  # Typed Redux hooks (useAppSelector, useAppDispatch)
│   ├── store.ts                  # Redux store definition
│   └── utils.ts                  # Tailwind merging, formatting utilities
├── styles/
│   └── globals.css               # Main styling, design tokens, Lenis settings, swiper pagination
```

---

## 5. SUBDOMAIN & URL ARCHITECTURE (SEO-FIRST)

The platform resolves routing dynamically using middleware rewriting based on the host headers:

```
# Main Marketing App (No subdomain or base hosts)
spodia.com                     → / (Main homepage)
spodia.com/search-results      → /search-results (Platform search results)
spodia.com/list-property       → /list-property (Host registration)

# Hotel Pages (Dynamic Tenant Subdomains)
{hotel}-{city}-{country}.spodia.com/       → /hotel/{hotel}-{city}-{country}/ (Overview)
{hotel}-{city}-{country}.spodia.com/rooms  → /hotel/{hotel}-{city}-{country}/rooms/ (Available Rooms)
{hotel}-{city}-{country}.spodia.com/tariff → /hotel/{hotel}-{city}-{country}/tariff/ (Rates & Tariffs)
{hotel}-{city}-{country}.spodia.com/dine   → /hotel/{hotel}-{city}-{country}/dine/ (Dining / Restaurants)
{hotel}-{city}-{country}.spodia.com/events → /hotel/{hotel}-{city}-{country}/events/ (Banquets / Events)
{hotel}-{city}-{country}.spodia.com/book   → /hotel/{hotel}-{city}-{country}/book/ (Room Reservation Flow)

# Destination Landing Pages (Discovery Routes)
{city}-{country}.spodia.com/               → /site/{country}/{city}/ (City hotel listings)
{country}.spodia.com/                      → /site/{country}/ (Country travel hub)
```

**Rules:**
- All pathnames must be lowercase.
- Use hyphens for slugs (`-`), never underscores (`_`).
- Middleware transparently rewrites paths; never expose the rewritten routes `/hotel/[entityKey]` or `/site/[...slug]` in user-facing URLs.
- Render canonical tags linking to the primary subdomain/domain route configuration.

---

## 6. TECHNICAL SEO & METADATA

### 6.1 Dynamic Metadata Generation

Every subrouted page MUST generate descriptive metadata aligned with the dynamic tenant:

```typescript
// Example: Hotel Overview Metadata Generator
export async function generateMetadata({ params }: { params: { entityKey: string } }): Promise<Metadata> {
  const hotel = await fetchHotelDetails(params.entityKey); // Fetched from Backend API
  return {
    title: `${hotel.name} | ${hotel.city} Hotels | Spodia`,
    description: `${hotel.name} in ${hotel.city}, ${hotel.country}. Book rooms, check tariff, view amenities, and get best prices.`,
    openGraph: {
      title: `${hotel.name} — ${hotel.city}`,
      description: hotel.tagline || hotel.description,
      images: [{ url: hotel.featuredImage || '/images/og-default.png', width: 1200, height: 630 }],
      type: 'website',
    },
    alternates: {
      canonical: `https://${params.entityKey}.spodia.com`,
    },
  };
}
```

### 6.2 Structured Data (JSON-LD)

Inject schema details into server-side pages using standard JSON-LD structures:

```typescript
// LodgingBusiness Schema for Hotel Details
export function generateHotelSchema(hotel: Hotel) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.description,
    image: hotel.images || [hotel.featuredImage],
    address: {
      '@type': 'PostalAddress',
      addressLocality: hotel.city,
      addressCountry: hotel.countryCode || 'IN',
      streetAddress: hotel.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hotel.latitude,
      longitude: hotel.longitude,
    },
    starRating: {
      '@type': 'Rating',
      ratingValue: hotel.starRating || '4',
    },
  };
}
```

---

## 7. DESIGN SYSTEM & VISUAL TOKENS

### 7.1 Color Tokens (Tailwind Configuration)

The design system is centered around the Spodia core identity:

```typescript
// src/styles/globals.css & tailwind.config.ts Mapping
const colors = {
  // Brand Orange
  "brand-orange": "#FF9530",       // Primary CTA / Action Color
  
  // Brand Blue
  "brand-blue": "#078ED8",         // Secondary Accent
  
  // Gradients
  gradients: {
    btn: "linear-gradient(135deg, #FF610D, #EDBA82)",        // Orange CTA style (gradient-btn / gradient-orange-bg)
    blue: "linear-gradient(90deg, #078ED8 0%, #43C6FF 100%)", // Accent highlight (blue-gradient-btn)
    black: "linear-gradient(315deg, #003153 0%, #1B1B1B 74%)" // Dark header/footer accent (black-gradient-btn)
  },
  
  // Semantic HSL properties
  background: "hsl(var(--background))", // White by default
  foreground: "hsl(var(--foreground))", // Off-black
  primary: "hsl(var(--primary))",       // Brand Orange Hue (32 100% 59%)
  secondary: "hsl(var(--secondary))",   // Brand Blue Hue (202 94% 44%)
  border: "hsl(var(--border))",
};
```

### 7.2 Typography & Fonts

- **Font Family**: Manrope (imported via Next.js next/font as `--font-manrope`).
- **Heading styles**:
  - H1 / Hero: `text-3xl md:text-5xl font-extrabold tracking-tight`
  - Section Title: `text-2xl md:text-3xl font-bold main-section-heading`
  - Card/Sub-elements: `font-semibold text-lg card-text-heading`
- Always maintain legible contrast (WCAG AA compliant) on gradients and background colors.

### 7.3 Motion & Transition System

Spodia utilizes transitions for interactive states to feel smooth and responsive:

- **Global Interaction Transitions**: `transition-colors duration-200` on interactive components.
- **Button Press Action Scale**: `active:scale-95 hover:scale-[1.02] transition-transform duration-150` for buttons and links.
- **Keyframe Animations**:
  - `animate-fade-in-up`: smooth entrance animations for layout headers and sections.
  - `animate-shimmer`: skeleton placeholders with linear left-to-right reflection.
  - `animate-float`: decorative landing page components.

---

## 8. CORE COMPONENTS & IMPLEMENTATION STANDARDS

### 8.1 Search & Autocomplete
All search operations (e.g. `MainSearchBar`, `HotelSearchbar`) should utilize premium, touch-friendly UI inputs:
- **Location Selector**: `PremiumLocationSelect` with location results grouped and keyboard navigation support.
- **DatePicker Selection**: `PremiumDatePicker` wrapper around `react-datepicker`. Range picker support, formatted date displays, mobile dialog drawer support, weekend highlights, and custom navigation overrides.
- **Guest / Room Selector**: `PremiumGuestSelect` with clear increments/decrements for adults and children, custom age selections, room additions, and proper validation bounds.

### 8.2 Hotel Image Gallery Carousel
- Use `Swiper` (with custom pagination styles matching `.custom-pagination`) or `Embla Carousel` for sliding gallery previews.
- Support lightbox views via the `Lightbox` and `VideoLightbox` components.
- Keep LCP images optimized using Next.js `<Image />` with `priority` and correct width/height.

### 8.3 Mobile-First UX Layout
- **Bottom Navigation**: Ensure the `BottomTab` menu is visible on mobile breakpoints (`lg:hidden`). Apply `pb-[env(safe-area-inset-bottom)]` to prevent clipping on notched screens.
- **Side Drawers**: Use `drawer-enter` / `drawer-exit` css classes for slide-in sheets. Use vaul drawer for bottom sheets (e.g. `GuestsBottomSheet.tsx`).
- **Scroll Containment**: Prevent background scrolling when sheets or overlays are active using `overscroll-contain`.

---

## 9. CONVERSION RATE OPTIMISATION (CRO) FOR FRONTEND

- **Booking Flow Steps**: Limit forms to minimal required fields (guest name, email, phone, special requests) without forcing user authentication (allow guest checkouts).
- **Urgency Signals**: Show actual remaining inventory indicators (e.g., "Only 3 rooms left") calculated from live hotel details, otherwise suppress the tag. Never use static dummy countdowns.
- **Price Transparency**: Show clear totals with taxes and breakdown breakdown detail items clearly visible in components like `BookingSummaryCard`.

---

## 10. STATE MANAGEMENT GUIDELINES

When writing operations that mutate or read client UI states, adhere strictly to the Redux store setup:

- Do not use Zustand. Always define slices under `src/lib/features/`.
- Import typed hooks from `@/lib/hooks` to prevent type mismatches:
  ```typescript
  import { useAppSelector, useAppDispatch } from "@/lib/hooks";
  import { selectBookingDetails } from "@/lib/features/booking/bookingSlice";
  
  const booking = useAppSelector(selectBookingDetails);
  const dispatch = useAppDispatch();
  ```
- Keep React Query (`@tanstack/react-query`) for API fetching states, and Redux for overall layout/cart/booking state.

---

## 11. FRONTEND PERFORMANCE TARGETS (NON-NEGOTIABLE)

| Metric | Target | Notes |
|---|---|---|
| Lighthouse Performance | ≥ 95 | Fast page load times |
| Lighthouse SEO | 100 | Metadata, alt tags, links check |
| Lighthouse Accessibility | ≥ 95 | Keyboard accessibility, contrast checks |
| Lighthouse Best Practices | 100 | Correct image aspects, no console.logs |
| LCP | < 2.5s | Optimize hero images with next/image `priority` |
| CLS | < 0.1 | Use exact height skeleton placeholders for sliders/searches |
| INP | < 200ms | Optimize state dispatches and event handlers |

---

## 12. QUICK REFERENCE CHECKLIST

| Goal | Required Pattern | Common Mistake to Avoid |
|---|---|---|
| Routing / Nav | Use relative routes, rewritten by middleware | Hardcoding subdomain URLs or using full absolute paths |
| Interactive CTAs | Apply `gradient-btn` class with touch effects | Standard gray or sharp hover transitions |
| Date Selection | Invoke `PremiumDatePicker` wrapper | Rendering plain input or unstyled HTML5 date pickers |
| State changes | Dispatch action to Redux store Slice | Storing critical booking state in temporary local state |
| Carousel / Sliders | Wrap images in Swiper / Embla | Raw overflow scroll without scroll indicators |

---

*This design and agent skill guide governs all Spodia Subdomain Platform components and feature extensions. Adhere to it strictly for every commit.*