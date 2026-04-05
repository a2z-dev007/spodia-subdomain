Perfect — this is the **final and most granular layer before hotel booking**.

👉 **Location Page = Ultra-High Intent (Near Checkout Behavior)**

Below is a **production-grade PRD for Location/Sub-locality pages**, fully aligned with:

* Your system design 
* Your location doc 
* And enhanced with **conversion-first UX + scalable API + deep SEO strategy**

---

# 📄 PRD: Spodia Location (Area/Sub-locality) Subdomain Platform

---

## 1. 🧭 Product Overview

### Product Name

**Spodia Hyperlocal Conversion Layer**

### Goal

Build a **micro-location page (Colaba, Bandra, Juhu, etc.)** that:

* Converts **very high-intent users → bookings**
* Enables **hyper-local discovery**
* Pushes **direct booking decisions**

---

## 2. 🌐 URL Strategy

```ts
{location}.{city}.{state}.{country}.spodia.com

Examples:
colaba.mumbai.maharashtra.in.spodia.com
bandra.mumbai.maharashtra.in.spodia.com
juhu.mumbai.maharashtra.in.spodia.com
```

---

## 3. 🎯 User Intent (VERY HIGH)

| Query                           | Intent |
| ------------------------------- | ------ |
| “Hotels near Gateway of India”  | 🔥🔥🔥 |
| “Hotels in Colaba Mumbai”       | 🔥🔥🔥 |
| “5 star hotels Bandra with spa” | 💰     |

👉 Users here:

* Already selected city
* Already selected area
* Ready to book

---

## 4. 🧩 Rendering Strategy

| Section         | Type          |
| --------------- | ------------- |
| Hero + Listings | SSR           |
| Hotel List      | ISR (30–60s)  |
| Filters         | Client        |
| Deals           | ISR           |
| Ecosystem       | Client/Hybrid |

---

## 5. ⚡ UX PRIORITY (CRITICAL)

```txt
1. Hotel Listings (Immediate)
2. Filters (Sticky)
3. Deals
4. Nearby Landmarks
5. Ecosystem
6. SEO content
```

---

# 📐 Page Structure (Location Page)

---

## 5.1 HEADER + PRE-FILLED SEARCH

### Key Difference:

👉 Search is **pre-filled with location**

```json
{
  "header": {
    "logoText": "Spodia Colaba",
    "tagline": "Where Mumbai’s Heritage Meets Luxury",
    "menu": ["Hotels", "Tours", "Venues", "Restaurants", "Spas"],
    "actions": ["List Business", "Login", "Contact"],
    "backLink": {
      "label": "Explore Mumbai Areas",
      "url": "https://mumbai-in.spodia.com"
    },
    "search": {
      "presetLocation": "Colaba, Mumbai",
      "events": [
        {
          "name": "Kala Ghoda Festival",
          "date": "2026-02-10"
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
    "title": "Discover Colaba: Mumbai’s Iconic Waterfront District.",
    "subtitle": "Book Heritage Hotels, Seaside Dining & Event Spaces.",
    "backgroundImage": "https://cdn.spodia.com/locations/colaba.jpg",
    "trustBadges": [
      "Heritage Verified",
      "Free Cancellation",
      "24/7 Support"
    ]
  }
}
```

---

## 5.3 HOTEL LISTINGS (PRIMARY ENGINE)

⚠️ This is the **most important section**

```json
{
  "hotels": [
    {
      "id": "taj-mahal-palace",
      "name": "Taj Mahal Palace",
      "distance": "200m from Gateway of India",
      "price": 15000,
      "rating": 4.9,
      "reviews": 5400,
      "tags": ["Sea View", "Heritage", "5 Star"],
      "image": "https://cdn.spodia.com/taj.jpg",
      "cta": "/hotel/taj-mahal-palace"
    }
  ]
}
```

---

## 5.4 TRENDING HOTELS (FAST DECISION)

```json
{
  "trendingHotels": [
    {
      "name": "The Oberoi",
      "price": 14000,
      "tag": "Top Rated"
    }
  ]
}
```

---

## 5.5 LOCAL EXPERIENCES

