Below is a **production-grade PRD + system architecture** for your **Spodia Hotel Subdomain Platform (Next.js Frontend)** based on your PDFs and requirements.

---

# 🧾 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Product: Spodia Subdomain Hotel Platform

## Type: Multi-tenant, SEO-first, subdomain-driven hotel websites

## Scope: **Frontend (Next.js)** only

---

## 1. 🎯 Product Vision

Create a **globally scalable subdomain-based hotel website system** where:

* Each hotel behaves like a **standalone premium website**
* Fully **SEO optimized (indexable individually)**
* Ultra-fast (**Core Web Vitals optimized**)
* Works alongside main platform (`spodia.com`)
* Supports **millions of listings globally**

---

## 2. 🌍 URL & ROUTING STRATEGY

Based on your document:

```
{entity}-{city}-{country}.spodia.com
```

Examples:

* Hotel:
  `hotel-nandan-guwahati-in.spodia.com`
* City:
  `guwahati-in.spodia.com`
* Country:
  `in.spodia.com`

---

## 3. 🧠 FRONTEND RESPONSIBILITY

Next.js app will:

* Detect subdomain
* Resolve entity (hotel / city / state / country)
* Load correct UI structure dynamically
* Render SEO pages (SSR/SSG/ISR)

---

## 4. 🏗️ HIGH-LEVEL ARCHITECTURE

```
                 ┌────────────────────────┐
                 │   Wildcard DNS (*.spodia.com)
                 └────────────┬───────────┘
                              │
                 ┌────────────▼────────────┐
                 │  Edge Middleware (Next) │
                 │  - Parse subdomain      │
                 │  - Attach headers      │
                 └────────────┬────────────┘
                              │
                 ┌────────────▼────────────┐
                 │   Next.js App Router    │
                 │  (Multi-tenant logic)   │
                 └────────────┬────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼
Hotel Resolver        Location Resolver       Global Resolver
       │                      │                      │
       └──────────────┬───────┴──────────────┬───────┘
                      ▼                      ▼
              Data Fetch Layer (API)
                      │
                      ▼
             Backend (Existing APIs)
```

---

## 5. 🔥 CORE FEATURES

### A. Multi-Entity Rendering

| Entity Type | Behavior                |
| ----------- | ----------------------- |
| Hotel       | Full standalone website |
| City        | Listing + filters       |
| State       | Aggregation             |
| Country     | Global discovery        |

---

### B. Hotel Website Structure (From PDF)

Menus:

* Home (8 sections)
* Overview
* About
* Rooms
* Tariff
* Services
* Dine
* Events
* Gallery
* Explore
* Contact
* Book Online

👉 Each page:

* SSR/ISR
* SEO optimized
* Dynamic content

---

## 6. ⚙️ NEXT.JS ARCHITECTURE (APP ROUTER)

### Folder Structure (Production-grade)

```
src/
│
├── app/
│   ├── (marketing)/                 # Non-subdomain pages (spodia.com)
│   │   └── page.tsx
│   │
│   ├── (subdomain)/                 # ALL subdomain rendering
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Resolver entry
│   │   │
│   │   ├── hotel/
│   │   │   ├── page.tsx            # Home
│   │   │   ├── overview/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── rooms/page.tsx
│   │   │   ├── tariff/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── dine/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── gallery/page.tsx
│   │   │   ├── explore/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── book/page.tsx
│   │   │
│   │   ├── city/
│   │   ├── state/
│   │   └── country/
│   │
│   ├── api/                        # Edge/API routes if needed
│
├── components/
│   ├── common/
│   ├── hotel/
│   │   ├── sections/
│   │   │   ├── BookingEngine.tsx
│   │   │   ├── HotelDescription.tsx
│   │   │   ├── RatesCalendar.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── Reviews.tsx
│   │   │   ├── Map.tsx
│   │   │   ├── NearbyPlaces.tsx
│   │   │   └── DiningSpaEvents.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│
├── lib/
│   ├── resolver/
│   │   ├── parseSubdomain.ts
│   │   ├── resolveEntity.ts
│   │
│   ├── api/
│   │   ├── hotel.ts
│   │   ├── location.ts
│   │
│   ├── seo/
│   │   ├── metadata.ts
│   │   ├── schema.ts
│   │
│   ├── cache/
│   │   ├── revalidate.ts
│
├── hooks/
├── store/ (Zustand or Redux)
├── styles/
└── types/
```

---

## 7. 🧩 SUBDOMAIN RESOLUTION FLOW

