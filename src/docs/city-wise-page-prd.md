Excellent — this is the **most critical layer in your entire system**.

👉 The **City Page = Revenue Engine (Highest Conversion Layer)**

Below is a **production-grade PRD for City Subdomain**, fully aligned with:

* Your system architecture 
* Your city doc 
* And enhanced with **conversion-first UX, API-ready JSON, and best practices**

---

# 📄 PRD: Spodia City Subdomain Platform

---

## 1. 🧭 Product Overview

### Product Name

**Spodia City Conversion Layer**

### Goal

Build a **high-conversion, intent-driven page** that:

* Converts **search traffic → bookings**
* Enables **deep filtering (area, amenities, price)**
* Surfaces **inventory + experiences**

---

## 2. 🌐 URL Strategy

```ts
{city}-{country}.spodia.com

Examples:
mumbai-in.spodia.com
goa-in.spodia.com
delhi-in.spodia.com
```

---

## 3. 🎯 User Intent (CRITICAL)

| Query Type                      | Intent     |
| ------------------------------- | ---------- |
| “Hotels in Mumbai”              | High       |
| “Hotels in Bandra”              | Very High  |
| “5 star hotels Mumbai with spa” | Conversion |

👉 City page must:

* Reduce friction
* Show inventory fast
* Enable filtering instantly

---

## 4. 🧩 Rendering Strategy

| Section         | Type          |
| --------------- | ------------- |
| Hero + SEO      | SSR           |
| Hotel Listings  | ISR (60–120s) |
| Filters         | Client        |
| Booking Widgets | Client        |
| Deals           | ISR           |
| Ecosystem       | Hybrid        |

---

## 5. ⚡ UX PRIORITY HIERARCHY

```txt
1. Search + Filters
2. Hotel Listings
3. Deals
4. Areas (micro-location discovery)
5. Ecosystem (spa, venue, dining)
6. SEO content
```

---

# 📐 Page Structure (City Subdomain)

---

## 5.1 HEADER + SMART SEARCH (MOST IMPORTANT)

### Features

* Sticky header
* Auto-suggest (areas + hotels)
* Event-aware date picker

### JSON

```json
{
  "header": {
    "logoText": "Spodia Mumbai",
    "tagline": "India’s City of Dreams",
    "menu": ["Hotels", "Tours", "Venues", "Restaurants", "Spas"],
    "actions": ["List Property", "Login", "Contact"],
    "backLink": {
      "label": "Explore Maharashtra Cities",
      "url": "https://maharashtra-in.spodia.com"
    },
    "search": {
      "placeholder": "Search areas, hotels...",
      "suggestions": ["Bandra", "Juhu", "Colaba", "Powai"],
      "events": [
        {
          "name": "Mumbai Film Festival",
          "date": "2026-10-12"
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
    "title": "Welcome to Mumbai: Where Luxury Meets Heritage.",
    "subtitle": "Book Hotels with Ocean Views, Rooftop Dining & Conference Spaces.",
    "backgroundImage": "https://cdn.spodia.com/cities/mumbai/hero.jpg",
    "trustBadges": [
      "Govt Verified",
      "Free Cancellation",
      "24/7 Support"
    ]
  }
}
```

---

## 5.3 AREA / LOCALITY DISCOVERY (VERY IMPORTANT)

👉 This replaces “cities” from state page

```json
{
  "areas": [
    {
      "name": "Bandra",
      "image": "https://cdn.spodia.com/areas/bandra.jpg",
      "startingPrice": 1299,
      "tags": ["Nightlife", "Luxury", "Shopping"],
      "slug": "bandra-mumbai"
    }
  ]
}
```

---

## 5.4 HOTEL LISTINGS (CORE ENGINE)

⚠️ This is your **primary conversion module**

```json
{
  "hotels": [
    {
      "id": "taj-mahal-palace",
      "name": "Taj Mahal Palace",
      "location": "Colaba",
      "price": 18000,
      "rating": 4.8,
      "reviews": 3200,
      "amenities": ["Spa", "Pool", "Sea View"],
      "image": "https://cdn.spodia.com/hotels/taj.jpg",
      "cta": "/hotel/taj-mahal-palace-mumbai"
    }
  ]
}
```

---

## 5.5 CURATED EXPERIENCES