```json
{
  "experiences": [
    {
      "type": "Dining",
      "name": "Leopold Cafe"
    },
    {
      "type": "Culture",
      "name": "NGMA Tours"
    }
  ]
}
```

---

## 5.6 WHY SPODIA (HYPERLOCAL)

```json
{
  "whySpodia": [
    {
      "title": "100+ Hotels Near Gateway of India"
    },
    {
      "title": "Iconic Dining Experiences"
    },
    {
      "title": "Luxury Wedding Venues"
    }
  ]
}
```

---

## 5.7 ECOSYSTEM (VERY POWERFUL HERE)

```json
{
  "ecosystem": {
    "spas": [
      {
        "name": "Taj Spa",
        "price": 15000
      }
    ],
    "venues": [
      {
        "name": "Taj Ballroom",
        "capacity": 300
      }
    ],
    "restaurants": [
      {
        "name": "Wasabi",
        "hotel": "Taj"
      }
    ]
  }
}
```

---

## 5.8 DEALS (LAST PUSH)

```json
{
  "deals": [
    {
      "title": "20% Off Heritage Stays",
      "validTill": "2026-08-01"
    }
  ]
}
```

---

## 5.9 LANDMARK-BASED SEO (GAME CHANGER)

```json
{
  "landmarks": [
    {
      "name": "Gateway of India",
      "distance": "100m"
    },
    {
      "name": "Colaba Causeway",
      "distance": "500m"
    }
  ]
}
```

---

## 5.10 SEO GRID

```json
{
  "seoSections": {
    "nearbyAreas": ["Fort", "Marine Drive"],
    "categories": ["Heritage Hotels", "Sea View Hotels"],
    "chains": ["Taj Colaba", "Oberoi Mumbai"]
  }
}
```

---

## 5.11 FOOTER

```json
{
  "footer": {
    "sections": [
      {
        "title": "Explore Colaba",
        "links": ["Gateway of India", "Art District"]
      }
    ],
    "newsletter": {
      "offer": "₹1000 Off"
    }
  }
}
```

---

# 🔌 API DESIGN

---

## Endpoint

```ts
GET /api/location/{locationSlug}
```

---

## Response

```json
{
  "location": "Colaba",
  "city": "Mumbai",
  "state": "MH",
  "country": "IN",
  "data": {
    "header": {},
    "hero": {},
    "hotels": [],
    "trendingHotels": [],
    "experiences": [],
    "whySpodia": [],
    "ecosystem": {},
    "deals": [],
    "landmarks": [],
    "seoSections": {},
    "footer": {}
  }
}
```

---

# ⚙️ Next.js Integration

```ts
async function getLocationData(slug: string) {
  return fetch(`${process.env.API_URL}/location/${slug}`, {
    next: { revalidate: 60 }
  }).then(res => res.json());
}
```

---

# 🚀 Performance Strategy

* ISR: 30–60 sec (high volatility)
* Prioritize above-the-fold:

  * Listings
  * Filters
* Lazy load:

  * Ecosystem
  * Footer

---

# 🔍 SEO STRATEGY (ULTRA TARGETED)

### Title

```
Hotels in Colaba Mumbai | Heritage & Sea View Stays | Spodia
```

### Schema

* Hotel
* TouristAttraction
* Breadcrumb:

```
Home > India > Maharashtra > Mumbai > Colaba
```

---

# 📱 MOBILE UX (CRITICAL)

### Must-have:

* Sticky filter bar
* Map toggle (optional future)
* Quick filters:

  * Near Landmark
  * Budget
  * Free WiFi

### Floating CTA:

* Call support
* WhatsApp booking

---

# 🧪 Edge Cases

| Case          | Handling          |
| ------------- | ----------------- |
| No hotels     | show nearby areas |
| Low inventory | show city hotels  |
| High demand   | urgency badges    |

---

# 🧠 FINAL PRODUCT INSIGHT

## 🔥 Location Page = FINAL DECISION POINT

👉 This page should:

* Remove all friction
* Show **best hotels instantly**
* Push **fast booking**

---

# 📦 Deliverables

* [ ] Location page UI
* [ ] Listing engine (optimized)
* [ ] Filters (area-specific)
* [ ] API schema
* [ ] SEO + schema
* [ ] Mobile-first UX



