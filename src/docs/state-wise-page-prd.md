Perfect — this is where your platform becomes **really powerful (Country → State → City → Hotel funnel)**.

Below is a **production-grade PRD for State Subdomain Pages**, fully aligned with:

* Your **system architecture** 
* Your **state doc requirements** 
* And enhanced with **best practices + scalable API-ready JSON**

---

# 📄 PRD: Spodia State Subdomain Platform

---

## 1. 🧭 Product Overview

### Product Name

**Spodia State Experience Layer**

### Goal

Create a **high-intent, mid-funnel page** that:

* Converts **country traffic → city discovery**
* Supports **SEO for regional queries**
* Enables **experience-based discovery (spa, venue, etc.)**

---

## 2. 🌐 URL & Subdomain Strategy

### Pattern

```ts
{state}-{country}.spodia.com

Examples:
maharashtra-in.spodia.com
goa-in.spodia.com
rajasthan-in.spodia.com
```

### Hierarchy Mapping

```
Country → State → City → Hotel
```

| Level   | Page Type   | Intent    |
| ------- | ----------- | --------- |
| Country | Discovery   | Broad     |
| State   | Exploration | Medium    |
| City    | Selection   | High      |
| Hotel   | Conversion  | Very High |

---

## 3. 🧩 Rendering Strategy

| Section        | Rendering  |
| -------------- | ---------- |
| Hero + SEO     | SSR/ISR    |
| Listings       | ISR (300s) |
| Deals          | ISR (120s) |
| Filters/Search | Client     |
| Ecosystem      | Hybrid     |

---

## 4. 🎯 Core UX Principles (IMPORTANT)

### Differences vs Country Page

| Country           | State                |
| ----------------- | -------------------- |
| Inspiration heavy | Conversion oriented  |
| Broad discovery   | Filtered exploration |
| Generic content   | Localized content    |

---

## 5. 📐 Page Structure (State Subdomain)

---

## 5.1 HEADER + SEARCH (HIGH PRIORITY)

### Features

* Sticky navbar
* Contextual branding
* Smart search (festival-aware)

### JSON

```json
{
  "header": {
    "logoText": "Spodia Maharashtra",
    "tagline": "Gateway to India’s Vibrant West",
    "menu": ["Hotels", "Tours", "Venues", "Restaurants", "Spas"],
    "actions": [
      "List Your Property",
      "Login",
      "Contact",
      "About Tourism"
    ],
    "backLink": {
      "label": "Explore Other States",
      "url": "https://in.spodia.com"
    },
    "search": {
      "placeholder": "Search cities, hotels...",
      "suggestions": ["Mumbai", "Pune", "Lonavala", "Ajanta Caves"],
      "festivals": [
        {
          "name": "Ganesh Chaturthi",
          "date": "2026-09-05"
        }
      ]
    }
  }
}
```

---

## 5.2 HERO SECTION

```json
{
  "hero": {
    "title": "Discover Maharashtra: Beaches, Heritage & Urban Escapes.",
    "subtitle": "Book Hotels with Spas, Conference Venues & Coastal Resorts.",
    "backgroundImage": "https://cdn.spodia.com/states/mh/hero.jpg",
    "trustBadges": [
      "Tourism Certified",
      "Free Cancellation",
      "24/7 Support"
    ]
  }
}
```

---

## 5.3 TRENDING DESTINATIONS

### A. Cities & Regions

```json
{
  "topDestinations": [
    {
      "name": "Mumbai",
      "type": "city",
      "image": "https://cdn.spodia.com/mumbai.jpg",
      "startingPrice": 1499,
      "tags": ["Business Hub", "Nightlife"],
      "slug": "mumbai-in"
    },
    {
      "name": "Lonavala",
      "type": "hill",
      "tags": ["Hill Station", "Weekend Getaway"]
    }
  ]
}
```

---

### B. Experience-Based Listings

```json
{
  "featuredProperties": [
    {
      "name": "Taj Lands End",
      "category": "luxury",
      "location": "Mumbai",
      "price": 12000,
      "tags": ["Ocean View", "5 Star"]
    }
  ]
}
```

---

## 5.4 WHY SPODIA (STATE SPECIFIC)

```json
{
  "whySpodia": [
    {
      "title": "10,000+ Hotels Across Maharashtra"
    },
    {
      "title": "Best Business Hotels in Mumbai & Pune"
    },
    {
      "title": "Exclusive Wine & Wellness Packages"
    }
  ]
}
```

---

## 5.5 HOTEL CHAINS

