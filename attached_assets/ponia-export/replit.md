# Ponia.io - Universal Cross-Chain Checkout

## Overview

Ponia.io is a B2B Web3 application providing a universal cross-chain checkout solution for decentralized applications (dApps). The platform enables users to deposit and withdraw funds across different blockchain networks instantly and transparently, without requiring custody of user assets. Built with a modern dark-themed interface inspired by professional B2B SaaS platforms like Stripe and Linear, Ponia features a distinctive yellow accent (#FFD73F) that creates a bold Web3 identity.

The application serves as a marketing and integration platform for Web3 developers, offering a contact form for potential integrations and showcasing the technical capabilities of cross-chain transactions powered by LI.FI and Socket.tech protocols.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing with pages:
  - `/` - Home page (marketing site)
  - `/docs` - Documentation page

**UI Component System**
- shadcn/ui component library (New York style variant) for consistent, accessible components
- Radix UI primitives as the foundation for all interactive components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management

**Design System Implementation**
- Dark mode enforced globally via the `dark` class on the HTML element
- Custom color palette defined in CSS variables (HSL format) for themeable components
- Typography stack: Satoshi for headings (bold, geometric), Inter for body text
- Spacing system based on Tailwind's standard scale (4, 8, 12, 16, 20, 24, 32 units)
- Yellow accent (#FFD73F / `hsl(48 100% 62%)`) used exclusively for CTAs, links, and interactive elements

**State Management**
- TanStack Query (React Query) for server state management and API caching
- React Hook Form with Zod validation for form state and validation
- Local component state using React hooks for UI-only state

**Animation Strategy**
- Minimal, purposeful animations focused on micro-interactions
- Counter animations for statistics using requestAnimationFrame
- Subtle hover effects (card lift with translate-y, border glow)
- Yellow glow pulse effect on the Ponia logo (⚡ symbol)
- Three.js WebGL particle background on homepage with yellow neon particles
  - Graceful degradation when WebGL is unavailable (catches errors, renders fallback)
  - 1500 particles with additive blending for glow effect
  - Automatic boundary detection and velocity reversal

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the HTTP server
- ESM (ECMAScript Modules) throughout the codebase
- Custom middleware for request/response logging with duration tracking
- JSON body parsing for API endpoints

**API Design**
- RESTful endpoint structure under `/api` prefix
- Single contact form endpoint: `POST /api/contact`
- Request validation using Zod schemas shared between client and server
- Standardized error responses with status codes and messages

**Development vs Production**
- Development: Vite middleware integrated into Express for HMR and SSR
- Production: Static file serving from pre-built `dist/public` directory
- Environment-aware build process using `NODE_ENV`

### Data Storage Solutions

**Current Implementation**
- In-memory storage using a Map-based class (`MemStorage`)
- UUID-based record identification using Node.js `crypto.randomUUID()`
- Interface-based storage abstraction (`IStorage`) for future database migration

**Database Schema (Configured but Not Active)**
- Drizzle ORM configured for PostgreSQL with Neon serverless driver
- Contact table schema defined with fields:
  - `id`: UUID primary key (auto-generated)
  - `name`: Text, required
  - `emailOrDiscord`: Text, required (flexible contact method)
  - `projectUrl`: Text, optional
  - `message`: Text, required (minimum 10 characters)
- Schema validation shared between database and API layers via `drizzle-zod`
- Migration files configured to output to `./migrations` directory

**Storage Migration Path**
- The `IStorage` interface allows swapping from `MemStorage` to a database-backed implementation without changing business logic
- Database connection string expected via `DATABASE_URL` environment variable
- Drizzle Kit configured for schema push and migration generation

### Authentication and Authorization

**Current State**
- No authentication system implemented
- Application is publicly accessible
- Contact form submissions are unauthenticated

**Session Infrastructure**
- `connect-pg-simple` package included for future PostgreSQL session storage
- Cookie-based session management prepared but not active

### External Dependencies

**Third-Party UI Libraries**
- `@radix-ui/*`: 20+ primitive components for accessibility-compliant UI elements
- `embla-carousel-react`: Carousel/slider functionality
- `lucide-react`: Icon library for consistent iconography
- `cmdk`: Command palette/search component
- `vaul`: Drawer component primitive

**Development & Build Tools**
- `@vitejs/plugin-react`: React Fast Refresh and JSX transformation
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Replit-specific development tooling
- `esbuild`: Server-side code bundling for production
- `tsx`: TypeScript execution for development server

**Utilities**
- `clsx` + `tailwind-merge`: Conditional CSS class merging
- `date-fns`: Date manipulation and formatting
- `nanoid`: Short unique ID generation
- `zod`: Runtime type validation and schema parsing

**Blockchain Integration (Planned)**
- References to LI.FI and Socket.tech in design documentation
- No active integration in current codebase
- Intended for cross-chain swap functionality in the demo/widget

**CSS Processing**
- PostCSS with Tailwind CSS plugin
- Autoprefixer for vendor prefix management

**Type Safety**
- Strict TypeScript configuration with `"strict": true`
- Shared type definitions between client and server via `@shared/*` path alias
- Component prop types inferred from Radix UI primitives

### Pages and Navigation

**Home Page (`/`)**
- Sticky navigation header with logo, dropdown Solutions menu, and Sign in/Log in buttons
- Hero section with Three.js particle animation background
- "How it Works" section with Deposit/Withdraw toggle showing 3-step process
- "Why Ponia" section highlighting key benefits
- "Solutions" section with 3 category cards (Web3 games, Prediction markets/DeFi, NFT platforms)
- "Integration" section with code example
- "Stats" section with animated counters
- "Fees" section displaying 1.5% pricing
- "Roadmap" section
- Contact form with name, email/Discord, project URL, and message fields
- Footer with social links (Discord, X/Twitter in yellow) and documentation link

**Documentation Page (`/docs`)**
- Black background with sticky header containing "Back to home" button
- Documentation content starting with "⚡ Ponia Documentation"
- Sections:
  1. Introduction - Overview of Ponia and its core technology (LI.FI and Socket)
  2. How It Works - Key features explanation
  3. Integration - Widget installation guide with code example
  4. Pricing - 1.5% transaction fee details
  5. Support - Links to Discord and contact form

**Navigation Elements**
- Header: How it works, Solutions (dropdown), Integration, Fees, Docs, Sign in/Log in
- Solutions dropdown: Web3 Games, Prediction Markets & DeFi, NFT Apps
- Footer: Social icons (X, Discord), Docs link, Status link
- All "Docs" links navigate to `/docs` using wouter Link component