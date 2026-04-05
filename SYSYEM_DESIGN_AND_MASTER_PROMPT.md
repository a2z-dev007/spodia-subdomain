# 🏗️ Spodia Subdomain Platform - System Design & Master Prompt

## 📋 Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Design System & UI/UX Guidelines](#design-system--uiux-guidelines)
3. [Component Architecture](#component-architecture)
4. [Master Prompt for Page Generation](#master-prompt-for-page-generation)
5. [Best Practices Checklist](#best-practices-checklist)

---

## 🎯 System Architecture Overview

### 1. **Multi-Tenant Subdomain Architecture**

```
┌─────────────────────────────────────────────────────────┐
│              Wildcard DNS (*.spodia.com)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│          Edge Middleware (Next.js)                      │
│  • Parse subdomain (hotel-city-country)                 │
│  • Attach headers (x-subdomain, x-entity-type)          │
│  • Validate and route                                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Next.js App Router (Multi-tenant)               │
│  • (subdomain)/layout.tsx - Shared shell                │
│  • hotel/[slug] - Hotel-specific pages                  │
│  • site/[...slug] - Dynamic entity resolution           │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼────┐ ┌────▼────┐ ┌────▼────┐
│   Hotel    │ │  City   │ │ Country │
│  Resolver  │ │Resolver │ │Resolver │
└───────┬────┘ └────┬────┘ └────┬────┘
        │            │            │
        └────────────┼────────────┘
                     │
        ┌────────────▼────────────┐
        │   Data Fetching Layer   │
        │  • Server Components    │
        │  • ISR (revalidate 60s) │
        │  • SSR (dynamic)        │
        │  • SWR (client cache)   │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │   Backend API (REST)    │
        └─────────────────────────┘
```

### 2. **URL Structure Strategy**

```typescript
// Pattern: {entity}-{city}-{country}.spodia.com
Examples:
- hotel-nandan-guwahati-in.spodia.com
- guwahati-in.spodia.com
- in.spodia.com

// Route Groups:
src/app/
├── (marketing)/          # Main platform pages
│   └── about-us, contact
├── (subdomain)/          # Multi-tenant shell
│   ├── hotel/[slug]/     # Hotel pages
│   │   ├── page.tsx      # Home
│   │   ├── rooms/
│   │   ├── tariff/
│   │   ├── gallery/
│   │   └── contact/
│   └── site/[...slug]/   # Dynamic resolver
└── api/                  # API routes
```

### 3. **Data Flow Architecture**

```typescript
// Server Component Pattern (Recommended)
async function HotelPage({ params }: { params: { slug: string } }) {
  // 1. Fetch data on server
  const hotel = await fetchHotelBySlug(params.slug);
  
  // 2. Generate SEO metadata
  const metadata = generateHotelMetadata(hotel);
  
  // 3. Render with pre-fetched data
  return <HotelTemplate hotel={hotel} />;
}

// Client Component Pattern (For interactions)
"use client";
export function HotelBookingWidget({ hotelId }: { hotelId: string }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Client-side fetching for dynamic data
    fetchAvailability(hotelId).then(setData);
  }, [hotelId]);
  
  return <div>{/* Render booking widget */}</div>;
}
```

---

## 🎨 Design System & UI/UX Guidelines

### 1. **Color Palette**

```typescript
// Primary Brand Colors
const colors = {
  // Brand Orange (Primary CTA)
  primary: {
    DEFAULT: "#FF9530",  // hsl(32, 100%, 59%)
    hover: "#e8851c",
    light: "#FFF7ED",
  },
  
  // Brand Blue (Secondary)
  secondary: {
    DEFAULT: "#078ED8",  // hsl(202, 94%, 44%)
    light: "#43C6FF",
  },
  
  // Gradients
  gradients: {
    btn: "linear-gradient(90deg, #FF9530 0%, #FFB347 100%)",
    blue: "linear-gradient(90deg, #078ED8 0%, #43C6FF 100%)",
    black: "linear-gradient(90deg, #232526 0%, #000000 100%)",
  },
  
  // Semantic Colors (shadcn/ui)
  background: "hsl(0, 0%, 100%)",
  foreground: "hsl(222.2, 84%, 4.9%)",
  card: "hsl(0, 0%, 100%)",
  border: "hsl(214.3, 31.8%, 91.4%)",
};
```

### 2. **Typography System**

```typescript
// Font Family
fontFamily: {
  sans: ["var(--font-manrope)", "sans-serif"],
}

// Typography Scale (Mobile-First)
const typography = {
  // Hero Section
  hero: {
    mobile: "text-3xl leading-snug font-extrabold",
    tablet: "text-4xl leading-tight font-extrabold",
    desktop: "text-5xl leading-tight font-extrabold",
  },
  
  // Section Headings
  heading: {
    mobile: "text-2xl font-bold",
    desktop: "text-3xl font-bold",
  },
  
  // Body Text
  body: {
    small: "text-sm leading-relaxed",
    base: "text-base leading-relaxed",
    large: "text-lg leading-relaxed",
  },
};
```

### 3. **Spacing & Layout**

```typescript
// Container Max Widths
const containers = {
  sm: "max-w-6xl",
  md: "max-w-7xl",
  lg: "max-w-[1920px]",
  full: "w-full",
};

// Responsive Breakpoints
const breakpoints = {
  mobile: "0px - 767px",
  tablet: "768px - 1023px",
  desktop: "1024px+",
};

// Standard Padding/Margin Scale
const spacing = {
  section: "py-12 md:py-16 lg:py-24",
  container: "px-4 md:px-6 lg:px-8",
  component: "gap-4 md:gap-6 lg:gap-8",
};
```

### 4. **Native App Feel - Mobile UX Patterns**

```typescript
// Touch-Friendly Interactions
const touchPatterns = {
  // Minimum touch target
  minTouchTarget: "min-h-[44px] min-w-[44px]",
  
  // Button press effects
  pressEffect: "active:scale-95 transition-transform",
  
  // Smooth scrolling
  smoothScroll: "scroll-smooth overscroll-contain",
  
  // Safe area insets (iOS notch)
  safeArea: "pb-[env(safe-area-inset-bottom)]",
};

// Bottom Navigation (Mobile Only)
<BottomTab />
// - Fixed position z-[45]
// - Hide on scroll down
// - Show on scroll up
// - Active indicator with animation

// Side Drawer Menu (Mobile)
<MobileMenuDrawer />
// - Slide from right animation
// - Backdrop blur
// - Prevent body scroll when open
```

### 5. **Animation & Motion Design**

```typescript
// Framer Motion Variants (Use sparingly for performance)
const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  // CSS-based animations (preferred for performance)
  cssAnimations: {
    shimmer: "animate-shimmer",
    float: "animate-float",
    slowZoom: "animate-slow-zoom",
    fadeIn: "animate-fade-in",
  },
};

// Key Animations from globals.css
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 6. **Component Design Tokens**

```typescript
// Border Radius
const borderRadius = {
  sm: "calc(var(--radius) - 4px)",  // ~4px
  md: "calc(var(--radius) - 2px)",  // ~6px
  lg: "var(--radius)",              // ~8px
  xl: "12px",
  "2xl": "16px",
  full: "9999px",                   // Pill shape
};

// Shadow System
const shadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
  inner: "shadow-inner",
  
  // Custom shadows for depth
  cardHover: "hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
  floating: "shadow-[0_-4px_12px_rgba(0,0,0,0.05)]",
};

// Transition Timing
const transitions = {
  fast: "transition-all duration-150",
  normal: "transition-all duration-200",
  slow: "transition-all duration-300",
  spring: "transition-all cubic-bezier(0.34, 1.56, 0.64, 1)",
};
```

---

## 🧩 Component Architecture

### 1. **Component Hierarchy**

```
src/components/
├── ui/                    # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── skeleton.tsx
│   └── ...
│
├── common/                # Reusable shared components
│   ├── Heading.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   └── SocialsList.tsx
│
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── FooterSSR.tsx
│   ├── BottomTab.tsx
│   └── ...
│
├── hotel/                 # Hotel-specific components
│   ├── HotelCard.tsx
│   ├── AmenitiesList.tsx
│   ├── ImageGallery.tsx
│   └── ...
│
├── booking/               # Booking flow components
│   ├── BookingForm.tsx
│   ├── Datepicker.tsx
│   └── ...
│
└── home/                  # Homepage sections
    ├── HeroSection.tsx
    ├── BestDeals.tsx
    └── ...
```

### 2. **Component Reusability Patterns**

#### A. **Compound Components** (Flexible APIs)

```tsx
// Example: Card Component with Compound Pattern
<Card className="...">
  <CardHeader>
    <CardTitle>Hotel Name</CardTitle>
    <CardDescription>Location</CardDescription>
  </CardHeader>
  <CardContent>
    <HotelImage />
    <PriceDisplay />
  </CardContent>
  <CardFooter>
    <Button>Book Now</Button>
  </CardFooter>
</Card>
```

#### B. **Render Props Pattern** (For logic reuse)

```tsx
// Example: WithAuth higher-order component
<WithAuth fallback={<LoginPrompt />}>
  {(user) => (
    <UserProfile user={user} />
  )}
</WithAuth>
```

#### C. **Slot Pattern** (For composition)

```tsx
// Example: Button with asChild prop
<Button asChild>
  <Link href="/booking">Book Now</Link>
</Button>
```

### 3. **Server vs Client Components Decision Tree**

```
Is the component interactive? (state, events, effects)
├─ YES → Client Component ("use client")
│  ├─ Forms (inputs, validation)
│  ├─ Carousels/Sliders
│  ├─ Modals/Dialogs
│  ├─ Tabs/Accordions
│  └─ Real-time updates
│
└─ NO → Server Component (default)
   ├─ Static content pages
   ├─ SEO-heavy pages
   ├─ Data fetching pages
   ├─ Markdown rendering
   └─ Layout wrappers
```

### 4. **Loading States & Skeletons**

```tsx
// Pattern 1: Inline Skeleton
function HotelCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-48 w-full rounded-t-lg" />
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

// Pattern 2: Suspense Boundaries
<Suspense fallback={<HotelCardSkeleton />}>
  <HotelList />
</Suspense>

// Pattern 3: Shimmer Effect
<div className="skeleton-shimmer h-4 w-full rounded" />
```

---

## 📝 Master Prompt for Page Generation

### **COPY THIS PROMPT TEMPLATE:**

```markdown
# Task: Create a New Page for Spodia Subdomain Platform

## Context
I need you to create a new page for the Spodia hotel booking platform. This is a production-grade Next.js 16 application using the App Router, TypeScript, Tailwind CSS, and shadcn/ui components.

## Requirements

### 1. **Page Type & Purpose**
[Specify: e.g., "Hotel Details Page", "City Landing Page", "About Us Page", "Spa Listing Page"]

### 2. **Target URL Structure**
[e.g., "/hotels/[slug]", "/spas/[city]", "/about-us"]

### 3. **Key Features Needed**
[List features: e.g., 
- Hotel image gallery with carousel
- Room availability calendar
- Price comparison table
- Guest reviews section
- Map integration
- Booking form
]

### 4. **Data Requirements**
[Specify data needed: e.g., 
- Hotel details (name, description, amenities)
- Room types with pricing
- Availability calendar
- Guest reviews
- Location coordinates
]

---

## Design System Compliance

### Color Palette
- **Primary Brand Orange**: `#FF9530` (for CTAs, active states)
- **Secondary Brand Blue**: `#078ED8` (for accents, links)
- **Gradients**: 
  - Button gradient: `linear-gradient(90deg, #FF9530 0%, #FFB347 100%)`
  - Blue gradient: `linear-gradient(90deg, #078ED8 0%, #43C6FF 100%)`

### Typography
- **Font Family**: Manrope (via `var(--font-manrope)`)
- **Heading Sizes**:
  - H1: `text-4xl md:text-5xl font-extrabold`
  - H2: `text-3xl md:text-4xl font-bold`
  - H3: `text-2xl font-semibold`
- **Body**: `text-base leading-relaxed`

### Spacing & Layout
- **Container**: `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`
- **Section Padding**: `py-12 md:py-16 lg:py-24`
- **Grid Gaps**: `gap-4 md:gap-6 lg:gap-8`

### Responsive Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Native App Feel (Mobile)
- Touch targets: `min-h-[44px] min-w-[44px]`
- Button press effect: `active:scale-95`
- Smooth scrolling: `scroll-smooth`
- Safe area insets: `pb-[env(safe-area-inset-bottom)]`

### Animation Guidelines
- Use CSS animations for performance (`animate-fade-in-up`, `animate-shimmer`)
- Transitions: `transition-all duration-200/300`
- Hover effects: Subtle scale transforms (`hover:scale-105`)
- Loading states: Skeleton loaders with shimmer effect

---

## Component Usage

### Preferred Component Library
Use shadcn/ui components from `/src/components/ui/`:
- `Button` - For all buttons
- `Card` - For content cards
- `Input` / `Textarea` - For forms
- `Dialog` / `Sheet` - For modals
- `Skeleton` - For loading states
- `Carousel` - For image sliders
- `Tabs` - For tabbed content
- `Accordion` - For collapsible sections

### Custom Components Available
- `Header` - From `/src/components/layout/Header.tsx`
- `BottomTab` - Mobile navigation from `/src/components/layout/BottomTab.tsx`
- `FooterSSR` - Footer from `/src/components/layout/FooterSSR.tsx`
- `PremiumDatePicker` - Date picker from `/src/components/ui/PremiumDatePicker.tsx`
- `PremiumGuestSelect` - Guest selector from `/src/components/ui/PremiumGuestSelect.tsx`

---

## Code Structure

### File Organization
```
src/
├── app/
│   ├── (page-path)/
│   │   ├── page.tsx          # Main page component
│   │   └── loading.tsx       # Optional loading UI
│   └── layout.tsx            # Already exists (don't modify)
│
├── components/
│   ├── [feature]/
│   │   ├── [ComponentName].tsx
│   │   └── index.ts          # Optional barrel export
│   └── ui/                   # Use existing shadcn components
│
└── lib/
    ├── types/
    │   └── [new-types].ts
    └── utils/
        └── [helpers].ts
```

### Server Component Pattern (Preferred)
```tsx
import type { Metadata } from 'next';

// Generate SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Page Title | Spodia',
    description: 'Page description for SEO',
    openGraph: {
      title: 'OG Title',
      description: 'OG Description',
      images: ['/og-image.png'],
    },
  };
}

// Fetch data on server
async function getData() {
  const res = await fetch('API_URL', {
    next: { revalidate: 300 }, // ISR: 5 minutes
  });
  return res.json();
}

// Main page component
export default async function Page() {
  const data = await getData();
  
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Page content */}
    </main>
  );
}
```

### Client Component Pattern (When Needed)
```tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function InteractiveComponent() {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Client-side logic
  }, []);
  
  return (
    <div>
      <Button className="gradient-btn">
        Click Me
      </Button>
    </div>
  );
}
```

---

## SEO Requirements

### Meta Tags (Must Include)
```tsx
export const metadata: Metadata = {
  title: 'Page Title | Spodia Hotels',
  description: 'Compelling description (150-160 characters)',
  keywords: 'relevant, keywords, for, seo',
  robots: 'index, follow',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    type: 'website',
    locale: 'en_IN',
    url: 'https://spodia.com/page-url',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Alt text',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Title',
    description: 'Twitter Description',
    images: ['/twitter-image.png'],
  },
};
```

### Structured Data (Schema.org)
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": "Hotel Name",
      "description": "Hotel description",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Address line",
        "addressLocality": "City",
        "addressCountry": "IN"
      },
      "image": "/hotel-image.jpg",
      "starRating": {
        "@type": "Rating",
        "ratingValue": "4"
      }
    })
  }}
