PRD: Spodia Country Subdomain Platform
1. 🧭 Product Overview
Product Name

Spodia Country Subdomain Experience

Goal

Build a high-conversion, SEO-first country landing system using subdomains like:

in.spodia.com
ae.spodia.com
th.spodia.com
Objectives
Drive organic traffic (SEO)
Enable deep discovery (city → hotel → experience)
Improve conversion (bookings, leads)
Support multi-tenant scalability
2. 🧩 Architecture Alignment (From Your System Design)

Based on your system:

Subdomain Pattern
{country}.spodia.com → Country Page
{city}-{country}.spodia.com → City Page
hotel-{name}-{city}-{country}.spodia.com → Hotel Page
Rendering Strategy
Page Type	Rendering
Country Page	ISR (revalidate: 300s)
City Page	ISR
Hotel Page	SSR + ISR
Booking Widget	Client Component
3. 🎯 Target Users
Primary
Travelers searching:
“Hotels in India”
“Resorts in Goa with spa”
Wedding planners
Event organizers
Secondary
Hotel owners (supply side)
4. 🧱 Page Structure (Country Subdomain)
URL
/ (root of subdomain)
5. 📐 Sections Breakdown (Mapped to Doc)
5.1 HERO SECTION

Purpose: Immediate conversion + trust

Components:

Background image (country-specific)
H1 + Subtext
Search bar (city/hotel/date)
Trust badges

API Contract

{
  "hero": {
    "title": "Discover India’s Best Stays – Palaces, Beaches & Beyond.",
    "subtitle": "Book Hotels with Spas, Restaurants & Event Spaces. Best Price Guaranteed!",
    "backgroundImage": "https://cdn.spodia.com/images/countries/in/hero.jpg",
    "trustBadges": [
      "Certified by India Tourism",
      "Secure UPI Payments",
      "Free Cancellation"
    ]
  }
}
5.2 TRENDING DESTINATIONS
A. Top Cities Carousel
{
  "topCities": [
    {
      "id": "goa",
      "name": "Goa",
      "image": "https://cdn.spodia.com/cities/goa.jpg",
      "startingPrice": 1999,
      "currency": "INR",
      "tags": ["Beachfront", "Private Villas", "Nightlife"],
      "slug": "goa-in"
    }
  ]
}
B. Curated Collections
{
  "collections": [
    {
      "id": "luxury-palaces",
      "title": "Palace Hotels of Rajasthan",
      "type": "luxury",
      "image": "https://cdn.spodia.com/collections/palace.jpg",
      "cta": "/collections/luxury-palaces"
    }
  ]
}
5.3 WHY SPODIA SECTION
{
  "whySpodia": [
    {
      "icon": "star",
      "title": "50,000+ Verified Hotels & Venues"
    },
    {
      "icon": "price",
      "title": "Lowest Price Guarantee"
    },
    {
      "icon": "spiritual",
      "title": "Exclusive Spiritual Retreats"
    }
  ]
}
5.4 HOTEL CHAINS
{
  "hotelChains": [
    {
      "name": "Taj Hotels",
      "logo": "https://cdn.spodia.com/chains/taj.png",
      "slug": "taj-hotels"
    },
    {
      "name": "Oberoi",
      "logo": "https://cdn.spodia.com/chains/oberoi.png",
      "slug": "oberoi-hotels"
    }
  ]
}
5.5 TRAVEL INSPIRATION (BLOG)
{
  "blogs": [
    {
      "title": "Top 10 Pilgrimage Stays in Varanasi",
      "slug": "varanasi-pilgrimage-hotels",
      "image": "https://cdn.spodia.com/blogs/varanasi.jpg",
      "excerpt": "Explore the best spiritual stays..."
    }
  ]
}
5.6 HOTEL ECOSYSTEM (KEY DIFFERENTIATOR)
{
  "ecosystem": {
    "spas": [
      {
        "name": "Ananda in the Himalayas",
        "price": 15000,
        "location": "Rishikesh"
      }
    ],
    "restaurants": [
      {
        "name": "Bukhara - ITC Maurya",
        "location": "Delhi",
        "type": "Fine Dining"
      }
    ],
    "venues": [
      {
        "name": "Udaipur Palace Weddings",
        "type": "Wedding Venue",
        "capacity": 500
      }
    ]
  }
}
5.7 DEALS & OFFERS
{
  "deals": [
    {
      "title": "Monsoon Magic",
      "discount": 30,
      "validTill": "2026-07-31T23:59:59Z",
      "cta": "/deals/monsoon"
    }
  ]
}
5.8 SEO-DRIVEN LISTINGS (CRITICAL)

These are auto-generated sections for SEO

{
  "seoSections": {
    "nearbyCities": [
      {
        "name": "Noida",
        "slug": "noida-in"
      }
    ],
    "bestHotels": [
      {
        "name": "Taj Lake Palace",
        "slug": "taj-lake-palace-udaipur"
      }
    ],
    "categories": [
      "4 Star Hotels",
      "3 Star Hotels",
      "Luxury Resorts"
    ]
  }
}
5.9 FOOTER (HEAVY SEO)
{
  "footer": {
    "columns": [
      {
        "title": "Explore India",
        "links": ["Delhi Hotels", "Goa Resorts", "Jaipur Palaces"]
      }
    ],
    "newsletter": {
      "offer": "Get ₹500 Off Your First Booking"
    }
  }
}
6. 🔌 API DESIGN (Future Ready)
Base Endpoint
GET /api/country/{countryCode}
Response Shape
{
  "country": "IN",
  "currency": "INR",
  "locale": "en-IN",
  "data": {
    "hero": {},
    "topCities": [],
    "collections": [],
    "whySpodia": [],
    "hotelChains": [],
    "blogs": [],
    "ecosystem": {},
    "deals": [],
    "seoSections": {},
    "footer": {}
  }
}
7. ⚙️ Frontend Integration (Next.js)
Server Component Pattern
async function getCountryData(code: string) {
  return fetch(`${process.env.API_URL}/country/${code}`, {
    next: { revalidate: 300 }
  }).then(res => res.json());
}
8. 🚀 Performance Strategy
ISR (5 mins)
Image CDN + next/image
Lazy load:
Blogs
Footer
Edge Middleware for subdomain parsing
9. 🔍 SEO Strategy
Dynamic Metadata

Title:

Book Hotels in {Country} | Spodia
Schema:
Hotel
Breadcrumb
LocalBusiness
10. 📱 Mobile UX (Critical)

From your doc:

Floating WhatsApp CTA
Sticky booking/search bar
Bottom navigation
Fast scroll carousels
11. 🧪 Edge Cases
No cities → fallback to popular global cities
No deals → hide section
Slow API → skeleton loaders
12. 📦 Deliverables
 Country Page UI
 API contract
 Dummy JSON
 SEO schema
 Mobile-first layout
 Performance optimized
🧠 Key Product Insight (Important)

Your biggest moat is:
👉 "Hotel Ecosystem (Spas + Restaurants + Venues)"

Most competitors:

Only show hotels

You:

Show experience layers

👉 This should be:

Above the fold (or just below)
Highly visual
Filter-driven