# Spodia Project Documentation & Technical Overview

Welcome to the official technical documentation for the **Spodia** web application platform. This document provides a complete overview of the codebase architecture, technology stack, responsive design standards, and a comprehensive sitemap of all static, working, and dynamic URL routes.

---

## 1. Project Overview

**Spodia** is a multi-tenant, premium travel & hospitality booking platform that enables users to discover, search, and book hotels, homestays, hourly room stays, luxury resorts, dining/restaurants, spas, and event venues across domestic and international destinations.

- **Primary Goal**: Provide a fast, mobile-first, conversion-optimized booking experience for travelers and tenant hotels.
- **Architecture**: Next.js App Router with dynamic subdomain rewriting, strict TypeScript, Redux Toolkit state management, and modern responsive styling.
- **Local Dev Server**: `http://localhost:3000`

---

## 2. Technology Stack & Key Libraries

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript (Strict Mode Enabled) |
| **Styling** | Tailwind CSS + Vanilla CSS Custom Properties |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| **UI Component Library** | Shadcn UI, Radix UI Primitives, Lucide React, React Icons |
| **Carousels & Motion** | Swiper.js (`swiper/react`), Framer Motion, Lenis Smooth Scroll |
| **Date & Form Validation** | `date-fns`, `react-hook-form`, `zod` |
| **HTTP & API Layer** | Custom Fetch API Client (`useApiData`, `useApi`) |

---

## 3. Page Routes Sitemap & Working URLs

Below is the complete inventory of working static, dynamic, and utility URL routes in the application.

### A. Marketing & Primary Landing Pages
| Route Path | Full Local URL | Purpose |
| :--- | :--- | :--- |
| `/` | `http://localhost:3000/` | Main Marketing Home Page with Hero Banner & Search |
| `/search-results` | `http://localhost:3000/search-results` | Search Results Page with Filters & Hotel Cards |
| `/list-property` | `http://localhost:3000/list-property` | Hotel/Host Partner Registration & Property Listing |
| `/hourly-rooms` | `http://localhost:3000/hourly-rooms` | Short-stay / Hourly Room Bookings |
| `/restaurants` | `http://localhost:3000/restaurants` | Restaurant & Fine Dining Discoveries |
| `/spas` | `http://localhost:3000/spas` | Spa & Wellness Booking Page |
| `/events` | `http://localhost:3000/events` | Event Venues & Banquet Hall Search |
| `/events/search` | `http://localhost:3000/events/search` | Event Venue Search Results |
| `/events/venue-types` | `http://localhost:3000/events/venue-types` | Event Venue Types Catalog |

### B. Booking & User Account Flow
| Route Path | Full Local URL | Purpose |
| :--- | :--- | :--- |
| `/booking` | `http://localhost:3000/booking` | Booking Checkout & Occupancy Selection |
| `/booking/payment-success` | `http://localhost:3000/booking/payment-success` | Payment Confirmation & Booking Summary |
| `/login` | `http://localhost:3000/login` | User Authentication (Login) |
| `/register` | `http://localhost:3000/register` | User Account Registration |
| `/dashboard` | `http://localhost:3000/dashboard` | User Account Dashboard |
| `/my-bookings` | `http://localhost:3000/my-bookings` | User Booking History & Management |
| `/profile` | `http://localhost:3000/profile` | User Profile & Settings |

### C. Subdomain & Hotel Tenant Pages (`/hotel/[entityKey]`)
*Example using sample entity key `palm-resort` or dynamic hotel slug:*

