# Get Mumm - ASP.NET Core Backend

A modern ASP.NET Core 8 backend for the Get Mumm restaurant application, built with clean architecture principles.

## Project Structure

```
GetMumm.Backend/
├── GetMumm.Api/                    # Presentation Layer - ASP.NET Core Controllers & Web API
│   ├── Controllers/                # REST API endpoints
│   ├── Middleware/                 # Custom middleware (validation, error handling, logging)
│   ├── Program.cs                  # Startup configuration & DI setup
│   └── appsettings.*.json         # Configuration for different environments
├── GetMumm.Application/            # Application Layer - Business Logic & Services
│   ├── Services/                   # Application services (MenuService, ContactService, etc.)
│   ├── DTOs/                       # Data transfer objects (request/response models)
│   ├── Validators/                 # FluentValidation validators
│   ├── Mappings/                   # AutoMapper profiles
│   └── Interfaces/                 # Service contracts
├── GetMumm.Domain/                 # Domain Layer - Core Business Entities
│   ├── Entities/                   # Domain models (MenuItem, Chef, Category, etc.)
│   ├── Enums/                      # Enumeration types (PublishStatus, DietaryRestriction, etc.)
│   ├── Interfaces/                 # Repository & UnitOfWork contracts
│   └── Exceptions/                 # Domain-specific exceptions
├── GetMumm.Infrastructure/         # Infrastructure Layer - Data Access & External Services
│   ├── Data/
│   │   ├── Contexts/               # Entity Framework DbContext
│   │   ├── Repositories/           # Generic repository implementations
│   │   └── Migrations/             # EF Core migrations
│   ├── ExternalServices/           # Supabase client wrapper
│   ├── Configuration/              # DI configuration extensions
│   └── Logging/                    # Structured logging setup
└── GetMumm.Tests/                  # Testing Project
    ├── UnitTests/                  # Unit tests (mocked dependencies)
    ├── IntegrationTests/           # Integration tests (real database via TestContainers)
    ├── PropertyTests/              # Property-based tests (fast-check)
    └── Fixtures/                   # Test fixtures & helpers
```

## Architecture

The backend follows **Clean Architecture** principles with 4 layers:

1. **Presentation Layer** (GetMumm.Api)
   - HTTP request handling and routing
   - REST endpoint definitions
   - Middleware pipeline (validation, error handling, logging, CORS)
   - Swagger/OpenAPI documentation

2. **Application Layer** (GetMumm.Application)
   - Business logic orchestration
   - Service implementations
   - Request/response DTOs
   - FluentValidation validators
   - AutoMapper profiles
   - No database dependencies (uses repository interfaces)

3. **Domain Layer** (GetMumm.Domain)
   - Core business entities (MenuItem, Chef, Category, etc.)
   - Business rules and invariants
   - Domain enums and value objects
   - Repository and service interfaces
   - No external dependencies

4. **Infrastructure Layer** (GetMumm.Infrastructure)
   - Entity Framework Core DbContext
   - Generic repository implementations
   - Database migrations
   - Supabase client wrapper
   - Serilog logging configuration
   - Dependency injection setup

## Prerequisites

- .NET 8.0 SDK or later
- PostgreSQL 12+ database
- (Optional) Docker for local PostgreSQL

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install .NET Dependencies

```bash
dotnet restore
```

### 3. Configure Database

Create a PostgreSQL database:

```bash
# Using psql
createdb getmumm_dev
```

Or use Docker:

```bash
docker run --name getmumm-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:latest
docker exec -it getmumm-postgres createdb -U postgres getmumm_dev
```

### 4. Update Connection String

Edit `GetMumm.Api/appsettings.Development.json` and set the PostgreSQL connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=getmumm_dev;Username=postgres;Password=postgres"
  }
}
```

### 5. Apply Database Migrations

```bash
cd GetMumm.Api
dotnet ef database update
cd ..
```

### 6. Run the Application

```bash
dotnet run --project GetMumm.Api
```

The API will be available at `https://localhost:5001` with Swagger UI at `https://localhost:5001/swagger/ui`

## Running Tests

### Unit Tests

```bash
dotnet test GetMumm.Tests -- --filter "Category=UnitTest"
```

### Integration Tests

```bash
dotnet test GetMumm.Tests -- --filter "Category=IntegrationTest"
```

### Property-Based Tests

```bash
dotnet test GetMumm.Tests -- --filter "Category=PropertyTest"
```

### All Tests

