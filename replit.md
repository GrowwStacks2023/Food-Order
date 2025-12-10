# Restaurant Ordering Application

## Overview

A sophisticated restaurant ordering web application featuring an elegant editorial/magazine-style design. The application allows customers to browse menu categories, view products, add items to cart, and receive AI-powered meal recommendations. Built with React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for cart and theme state, TanStack Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for editorial/magazine aesthetic
- **Typography**: Playfair Display (serif headings) + Inter (body text) for upscale dining feel

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api` prefix
- **Storage Layer**: Abstracted storage interface in `server/storage.ts` with in-memory implementation
- **Database**: PostgreSQL configured via Drizzle ORM (schema in `shared/schema.ts`)

### Data Flow
1. Client fetches categories and menu items via TanStack Query
2. Cart state managed locally in React Context
3. When items are added, webhook triggers AI recommendations from external n8n service
4. Recommendations displayed in slide-in sidebar

### Key Design Patterns
- **Shared Schema**: Zod schemas in `shared/schema.ts` define types used by both frontend and backend
- **Component Composition**: UI built from composable shadcn/ui primitives
- **Context Providers**: CartProvider and ThemeProvider wrap the app for global state access

### Build System
- **Development**: `tsx` runs TypeScript directly for the server, Vite handles frontend HMR
- **Production**: Custom build script bundles server with esbuild, frontend with Vite

## External Dependencies

### Database
- **PostgreSQL**: Primary database configured via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit for schema management and queries
- **Drizzle Kit**: Migration tool (`db:push` command for schema sync)

### Third-Party Services
- **AI Recommendations Webhook**: External n8n automation service at `https://n8nadmin.1automation.us/webhook/...` receives cart data and returns product recommendations

### Key NPM Packages
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives for shadcn components
- **wouter**: Minimal React router
- **zod**: Runtime type validation for API requests/responses
- **drizzle-orm** / **drizzle-zod**: Database ORM with Zod schema integration