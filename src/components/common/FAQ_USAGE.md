# FAQ Section Component - Usage Guide

## Overview
The `FAQSection` component is a reusable component that fetches and displays FAQs from the API based on different contexts (listing, city, state, or country).

## API Endpoint
```
GET /api/faqs/?listing={id}
GET /api/faqs/?city={id}
GET /api/faqs/?state={id}
GET /api/faqs/?country={id}
```

## Component Location
`components/common/FAQSection.tsx`

## Usage Examples

### 1. Hotel/Listing Details Page (Current Implementation)
```tsx
import FAQSection from '@/components/common/FAQSection'

<FAQSection 
  listingId={hotel?.id} 
  title={`${hotel.name || 'Hotel'} FAQs`}
  subTitle="Find answers to common questions about this property"
  subTitle2="Our support team is here to help you"
/>
```

### 2. City Page
```tsx
import FAQSection from '@/components/common/FAQSection'

<FAQSection 
  cityId={cityId} 
  title={`${cityName} Travel FAQs`}
  subTitle="Everything you need to know about traveling to this city"
/>
```

### 3. State Page
```tsx
import FAQSection from '@/components/common/FAQSection'

<FAQSection 
  stateId={stateId} 
  title={`${stateName} Travel FAQs`}
  subTitle="Discover travel information for this state"
/>
```

### 4. Country Page
```tsx
import FAQSection from '@/components/common/FAQSection'

<FAQSection 
  countryId={countryId} 
  title={`${countryName} Travel FAQs`}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `listingId` | `number` | No | Hotel/Listing ID to fetch FAQs for |
| `cityId` | `number` | No | City ID to fetch FAQs for |
| `stateId` | `number` | No | State ID to fetch FAQs for |
| `countryId` | `number` | No | Country ID to fetch FAQs for |
| `title` | `string` | No | Section title (default: "Frequently Asked Questions") |
| `subTitle` | `string` | No | First subtitle |
| `subTitle2` | `string` | No | Second subtitle |

**Note:** At least one of `listingId`, `cityId`, `stateId`, or `countryId` must be provided.

## Features
- ✅ Fetches FAQs from API using React Query
- ✅ Loading state with skeleton loaders
- ✅ Error handling
- ✅ Empty state when no FAQs available
- ✅ Accordion-style Q&A display
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Scrollable content area (max-height: 50vh)

## API Response Format
```json
{
  "totalRecords": 7,
  "status": "success",
  "records": [
    {
      "id": 13,
      "listing": 1,
      "listing_name": "Mayur Gardens",
      "country": null,
      "state": null,
      "city": null,
      "question": "What is FAQ?",
      "answer": "FAQ is a list of common questions.",
      "created_at": "2025-11-10T19:14:54.515222Z",
      "updated_at": "2025-11-10T19:14:54.515413Z",
      "is_active": true,
      "created_by": 2,
      "full_name": "Admin Admin"
    }
  ]
}
```

## Styling
The component uses:
- Tailwind CSS for styling
- `gradient-orange-bg` class for active FAQ items
- Lucide React icons (Plus, X)
- Smooth transitions and hover effects

## Dependencies
- `@tanstack/react-query` - For data fetching
- `lucide-react` - For icons
- `@/services/api` - API service layer
- `@/types/faq` - TypeScript types
