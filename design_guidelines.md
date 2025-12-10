# Restaurant Ordering Application - Design Guidelines

## Design Aesthetic: Editorial/Magazine Style
Elegant serif typography combined with modern sans-serif creates a sophisticated, upscale dining experience.

## Typography System
- **Headings**: Playfair Display (distinctive serif for elegant restaurant branding)
- **Body Text**: Inter (clean, highly readable sans-serif)
- **Hierarchy**: Large display headings for categories, medium weights for product names, regular for descriptions

## Layout Architecture

### Fixed Header
- Restaurant name and tagline prominently displayed
- Cart button with dynamic item count badge (bouncing animation on updates)
- Sticky positioning for persistent access

### Category Grid (Home View)
- 6 main category cards in responsive grid (2 columns mobile, 3 tablet, 3 desktop)
- Each card features:
  - High-quality food photography as background
  - Category name overlay with semi-transparent dark backdrop
  - Subtle hover scale effect (1.02x)
  - Staggered fade-in animations on page load (100ms delays)

### Product List View
- Grid layout: 1 column mobile, 2 columns tablet, 3 columns desktop
- Each product card includes:
  - Featured food image (16:9 aspect ratio)
  - Product name (bold, prominent)
  - Description (1-2 sentences, muted text)
  - Price (emphasized, larger size)
  - "Add to Cart" button (primary color, full width)
- "Back to Menu" button at top for easy navigation

### Cart Sidebar
- Slides in from right (500ms cubic-bezier easing)
- Semi-transparent dark overlay behind sidebar
- Contains:
  - Cart items list with thumbnail images, names, prices
  - Remove button (trash icon) for each item
  - Price breakdown section: Subtotal, Tax (8%), Total (emphasized)
  - "Proceed to Checkout" button (prominent, full width)
- Empty state: Icon with "Browse Menu" call-to-action

### AI Recommendations Sidebar
- Elegant card-based layout
- Recommendation badge with reason ("Perfect pairing", "Complete your meal")
- Product image, name, description
- Two action buttons: "Add to Cart" and "Maybe Later"
- Loading state with spinner during webhook processing

## Color Palette
- **Primary**: Deep burgundy (#8B1538) for CTAs and accents
- **Secondary**: Warm gold (#D4AF37) for headings and highlights
- **Background**: Warm off-white (#FAF8F5)
- **Text Primary**: Rich charcoal (#2C2C2C)
- **Text Secondary**: Warm gray (#6B6B6B)

## Spacing System
Use Tailwind units: 2, 4, 6, 8, 12, 16 for consistent rhythm
- Cards: p-6 padding, gap-8 between elements
- Sections: py-12 on mobile, py-16 on desktop
- Component spacing: mb-4 for tight groupings, mb-8 for section breaks

## Component Specifications

### Category Cards
- Rounded corners (rounded-lg)
- Soft shadow on hover
- Image overlay with gradient fade
- Centered text with generous padding

### Product Cards
- Clean white background
- Border for definition
- Image fills top portion completely
- Content section with ample padding (p-6)
- Button with full-width layout

### Cart Badge
- Circular, positioned top-right of cart icon
- Bright contrasting color
- Small, readable number
- Bounce animation when count increases

### Buttons
- Primary: Burgundy background, white text, rounded
- Secondary: Outlined style with burgundy border
- Hover: Slight darkening, no transform
- Active: Pressed appearance

### Toast Notifications
- Slide in from top-right
- Success: Green accent
- Remove: Red accent
- Auto-dismiss after 3 seconds
- Smooth fade transitions

## Animations & Interactions
- **Category cards**: Staggered fade-in on load (opacity 0→1, translate-y)
- **Sidebar**: Slide from right (translate-x), 500ms duration
- **Cart badge**: Bounce scale animation on increment
- **Hover states**: Subtle scale (1.02x) or brightness adjustments
- **Add to cart**: Button ripple effect, brief confirmation state
- All transitions use smooth cubic-bezier easing

## Images
- **Category backgrounds**: High-quality food photography from each category, slightly darkened with overlay for text readability
- **Product cards**: Appetizing hero shots of individual dishes, well-lit and professionally styled
- **Empty states**: Illustrative icons (shopping bag, chef's hat)
- No large hero section - focus on immediate menu access

## Responsive Behavior
- **Mobile (< 768px)**: Single column, full-width cards, simplified header
- **Tablet (768-1024px)**: 2-column grids, medium spacing
- **Desktop (> 1024px)**: 3-column grids, maximum container width, generous whitespace

## Special States
- **Loading**: Skeleton screens for product grids, spinner for recommendations
- **Empty cart**: Centered icon + message + CTA button
- **Error states**: Gentle error messages with retry options
- **Success confirmations**: Brief toast notifications, green checkmarks