```bash
dotnet test
```

## Available Endpoints

### Menu
- `GET /api/menu/categories` - List all categories
- `GET /api/menu/items` - List menu items (with filtering and pagination)
- `GET /api/menu/items/featured` - Get featured items
- `GET /api/menu/items/{id}` - Get item details

### Chefs
- `GET /api/chefs` - List all chefs
- `GET /api/chefs/{id}` - Get chef details

### Contact
- `POST /api/contact` - Submit contact form
- `POST /api/contact/office-inquiry` - Submit office inquiry

### Blog
- `GET /api/blog` - List blog posts
- `GET /api/blog/{id}` - Get blog post by ID
- `GET /api/blog/slug/{slug}` - Get blog post by slug

### Subscriptions
- `GET /api/subscriptions` - List subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/{id}` - Update subscription
- `DELETE /api/subscriptions/{id}` - Cancel subscription

### System
- `GET /api/stats` - Get system statistics
- `GET /api/testimonials` - List testimonials
- `GET /api/health` - Health check

## Environment Configuration

### Development (appsettings.Development.json)
- Debug logging enabled
- Local PostgreSQL connection
- CORS allows localhost

### Production (appsettings.Production.json)
- Info-level logging to file
- Connection string from environment variables
- CORS restricted to production domain

### Environment Variables

```
ASPNETCORE_ENVIRONMENT=Development|Production
ASPNETCORE_URLS=https://localhost:5001
ConnectionStrings__DefaultConnection=<postgres-connection-string>
Supabase__Url=<supabase-url>
Supabase__Key=<supabase-key>
Cors__AllowedOrigins=<comma-separated-origins>
```

## Database Migrations

### Create a New Migration

```bash
cd GetMumm.Api
dotnet ef migrations add MigrationName
cd ..
```

### Apply Migrations

```bash
cd GetMumm.Api
dotnet ef database update
cd ..
```

### Revert to Previous Migration

```bash
cd GetMumm.Api
dotnet ef migrations remove
cd ..
```

### Generate SQL Script (for manual deployment)

```bash
cd GetMumm.Api
dotnet ef migrations script > migration.sql
cd ..
```

## Key Features

✅ **Clean Architecture** - Clear layer separation with dependency inversion
✅ **Async/Await** - All I/O operations are fully asynchronous
✅ **Dependency Injection** - Centralized DI configuration in Program.cs
✅ **FluentValidation** - Declarative request validation with middleware
✅ **AutoMapper** - Automatic entity-to-DTO mapping
✅ **Structured Logging** - Serilog with file and console outputs
✅ **Entity Framework Core** - Type-safe database access with LINQ
✅ **PostgreSQL** - Industry-standard relational database
✅ **Soft Deletes** - Automatic soft delete filtering
✅ **Rate Limiting** - Contact endpoint rate limiting (5 requests/hour per IP)
✅ **Error Handling** - Centralized exception middleware
✅ **CORS Configuration** - Flexible origin control
✅ **Swagger/OpenAPI** - Interactive API documentation
✅ **Health Checks** - Endpoint monitoring capability
✅ **Supabase Integration** - Fire-and-forget contact data sync

## Troubleshooting

### Database Connection Issues

Verify PostgreSQL is running and accessible:

```bash
psql -h localhost -U postgres -d getmumm_dev
```

### Migration Errors

Clear EF Core cache and retry:

```bash
cd GetMumm.Api
dotnet ef migrations remove --force
dotnet ef database update
cd ..
```

### Port Already in Use

Change the port in `appsettings.Development.json`:

```json
{
  "Logging": {...},
  "ASPNETCORE_URLS": "https://localhost:5002"
}
```

## Performance Optimization

- **Pagination**: Menu items limited to 100 items per request
- **Caching**: Featured items cached in-memory (1 hour TTL)
- **Database Indexes**: Created on frequently filtered columns
- **Async I/O**: All database and API calls are non-blocking
- **Query Optimization**: Use .AsNoTracking() for read-only queries

## Security Best Practices

- ✅ All SQL via LINQ (parameterized)
- ✅ Input validation on all requests
- ✅ CORS configured per environment
- ✅ Error responses don't expose internals
- ✅ Rate limiting on contact endpoints
- ✅ Environment-specific configuration (secrets not in code)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `dotnet test`
4. Commit: `git commit -am 'Add new feature'`
5. Push: `git push origin feature/your-feature`
6. Create pull request

## License

See LICENSE file in repository root.