### Middleware (CRITICAL)

```ts
// middleware.ts
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  
  const subdomain = host.split(".")[0];

  req.headers.set("x-subdomain", subdomain);

  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}
```

---

### Resolver Logic

```ts
// parseSubdomain.ts
export function parseSubdomain(subdomain: string) {
  const parts = subdomain.split("-");
  
  return {
    slug: parts.slice(0, -2).join("-"),
    city: parts.at(-2),
    country: parts.at(-1),
  };
}
```

---

### Entity Resolution

```ts
// resolveEntity.ts
export async function resolveEntity(data) {
  // Call backend
  // Return type: hotel | city | state | country
}
```

---

## 8. ⚡ DATA FETCHING STRATEGY

### Use Hybrid Approach

| Type                | Strategy                  |
| ------------------- | ------------------------- |
| Hotel pages         | ISR (revalidate 60s–5min) |
| Tariff/availability | SSR                       |
| Images              | CDN                       |
| Reviews             | SWR (client-side)         |

---

## 9. 🚀 PERFORMANCE STRATEGY

### Must Have:

* App Router + Server Components
* Streaming SSR
* Image Optimization (`next/image`)
* Font optimization (`next/font`)
* Partial hydration
* Edge middleware

---

### Caching Layers

```
CDN (Vercel Edge)
     ↓
ISR Cache
     ↓
API Cache
     ↓
Backend
```

---

## 10. 🔍 SEO STRATEGY (CRITICAL)

### A. Metadata

Dynamic per subdomain:

```ts
export async function generateMetadata() {
  return {
    title: `${hotel.name} | Book Now`,
    description: hotel.description,
  };
}
```

---

### B. Canonical URLs

Avoid duplication:

```
<link rel="canonical" href="https://hotel-xyz-delhi-in.spodia.com" />
```

---

### C. Schema Markup

* Hotel schema
* Review schema
* FAQ schema (IMPORTANT from doc)

---

### D. Sitemap Strategy

* Per subdomain sitemap
* Global sitemap index

---

## 11. 📦 COMPONENT ARCHITECTURE

### Example: Home Page

```
<HomePage>
 ├── BookingEngine
 ├── HotelDescription
 ├── RatesCalendar
 ├── ImageGallery
 ├── Reviews
 ├── Map
 ├── NearbyPlaces
 └── DiningSpaEvents
```

---

## 12. 📱 RESPONSIVENESS

* Mobile-first
* Lighthouse score target: **90+**
* Breakpoints:

  * Mobile: <768px
  * Tablet: 768–1024px
  * Desktop: 1024+

---

## 13. 🔐 SECURITY

* Subdomain validation (prevent spoofing)
* Rate limiting (API)
* Sanitization (SEO content)

---

## 14. 📊 SCALABILITY STRATEGY

Designed for:

* Millions of subdomains
* Horizontal scaling via:

  * Vercel Edge
  * CDN caching
  * ISR

---

## 15. ⚠️ EDGE CASES

| Case              | Solution           |
| ----------------- | ------------------ |
| Invalid subdomain | Redirect to global |
| Duplicate slugs   | Add suffix         |
| Missing data      | Fallback UI        |

---

## 16. 🧪 TESTING STRATEGY

* Unit: resolver logic
* Integration: API + UI
* E2E: subdomain routing
* SEO testing: Lighthouse + GSC

---



## 17. 🔥 FINAL FLOW (USER JOURNEY)

```
User visits:
hotel-nandan-guwahati-in.spodia.com

↓ Middleware parses subdomain

↓ Resolver fetches hotel data

↓ Next.js renders:
- Home page
- All menus dynamically

↓ User clicks "Rooms"

↓ Navigates inside same subdomain

↓ Clicks "Book Now"

↓ Booking engine triggered
```

---

## 18. 💡 KEY DESIGN DECISIONS

* **Single Next.js app → Multi-tenant system**
* **Subdomain-driven rendering**
* **ISR-first architecture**
* **SEO-first structure**
* **Component modularity for reuse**

---

## 19. 🚀 WHAT MAKES THIS SYSTEM STRONG

* Fully **global-ready**
* **Zero duplication conflicts**
* Each hotel = **independent SEO website**
* Extremely **fast (edge optimized)**
* Clean **developer experience**

Make sure you follow the current theme, colors, fonts, etc. 
all the pages should be responsive and should be SEO optimized.

For the home page Header and footer already added. Use the same in all the pages as of now. Later for the hotel pages , we will add the hotel specific header and footer for the hotel pages.