# Architecture Overview

## System Design

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │         │    Backend   │         │  PostgreSQL  │
│  React 19   │◄────────│ASP.NET Core 8│◄────────│   Database   │
│   + Vite    │  HTTP   │              │  SQL    │              │
└─────────────┘         └──────────────┘         └──────────────┘
  Port 5173              Port 5001                 Port 5432

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
- ASP.NET Core 8 (REST API)
- Entity Framework Core (type-safe database access)
- PostgreSQL (data storage)
- FluentValidation (schema validation)
- C# (type safety)

**Structure (Clean Architecture):**
```
backend/
├── GetMumm.Api/            # Presentation Layer (Controllers)
├── GetMumm.Application/    # Application Layer (Services & DTOs)
├── GetMumm.Domain/         # Domain Layer (Entities & Interfaces)
├── GetMumm.Infrastructure/ # Infrastructure Layer (EF Core & Data)
└── GetMumm.Tests/          # Test Projects
```

**API Endpoints:**
- `GET /api/menu` - Get menu items
- `GET /api/chefs` - Get chefs
- `GET /api/blog` - Get blog posts
- `POST /api/contact` - Contact form
- `GET /api/subscriptions` - Get subscription plans
- `GET /health` - Health check

**Database Schema:**
- `MenuItems` - Menu items with prices & dietary info
- `Chefs` - Chef profiles
- `BlogPosts` - Blog content
- `ContactSubmissions` - Contact form submissions
- `Subscriptions` - Subscription plans
- See `backend/GetMumm.Infrastructure/Migrations/` for full schema

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

### Backend (RunAsp.net / IIS)
- Build: `dotnet build`
- Output: `bin/Release/net8.0/`
- Server: ASP.NET Core Kestrel / IIS

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
3. Entity Framework Core transforms data
4. ASP.NET Core API returns JSON
5. React Query caches response
6. UI renders with Tailwind CSS
```

### User Submits Contact Form
```
1. Frontend sends: POST /api/contact (form data)
2. API validates with FluentValidation
3. Backend inserts into database via EF Core
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
- ExceptionHandlingMiddleware
- FluentValidation errors
- Database error logging via Serilog
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
- Input validation with FluentValidation
- SQL injection prevention (EF Core)
- CORS configuration
- Rate limiting ready

**Tests:**
- SQL injection tests
- XSS payload tests
- Invalid data validation

See [Security Policy](../.github/SECURITY.md) for details.