```json
{
  "hotelChains": [
    {
      "name": "Taj",
      "slug": "taj-maharashtra"
    },
    {
      "name": "Hyatt",
      "slug": "hyatt-maharashtra"
    }
  ]
}
```

---

## 5.6 BLOG / GUIDES

```json
{
  "guides": [
    {
      "title": "Top Weekend Getaways from Mumbai",
      "slug": "weekend-getaways-mumbai"
    }
  ]
}
```

---

## 5.7 HOTEL ECOSYSTEM (CORE USP)

⚠️ This section should be **more transactional than country**

```json
{
  "ecosystem": {
    "spas": [
      {
        "name": "Westin Pune Spa",
        "price": 8000
      }
    ],
    "venues": [
      {
        "name": "JW Marriott Banquet",
        "capacity": 500
      }
    ],
    "restaurants": [
      {
        "name": "Trident Fine Dining",
        "location": "Mumbai"
      }
    ]
  }
}
```

---

## 5.8 DEALS (HIGH CONVERSION)

```json
{
  "deals": [
    {
      "title": "40% Off Mahabaleshwar",
      "validTill": "2026-08-01",
      "urgencyTag": "Limited Time"
    }
  ]
}
```

---

## 5.9 SEO SUPER SECTIONS (CRITICAL FOR SCALE)

```json
{
  "seoSections": {
    "nearbyCities": [
      { "name": "Alibaug", "slug": "alibaug-in" }
    ],
    "bestHotels": [
      { "name": "Radisson Blu Alibaug" }
    ],
    "categories": [
      "Beach Resorts",
      "Business Hotels",
      "Budget Stays"
    ],
    "chains": [
      "Taj Hotels in Mumbai",
      "OYO in Pune"
    ]
  }
}
```

---

## 5.10 FOOTER (MEGA SEO ENGINE)

```json
{
  "footer": {
    "sections": [
      {
        "title": "Explore Maharashtra",
        "links": ["Mumbai", "Pune", "Lonavala"]
      }
    ],
    "newsletter": {
      "offer": "₹1000 Off"
    }
  }
}
```

---

## 6. 🔌 API DESIGN

### Endpoint

```ts
GET /api/state/{stateCode}
```

---

### Full Response

```json
{
  "state": "MH",
  "country": "IN",
  "currency": "INR",
  "locale": "en-IN",
  "data": {
    "header": {},
    "hero": {},
    "topDestinations": [],
    "featuredProperties": [],
    "whySpodia": [],
    "hotelChains": [],
    "guides": [],
    "ecosystem": {},
    "deals": [],
    "seoSections": {},
    "footer": {}
  }
}
```

---

## 7. ⚙️ Next.js Integration

```ts
async function getStateData(state: string) {
  return fetch(`${process.env.API_URL}/state/${state}`, {
    next: { revalidate: 300 }
  }).then(res => res.json());
}
```

---

## 8. 🚀 Performance Strategy

* ISR caching (300s)
* Edge middleware for subdomain parsing
* Component-level lazy loading:

  * Ecosystem
  * Footer
* Image optimization (critical for hero + cards)

---

## 9. 🔍 SEO Strategy (STATE LEVEL)

### Title

```
Hotels in Maharashtra | Mumbai, Pune, Lonavala | Spodia
```

### Schema

* TouristAttraction
* EventVenue
* Breadcrumb:

```
Home > India > Maharashtra
```

---

## 10. 📱 Mobile UX Enhancements

From doc + best practices:

* Floating CTA:

  * 📞 Call support
  * 💬 WhatsApp
* Quick filters:

  * Near Me
  * Budget
  * Free WiFi
* Local alerts:

  * Weather
  * Traffic

---

## 11. 🧪 Edge Cases

| Case          | Handling            |
| ------------- | ------------------- |
| No cities     | fallback to country |
| No deals      | hide section        |
| Low inventory | show nearby states  |

---

## 12. 🧠 Strategic Insight (VERY IMPORTANT)

### State Page = MONEY PAGE 💰

Why?

* Users here have:

  * Chosen destination
  * Medium intent
  * Comparing options

👉 So prioritize:

1. **Search**
2. **Top cities**
3. **Deals**
4. **Ecosystem**

---

## 13. 📦 Deliverables

* [ ] State page UI
* [ ] API schema
* [ ] JSON mock data
* [ ] SEO metadata
* [ ] Schema markup
* [ ] Mobile-first UX
* [ ] Performance optimized

---

# 🔥 What You’ve Built (Big Picture)

You now have:

```
Country PRD ✅
State PRD ✅
```

👉 This forms a **scalable SEO pyramid**
