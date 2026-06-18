# Architecture Overview

## System Design

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │         │    Backend   │         │  PostgreSQL  │
│  React 19   │◄────────│  Express.js  │◄────────│   Database   │
│   + Vite    │  HTTP   │              │  SQL    │              │
└─────────────┘         └──────────────┘         └──────────────┘
  Port 5173              Port 3001                 Port 5432

       ▼
   Tests (Pytest)
   - UI (Playwright)
   - API (aiohttp)
   - Database (psycopg2)
```

## Frontend Architecture

**Tech Stack:**
- React 19 (with Hooks)
- Vite (bundler)
- Tailwind CSS v4 (styling)
- Framer Motion (animations)
- React Query (data fetching)
- Wouter (client-side routing)

**Structure:**
```
frontend/src/
├── components/    # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── services/      # API calls
├── styles/        # Global styles
├── types/         # TypeScript types
└── main.tsx       # Entry point
```

**Key Features:**
- Mobile-first responsive design
- Bilingual (English/Arabic RTL)
- Real-time data updates via React Query
- Smooth animations with Framer Motion

## Backend Architecture

**Tech Stack:**
- Node.js + Express (REST API)
- Drizzle ORM (type-safe database)
- PostgreSQL (data storage)
- Zod (schema validation)
- TypeScript (type safety)

**Structure:**
```
backend/src/
├── routes/         # API endpoints
├── services/       # Business logic
├── repositories/   # Data access layer
├── db/             # Database config & migrations
├── middlewares/    # Express middlewares
├── lib/            # Utilities
├── types/          # TypeScript types
└── index.ts        # Server entry point
```

**API Endpoints:**
- `GET /api/menu` - Get menu items
- `GET /api/chefs` - Get chefs
- `GET /api/blog` - Get blog posts
- `POST /api/contact` - Contact form
- `GET /api/subscriptions` - Get subscription plans
- `GET /health` - Health check

**Database Schema:**
- `menu_items` - Menu items with prices & dietary info
- `chefs` - Chef profiles
- `blog_posts` - Blog content
- `contact_submissions` - Contact form submissions
- `subscriptions` - Subscription plans
- See `backend/migrations/` for full schema

## Testing Architecture

**Test Layers:**

1. **UI Tests** (Playwright)
   - Page objects for abstraction
   - 105+ tests across 7 pages
   - Screenshots on failure
   - Viewport: 1280x720

2. **API Tests** (aiohttp)
   - HTTP client with auth support
   - 83+ tests for all endpoints
   - Error handling validation
   - Request/response logging

3. **Database Tests** (psycopg2)
   - Schema validation
   - Transaction isolation
   - Data seeding
   - 56+ tests

**Test Infrastructure:**
- Pytest test runner
- Docker Compose for isolation
- Fixtures for setup/teardown
- Allure reporting
- GitHub Actions CI/CD

## Deployment

### Frontend (Netlify)
- Build: `npm run build`
- Output: `dist/`
- Environment: `.env.local`

### Backend (Vercel)
- Build: `npm run build`
- Output: `dist/`
- Serverless functions: `api/index.mjs`

### Database (Production PostgreSQL)
- Managed PostgreSQL instance
- Connection pooling
- Automated backups

See [Deployment Guide](./DEPLOYMENT.md) for details.

## Data Flow

### User Views Menu
```
1. Frontend requests: GET /api/menu
2. Backend queries database
3. Drizzle ORM transforms data
4. Express returns JSON
5. React Query caches response
6. UI renders with Tailwind CSS
```

### User Submits Contact Form
```
1. Frontend sends: POST /api/contact (form data)
2. Express validates with Zod
3. Backend inserts into database
4. Transaction commits
5. Success response sent
6. Frontend shows confirmation
```

## Error Handling

**Frontend:**
- React error boundaries
- User-friendly error messages
- Fallback UI

**Backend:**
- Express error middleware
- Zod validation errors
- Database error logging
- HTTP status codes

**Tests:**
- Custom exception classes
- Detailed error logging
- Screenshots on UI failures
- API response validation

## Performance Considerations

**Frontend:**
- Code splitting with Vite
- Image optimization
- Lazy loading of routes
- React Query caching

**Backend:**
- Database query optimization
- Connection pooling
- Caching strategies
- Compression middleware

**Tests:**
- Parallel execution (4 workers)
- Transaction isolation (no cleanup)
- Browser context reuse
- Session-scoped fixtures

## Security

**Frontend:**
- Input validation
- XSS prevention
- HTTPS only

**Backend:**
- Input validation with Zod
- SQL injection prevention (ORM)
- CORS configuration
- Rate limiting ready

**Tests:**
- SQL injection tests
- XSS payload tests
- Invalid data validation

See [Security Policy](../.github/SECURITY.md) for details.