/>
```

---

## Mobile Responsiveness Checklist

- [ ] All text uses responsive font sizes (`text-base md:text-lg`)
- [ ] Images use `w-full h-auto` or aspect ratio classes
- [ ] Grid layouts stack on mobile (`grid-cols-1 md:grid-cols-2`)
- [ ] Buttons have minimum touch target (44x44px)
- [ ] Horizontal scrolling avoided (`overflow-x-hidden`)
- [ ] Bottom navigation visible on mobile only (`lg:hidden`)
- [ ] Safe area insets for iOS devices
- [ ] Mobile menu drawer implemented
- [ ] Touch-friendly interactions (no hover-dependent actions)

---

## Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/hotel.jpg"
  alt="Hotel name"
  width={800}
  height={600}
  className="w-full h-auto"
  priority  // For above-fold images
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Lazy Loading
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { 
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false  // If client-only
  }
);
```

### Code Splitting
- Use React.lazy() for heavy components
- Implement Suspense boundaries
- Load critical CSS inline

---

## Accessibility Requirements

- [ ] All images have descriptive alt text
- [ ] Form inputs have associated labels
- [ ] Buttons have descriptive text (not just icons)
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works (tab order)
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Screen reader friendly structure

---

## Testing Checklist

### Manual Testing
- [ ] Desktop view (1920px, 1366px, 1024px)
- [ ] Tablet view (768px, 1024px)
- [ ] Mobile view (375px, 414px, 390px)
- [ ] Dark mode compatibility
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

