# BookNowButton Component

A reusable, customizable button component for booking actions across the application.

## Usage

```tsx
import BookNowButton from "@/components/ui/BookNowButton";

// Basic usage
<BookNowButton />

// With custom props
<BookNowButton
  size="lg"
  variant="gradient"
  showIcon={true}
  onClick={(e) => handleBooking(e)}
  className="custom-class"
>
  Reserve Now
</BookNowButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `(e: React.MouseEvent<HTMLButtonElement>) => void` | `undefined` | Click handler function |
| `className` | `string` | `""` | Additional CSS classes |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `variant` | `"gradient" \| "solid" \| "outline"` | `"gradient"` | Button style variant |
| `showIcon` | `boolean` | `false` | Show arrow icon |
| `disabled` | `boolean` | `false` | Disable button |
| `children` | `React.ReactNode` | `"Book Now"` | Button text/content |

## Variants

### Gradient (default)
Orange gradient background with hover effects
```tsx
<BookNowButton variant="gradient" />
```

### Solid
Solid orange background
```tsx
<BookNowButton variant="solid" />
```

### Outline
Outlined button with transparent background
```tsx
<BookNowButton variant="outline" />
```

## Sizes

- **sm**: Small button (px-3 py-1.5 text-xs)
- **md**: Medium button (px-5 py-2.5 text-sm)
- **lg**: Large button (px-6 py-3 text-base)

## Examples

### BestDeals Card
```tsx
<BookNowButton
  size="md"
  variant="gradient"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle booking
  }}
/>
```

### StayCard
```tsx
<BookNowButton
  size="sm"
  variant="outline"
  className="bg-[#F2F4F6] hover:bg-gray-200 text-black border-gray-200"
/>
```

### PopularNearby
```tsx
<BookNowButton
  size="md"
  variant="solid"
  className="bg-[#078ED8] hover:bg-[#0679b8]"
/>
```

## Customization

You can override styles using the `className` prop:

```tsx
<BookNowButton
  variant="gradient"
  className="w-full py-4 text-lg"
>
  Complete Booking
</BookNowButton>
```
