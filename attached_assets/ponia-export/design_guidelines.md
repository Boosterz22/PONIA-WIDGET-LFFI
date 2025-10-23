# Ponia.io Design Guidelines

## Design Approach
**Reference-Based B2B SaaS**: Draw inspiration from Stripe, Linear, and modern B2B platforms. Clean, professional, developer-focused aesthetic with bold yellow accent creating a distinctive Web3 identity.

## Core Design Elements

### Color Palette
**Dark Mode Primary (entire site)**
- Background: `0 0% 5%` (#0E0E0E) - Deep black
- Text Primary: `0 0% 100%` (#FFFFFF) - Pure white
- Accent Yellow: `48 100% 62%` (#FFD73F) - Vibrant yellow for CTAs, logo glow, links
- Gray Subtle: `0 0% 75%` (#BEBEBE) - Subtitles, borders, secondary text

### Typography
- **Headings**: Satoshi (bold, modern, geometric)
- **Body**: Inter (clean, readable)
- **Sizes**: Hero h1 (4xl-6xl), Section titles (3xl-4xl), Body (base-lg)

### Layout System
- **Spacing**: Tailwind units 4, 8, 12, 16, 20, 24, 32
- **Container**: max-w-7xl for main content sections
- **Section Padding**: py-20 to py-32 desktop, py-12 mobile
- **Grid Patterns**: 3-4 columns for feature cards on desktop, stack mobile

### Component Library

**Buttons**
- Primary CTA: Yellow background (#FFD73F), black text, bold, rounded, hover lift effect
- Secondary: Yellow outline, white text, hover yellow background
- All CTAs use yellow accent exclusively

**Cards**
- Background: `0 0% 7%` (#121212) - Slightly lighter than main bg
- Border: 1px gray subtle or yellow on hover
- Padding: p-6 to p-8
- Rounded: rounded-lg to rounded-xl
- Hover: subtle lift + yellow border glow

**Code Blocks**
- Background: Pale yellow tint (#1A1A0F)
- Border: Yellow accent
- Font: monospace
- Syntax highlighting in white/gray/yellow palette

### Animations
**Minimal & Purposeful**
- Yellow glow pulse on Ponia logo (⚡ symbol)
- Subtle card lift on hover (translate-y)
- Counter animations for stats (99.2%, 43s, 1.5%)
- Smooth scroll reveal for sections (fade-up)
- No distracting parallax or excessive motion

## Section-by-Section Specifications

### 1. Hero Section
- Full viewport height (min-h-screen)
- Centered content with ⚡ logo featuring animated yellow glow
- Headline: "The universal cross-chain checkout for Web3 apps"
- Subtext: "Deposit and withdraw from any chain — instantly, transparently, and without custody"
- Two CTAs side-by-side: "Try Demo" (primary yellow) + "Integrate Ponia" (outline)
- Subtle animated background pattern or gradient

### 2. How It Works (3 Steps)
- Background: `0 0% 7%` (#121212)
- Three horizontal cards with numbered icons (1-2-3)
- Icons: Yellow circular backgrounds with white symbols
- Text: Clear step descriptions in white
- Footer: "Built on LI.FI & Socket.tech" with tech badges

### 3. Why Ponia (4 Benefits)
- 2x2 grid on desktop, stack on mobile
- Each card: Icon (yellow) + Title + Description
- Icons: ⚡ Instant UX, 🔄 Bidirectional, 🔍 Transparent, 🧱 Plug & Play
- Hover effect: yellow border + subtle lift
- CTA below: "Integrate Ponia →" yellow button

### 4. For Developers
- Dark background (#0E0E0E)
- Split layout: Left (text) + Right (code snippet)
- Code block with yellow border and pale yellow background
- Syntax highlighting for HTML/JS snippet
- Link: "📘 View full documentation →" in yellow

### 5. Stats & Transparency
- Three large stat cards in a row
- Animated counters: "43s" average ETA, "99.2%" success rate, "1.5%" fee
- Each stat in large bold text with yellow accent
- Icons: ⏱️ ✅ 💸
- Link to /status page for real-time data

### 6. For dApps
- Text-focused section with compelling copy
- Centered layout, max-w-3xl
- Highlight use cases: games, prediction markets, NFT apps
- Yellow underline or highlight on key phrases

### 7. Roadmap
- Vertical timeline with milestones
- ✅ Completed items in white
- 🔜 Upcoming items in yellow
- Connection line between milestones
- 4 items: MVP, Fast Mode, Partner Dashboard, SDK

### 8. Contact Form
- Centered form, max-w-2xl
- Fields: Name, Email/Discord, Project URL, Message (textarea)
- Black input backgrounds with gray borders, white text
- Yellow focus states
- Submit button: Yellow primary CTA
- Validation states using yellow/white

### 9. Footer
- Full-width dark background
- Yellow ⚡ PONIA logo
- Tagline: "Instant. Transparent. Universal."
- Links: Twitter, Discord, Docs, Status (yellow on hover)
- Copyright in gray

## Images
**No hero image required** - This is a developer/B2B product focused on clarity and functionality. Visual impact comes from:
- Animated ⚡ logo with yellow glow
- Icon system for features and steps
- Code snippets as visual elements
- Clean typography and yellow accent creating brand recognition

Optional decorative elements: Abstract geometric patterns, chain connection visualizations, or subtle animated backgrounds - but always secondary to content clarity.