### Functional Testing
- [ ] All links work
- [ ] Forms validate correctly
- [ ] Interactive elements respond to user input
- [ ] Loading states display properly
- [ ] Error states handled gracefully

---

## Deliverables Expected

1. **Main Page Component** (`page.tsx`)
2. **Supporting Components** (if needed)
3. **Type Definitions** (TypeScript interfaces)
4. **SEO Metadata** (Open Graph, Twitter Cards)
5. **Structured Data** (Schema.org JSON-LD)
6. **Responsive Design** (Mobile, Tablet, Desktop)
7. **Loading States** (Skeleton screens)
8. **Error Handling** (Error boundaries)

---

## Example Output Structure

```tsx
// src/app/hotels/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HotelGallery } from '@/components/hotel/HotelGallery';
import { HotelAmenities } from '@/components/hotel/HotelAmenities';
import { BookingWidget } from '@/components/booking/BookingWidget';
import { Skeleton } from '@/components/ui/skeleton';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const hotel = await fetchHotel(params.slug);
  
  return {
    title: `${hotel.name} | Book Now on Spodia`,
    description: hotel.tagline,
    openGraph: {
      images: [hotel.featuredImage],
    },
  };
}

async function fetchHotel(slug: string) {
  const res = await fetch(`${process.env.API_URL}/hotels/${slug}`, {
    next: { revalidate: 300 },
  });
  
  if (!res.ok) notFound();
  
  return res.json();
}

export default async function HotelPage({ params }: PageProps) {
  const hotel = await fetchHotel(params.slug);
  
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh]">
        <HotelGallery images={hotel.images} />
      </section>
      
      {/* Booking Widget (Sticky on Mobile) */}
      <div className="sticky top-0 z-50 lg:static">
        <BookingWidget hotelId={hotel.id} />
      </div>
      
      {/* Hotel Details */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <HotelAmenities amenities={hotel.amenities} />
      </div>
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotel.schema) }}
      />
    </main>
  );
}
```

