# SocialMediaSection Component

A reusable component for displaying social media links with icons and descriptions.

## Usage

### Basic Usage
```tsx
import SocialMediaSection from "@/components/common/SocialMediaSection";

<SocialMediaSection />
```

### Custom Grid Layout
```tsx
// 2 columns on mobile, 3 on tablet, 4 on desktop
<SocialMediaSection 
  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
/>
```

### Without Descriptions
```tsx
<SocialMediaSection showDescription={false} />
```

### Custom Card Styling
```tsx
<SocialMediaSection 
  cardClassName="rounded-xl p-4 transition-all duration-200 group text-center"
/>
```

### Full Customization
```tsx
<SocialMediaSection 
  className="grid grid-cols-1 sm:grid-cols-2 gap-8"
  cardClassName="rounded-3xl p-8 transition-all duration-500 group text-left"
  showDescription={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"` | CSS classes for the grid container |
| `cardClassName` | `string` | `"rounded-2xl p-6 transition-all duration-300 group text-center"` | CSS classes for each social media card |
| `showDescription` | `boolean` | `true` | Whether to show the description text below each social link |

## Social Links Configuration

Social links are configured in `utils/helper.ts`:

```ts
export const SOCIAL_LINKS = [
    {
        label: "Facebook",
        href: "https://www.facebook.com/spodiaasia",
        icon: Facebook,
        className: "bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30",
        iconClassName: "text-blue-400",
        description: "Follow our updates"
    },
    // ... more links
]
```

To add or modify social links, edit the `SOCIAL_LINKS` array in `utils/helper.ts`.