```json
{
  "experiences": [
    {
      "title": "Luxury Heritage Stays",
      "hotel": "Taj Mahal Palace",
      "price": 20000
    },
    {
      "title": "Budget Hostels",
      "hotel": "Zostel Mumbai",
      "price": 799
    }
  ]
}
```

---

## 5.6 WHY SPODIA (CITY VERSION)

```json
{
  "whySpodia": [
    {
      "title": "5000+ Hotels Across Mumbai"
    },
    {
      "title": "Best Business Hotels in BKC"
    },
    {
      "title": "Iconic Dining Inside Hotels"
    }
  ]
}
```

---

## 5.7 HOTEL CHAINS

```json
{
  "hotelChains": [
    {
      "name": "Taj Hotels",
      "slug": "taj-mumbai"
    }
  ]
}
```

---

## 5.8 HOTEL ECOSYSTEM (HIGH IMPACT)

```json
{
  "ecosystem": {
    "spas": [
      {
        "name": "Four Seasons Spa",
        "price": 12000
      }
    ],
    "venues": [
      {
        "name": "Grand Hyatt Banquet",
        "capacity": 1000
      }
    ],
    "restaurants": [
      {
        "name": "Wasabi by Morimoto",
        "hotel": "Taj"
      }
    ]
  }
}
```

---

## 5.9 DEALS (HIGH CONVERSION)

```json
{
  "deals": [
    {
      "title": "35% Off Marine Drive Hotels",
      "validTill": "2026-08-01"
    }
  ]
}
```

---

## 5.10 SEO SUPER GRID (TRAFFIC MACHINE)

```json
{
  "seoSections": {
    "nearbyCities": ["Thane", "Navi Mumbai"],
    "areas": ["Bandra Hotels", "Juhu Beach Hotels"],
    "categories": ["5 Star Hotels", "Budget Hotels"],
    "chains": ["Taj Hotels Mumbai", "OYO Mumbai"]
  }
}
```

---

## 5.11 FOOTER (MEGA SEO)

```json
{
  "footer": {
    "sections": [
      {
        "title": "Explore Mumbai",
        "links": ["Bandra", "Juhu", "Colaba"]
      }
    ],
    "newsletter": {
      "offer": "₹750 Off"
    }
  }
}
```

---

# 🔌 API DESIGN

---

## Endpoint

```ts
GET /api/city/{citySlug}
```

---

## Response

```json
{
  "city": "Mumbai",
  "state": "MH",
  "country": "IN",
  "currency": "INR",
  "data": {
    "header": {},
    "hero": {},
    "areas": [],
    "hotels": [],
    "experiences": [],
    "whySpodia": [],
    "hotelChains": [],
    "ecosystem": {},
    "deals": [],
    "seoSections": {},
    "footer": {}
  }
}
```

---

# ⚙️ Next.js Integration

```ts
async function getCityData(slug: string) {
  return fetch(`${process.env.API_URL}/city/${slug}`, {
    next: { revalidate: 60 }
  }).then(res => res.json());
}
```

---

# 🚀 Performance Strategy

* ISR: 60s (hot inventory updates)
* Virtualized lists (for hotels)
* Lazy load:

  * Ecosystem
  * Footer
* Edge caching

---

# 🔍 SEO STRATEGY (VERY IMPORTANT)

### Title

```
Hotels in Mumbai | Luxury, Budget & Beach Stays | Spodia
```

### Schema

* Hotel
* TouristAttraction
* Breadcrumb:

```
Home > India > Maharashtra > Mumbai
```

---

# 📱 MOBILE UX (CRITICAL)

### Must-have:

* Sticky filter bar
* Bottom booking CTA
* Quick filters:

  * Near Airport
  * Free Breakfast
  * Pet Friendly

### Floating CTA:

* WhatsApp chat
* Instant call

---

# 🧪 Edge Cases

| Case      | Handling                    |
| --------- | --------------------------- |
| No hotels | show nearby cities          |
| High load | pagination + virtualization |
| Slow API  | skeleton loaders            |

---

# 🧠 CRITICAL PRODUCT INSIGHT

### City Page = BOOKING ENGINE 💰

👉 Optimize for:

1. **Speed**
2. **Filtering**
3. **Trust**
4. **Inventory visibility**

---

# 📦 Deliverables

* [ ] City page UI
* [ ] Listings engine
* [ ] Filter system
* [ ] API schema
* [ ] SEO optimization
* [ ] Mobile UX

---