| Route Path Pattern | Sample Local URL | Purpose |
| :--- | :--- | :--- |
| `/hotel/[entityKey]` | `http://localhost:3000/hotel/palm-resort` | Hotel Tenant Home Page |
| `/hotel/[entityKey]/overview` | `http://localhost:3000/hotel/palm-resort/overview` | Hotel Overview & Summary |
| `/hotel/[entityKey]/rooms` | `http://localhost:3000/hotel/palm-resort/rooms` | Available Rooms & Suite Options |
| `/hotel/[entityKey]/tariff` | `http://localhost:3000/hotel/palm-resort/tariff` | Room Tariffs & Seasonal Pricing |
| `/hotel/[entityKey]/dine` | `http://localhost:3000/hotel/palm-resort/dine` | Hotel Restaurant & Dining Menu |
| `/hotel/[entityKey]/services` | `http://localhost:3000/hotel/palm-resort/services` | Facilities, Amenities & Services |
| `/hotel/[entityKey]/gallery` | `http://localhost:3000/hotel/palm-resort/gallery` | Photo Gallery & Virtual Tour |
| `/hotel/[entityKey]/reviews` | `http://localhost:3000/hotel/palm-resort/reviews` | Guest Reviews & Ratings |
| `/hotel/[entityKey]/faqs` | `http://localhost:3000/hotel/palm-resort/faqs` | Hotel FAQs |
| `/hotel/[entityKey]/explore` | `http://localhost:3000/hotel/palm-resort/explore` | Nearby Attractions & Local Guide |
| `/hotel/[entityKey]/events` | `http://localhost:3000/hotel/palm-resort/events` | Hotel Banquets & Event Spaces |
| `/hotel/[entityKey]/book` | `http://localhost:3000/hotel/palm-resort/book` | Direct Hotel Booking Page |
| `/hotel/[entityKey]/about` | `http://localhost:3000/hotel/palm-resort/about` | About Property & History |
| `/hotel/[entityKey]/contact` | `http://localhost:3000/hotel/palm-resort/contact` | Property Contact & Map Location |
| `/hotel/[entityKey]/sitemap` | `http://localhost:3000/hotel/palm-resort/sitemap` | Hotel Site Map |

### D. Dynamic Catch-All Subdomain Pages (`/site/[...slug]`)
| Route Path | Sample Local URL | Purpose |
| :--- | :--- | :--- |
| `/site/[...slug]` | `http://localhost:3000/site/india/hotels` | Dynamic Country/City/Regional Landing Pages |

### E. Static Information & Legal Pages
| Route Path | Full Local URL | Purpose |
| :--- | :--- | :--- |
| `/about-us` | `http://localhost:3000/about-us` | About Spodia Platform |
| `/contact` | `http://localhost:3000/contact` | Contact Us & Enquiry Form |
| `/faqs` | `http://localhost:3000/faqs` | Frequently Asked Questions |
| `/career` | `http://localhost:3000/career` | Careers & Job Openings |
| `/csr` | `http://localhost:3000/csr` | Corporate Social Responsibility |
| `/terms-conditions` | `http://localhost:3000/terms-conditions` | Terms & Conditions |
| `/privacy-policy` | `http://localhost:3000/privacy-policy` | Privacy Policy |
| `/booking-policy` | `http://localhost:3000/booking-policy` | Cancellation & Refund Policy |
| `/customer-support` | `http://localhost:3000/customer-support` | Customer Support Portal |
| `/how-spodia-helps` | `http://localhost:3000/how-spodia-helps` | User Agreement & Platform Guide |
| `/spodia-mobile` | `http://localhost:3000/spodia-mobile` | Spodia Mobile App Download |
| `/investor-relations` | `http://localhost:3000/investor-relations` | Investor Relations |
| `/company-details` | `http://localhost:3000/company-details` | Official Company Information |

---

## 4. Key Architectural Systems

### A. Dynamic Header Height Hook (`useHeaderHeight`)
- **File**: `src/hooks/useHeaderHeight.ts`
- **Function**: Uses `ResizeObserver` and window resize listeners to measure the active `<header>` height dynamically and binds the `--header-height` CSS custom property to `document.documentElement`.
- **Usage**: Keeps page top spacing (`paddingTop: 'var(--header-height)'`) perfectly synchronized with the header height across all screen viewports.

### B. Mobile UI/UX & Responsive Standards
- **Hero Section**: Responsive image height (`h-[310px] sm:h-[350px] md:h-[420px]`) with mobile search bar straddling the middle-half of the hero image bottom edge.
- **Search Bar (`MainSearchBar`)**: Stacks vertically into a rounded card on mobile (`< 768px`) with full-width search CTA, and transforms into a single-line horizontal pill on desktop (`≥ 768px`).
- **Horizontal Card Carousels**: Featured stay cards on mobile render as native horizontal swipe carousels (`flex overflow-x-auto snap-x snap-mandatory scrollbar-hide`) with compact mobile app styling.
- **Viewport Overflow Guard**: `html, body { max-width: 100vw; overflow-x: hidden; }` prevents horizontal scrollbar artifacts on mobile devices.

---

## 5. Contact & Support Details

- **Customer Support Phone**: `+91 8800842084` / `+91 7399666688`
- **Support Email**: `support@spodia.in`
- **Hotel Operations Email**: `hotels@spodia.in`
- **Care Email**: `care@spodia.in`
- **Corporate Address**: Spodia, 2nd Floor, 4, 4th Cross, 1st Main Road, 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038