---

## Additional Notes

- **Follow existing patterns** from `/src/components/home/` and `/src/components/hotel/`
- **Use TypeScript** for type safety
- **Prioritize Server Components** unless interactivity is required
- **Implement ISR** for frequently accessed pages (revalidate: 300)
- **Keep bundle size small** by importing only what's needed
- **Test on real devices** before deployment

---

## Questions to Clarify Before Starting

1. What is the primary goal of this page? (Conversion, Information, Navigation)
2. What user actions should be prioritized?
3. Are there any existing pages to reference for consistency?
4. What data sources will be used? (Internal API, Third-party, Static)
5. Any specific performance targets? (LCP, FID, CLS)

---

```

---

## ✅ Best Practices Checklist

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint rules followed
- [ ] No console.logs in production code
- [ ] Proper error handling implemented
- [ ] Loading states for async operations

### Performance
- [ ] Images optimized with next/image
- [ ] Lazy loading for heavy components
- [ ] Server Components preferred
- [ ] Minimal client-side JavaScript
- [ ] Efficient revalidation strategy

### SEO
- [ ] Unique meta title & description
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Canonical URL set
- [ ] Structured data (JSON-LD)
- [ ] Alt text for all images

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigable
- [ ] Focus indicators visible
- [ ] Color contrast sufficient

### Mobile UX
- [ ] Touch targets ≥44px
- [ ] No horizontal scroll
- [ ] Responsive typography
- [ ] Mobile-first approach
- [ ] Safe area insets

### Security
- [ ] Input sanitization
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Secure headers
- [ ] Rate limiting on APIs

---


```

