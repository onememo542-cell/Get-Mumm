# Requirements Document: ASP.NET Core Backend Migration

## Introduction

This document specifies the functional and non-functional requirements for migrating the Get Mumm backend from Node.js/Express with Drizzle ORM to C# ASP.NET Core with clean architecture principles. The migration maintains feature parity with the existing system while improving code organization, maintainability, and scalability through a 4-layer clean architecture pattern.

## Glossary

- **API_Server**: The ASP.NET Core web application serving REST endpoints
- **Presentation_Layer**: HTTP request handling and routing (GetMumm.Api project)
- **Application_Layer**: Business logic orchestration and validation (GetMumm.Application project)
- **Domain_Layer**: Core business entities and rules (GetMumm.Domain project)
- **Infrastructure_Layer**: Database access and external service integration (GetMumm.Infrastructure project)
- **Repository**: Generic data access pattern for entity persistence
- **Service**: Application layer component orchestrating business logic
- **DTO**: Data Transfer Object for request/response serialization
- **Entity**: Domain model representing persistent business concept
- **DbContext**: Entity Framework Core context managing database operations
- **PostgreSQL**: Primary relational database
- **Supabase**: Secondary data store for fire-and-forget contact data sync
- **FluentValidation**: Declarative validation library for DTOs
- **AutoMapper**: Object-to-object mapping library for DTO conversion
- **Serilog**: Structured logging library

## Requirements

### Requirement 1: Menu Item Retrieval

**User Story:** As a frontend client, I want to retrieve menu items with filtering and pagination capabilities, so that I can display categorized items to users efficiently.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/menu/items`, THE API_Server SHALL return a paginated list of MenuItemDto objects
2. WHEN a category filter is applied, THE API_Server SHALL return only menu items matching the specified category ID
3. WHEN a search filter is applied, THE API_Server SHALL return items matching the search term in name or name_ar fields
4. WHEN no results match the filters, THE API_Server SHALL return an empty collection with pagination metadata
5. WHEN page number is less than 1 or page size exceeds 100, THE API_Server SHALL return HTTP 400 Bad Request with validation error details
6. THE MenuService SHALL validate MenuItemFilterDto using FluentValidation before processing
7. THE Repository SHALL query only items where IsAvailable = true by default
8. WHEN pagination parameters are applied, THE API_Server SHALL respect Page and PageSize limits in the response

### Requirement 2: Featured Menu Items

**User Story:** As a frontend client, I want to quickly retrieve featured menu items, so that I can highlight special offerings to users.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/menu/items/featured`, THE API_Server SHALL return all menu items where IsFeatured = true
2. THE MenuService SHALL only return items where IsAvailable = true
3. THE API_Server SHALL return items sorted by creation date (newest first)
4. WHEN no featured items exist, THE API_Server SHALL return an empty collection
5. THE Presentation_Layer SHALL cache featured items in memory for 1 hour with automatic invalidation

### Requirement 3: Menu Categories

**User Story:** As a frontend client, I want to retrieve all menu categories, so that I can organize item display hierarchically.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/menu/categories`, THE API_Server SHALL return a complete list of CategoryDto objects
2. EACH CategoryDto SHALL include bilingual fields (Name and NameAr)
3. EACH CategoryDto SHALL include item_count representing active menu items in that category
4. THE Repository SHALL return categories ordered by creation date ascending
5. WHEN a category has no active items, THE API_Server SHALL include item_count = 0 in the response

### Requirement 4: Menu Item Details

**User Story:** As a frontend client, I want to retrieve detailed information about a specific menu item, so that I can display comprehensive item information.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/menu/items/{id}`, THE API_Server SHALL return a MenuItemDetailDto for the specified ID
2. IF the menu item ID does not exist, THE API_Server SHALL return HTTP 404 Not Found
3. EACH MenuItemDetailDto SHALL include associated Chef information via ChefDetailDto
4. THE API_Server SHALL include all dietary restrictions, pricing, and preparation time information
5. THE API_Server SHALL return the item regardless of IsAvailable status (show archived items when explicitly requested)

### Requirement 5: Chef Management

**User Story:** As a frontend client, I want to browse chefs and view their detailed profiles, so that I can understand who created each dish.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/chefs`, THE API_Server SHALL return all chefs ordered by Rating descending
2. EACH ChefDto SHALL include bilingual fields (Name and NameAr)
3. EACH ChefDto SHALL include Specialties array with bilingual descriptions
4. EACH ChefDto SHALL include ItemCount and Rating
5. WHEN the API_Server receives a GET request to `/api/chefs/{id}`, THE API_Server SHALL return ChefDetailDto including JoinedYear
6. IF the chef ID does not exist, THE API_Server SHALL return HTTP 404 Not Found
7. THE Repository SHALL return all chefs where IsDeleted = false

### Requirement 6: Contact Form Submission

**User Story:** As an end user, I want to submit a contact form, so that I can reach the business with inquiries.

#### Acceptance Criteria

1. WHEN the API_Server receives a POST request to `/api/contact` with valid SubmitContactRequest, THE API_Server SHALL persist the contact to PostgreSQL
2. WHEN contact is successfully created, THE API_Server SHALL asynchronously sync to Supabase (fire-and-forget)
3. THE ContactService SHALL validate Name, Email, Phone, Message, and Subject fields using FluentValidation
4. WHEN validation fails, THE API_Server SHALL return HTTP 400 Bad Request with detailed error messages for each invalid field
5. THE API_Server SHALL return HTTP 200 OK with success message upon successful submission
6. WHEN Supabase sync fails, THE API_Server SHALL NOT block the response (already sent to PostgreSQL)
7. THE Infrastructure_Layer SHALL log Supabase sync failures for monitoring

### Requirement 7: Office Catering Inquiry

**User Story:** As a business user, I want to submit office catering inquiries, so that I can request bulk meal services.

#### Acceptance Criteria

1. WHEN the API_Server receives a POST request to `/api/contact/office-inquiry` with valid SubmitOfficeInquiryRequest, THE API_Server SHALL persist to PostgreSQL
2. THE ContactService SHALL validate CompanyName, ContactName, Email, HeadCount, and Message fields
3. WHEN validation fails, THE API_Server SHALL return HTTP 400 Bad Request with specific field errors
4. THE API_Server SHALL asynchronously sync office inquiry to Supabase (fire-and-forget)
5. THE API_Server SHALL return HTTP 200 OK with success message
6. WHEN Supabase sync fails, THE API_Server SHALL log the error and not impact the HTTP response

### Requirement 8: Blog Post Listing

**User Story:** As a frontend client, I want to retrieve blog posts with pagination, so that I can display content in batches.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/blog`, THE API_Server SHALL return paginated BlogPostDto objects
2. THE API_Server SHALL support Page and PageSize query parameters
3. WHEN PageSize exceeds 100, THE API_Server SHALL default to 100
4. THE BlogService SHALL return only published posts (PublishStatus = Published)
5. THE API_Server SHALL return pagination metadata including Total count

### Requirement 9: Blog Post Details

**User Story:** As a frontend client, I want to retrieve individual blog posts by ID or slug, so that I can display full article content.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/blog/{id}`, THE API_Server SHALL return the BlogPostDetailDto
2. WHEN the API_Server receives a GET request to `/api/blog/slug/{slug}`, THE API_Server SHALL return the BlogPostDetailDto
3. IF the blog post does not exist, THE API_Server SHALL return HTTP 404 Not Found
4. THE BlogService SHALL only return published posts
5. EACH BlogPostDetailDto SHALL include all metadata (author, published date, content)

### Requirement 10: Testimonials Display

**User Story:** As a frontend client, I want to retrieve customer testimonials, so that I can display social proof.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/testimonials`, THE API_Server SHALL return a list of TestimonialDto objects
2. THE API_Server SHALL return testimonials ordered by creation date descending (newest first)
3. WHEN no testimonials exist, THE API_Server SHALL return an empty collection
4. EACH TestimonialDto SHALL include CustomerName, Rating, and Content fields

### Requirement 11: Subscriptions Management

**User Story:** As a frontend client, I want to manage user subscriptions, so that I can handle subscription lifecycle.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/subscriptions`, THE API_Server SHALL return available subscription plans
2. WHEN the API_Server receives a POST request to `/api/subscriptions`, THE API_Server SHALL create a new subscription
3. WHEN the API_Server receives a PUT request to `/api/subscriptions/{id}`, THE API_Server SHALL update the subscription
4. WHEN the API_Server receives a DELETE request to `/api/subscriptions/{id}`, THE API_Server SHALL mark subscription as canceled
5. THE SubscriptionService SHALL validate subscription data using FluentValidation
6. IF subscription ID does not exist, THE API_Server SHALL return HTTP 404 Not Found

### Requirement 12: System Statistics

**User Story:** As a frontend client, I want to retrieve system statistics, so that I can display analytics information.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/stats`, THE API_Server SHALL return system statistics
2. THE StatsService SHALL calculate total menu item count, chef count, and subscription count
3. THE API_Server SHALL return accurate aggregated data

### Requirement 13: Clean Architecture Layer Separation

**User Story:** As a developer, I want code organized in clean architecture layers, so that I can maintain and extend the codebase with minimal coupling.

#### Acceptance Criteria

1. THE Presentation_Layer SHALL only handle HTTP concerns (routing, serialization, status codes)
2. THE Application_Layer SHALL contain all business logic and service implementations
3. THE Domain_Layer SHALL contain only domain entities, enums, value objects, and business rules
4. THE Infrastructure_Layer SHALL contain database access, migrations, and external service clients
5. WHEN the Application_Layer needs database access, THE Application_Layer SHALL depend on repository interfaces only
6. WHEN the Infrastructure_Layer needs to implement repositories, THE Infrastructure_Layer SHALL implement interfaces defined in Domain_Layer
7. WHEN a service needs another service, THE service SHALL receive it via constructor injection (dependency inversion)
8. THE Presentation_Layer SHALL NOT directly reference Domain_Layer entities (use DTOs instead)

### Requirement 14: Repository Pattern Implementation

**User Story:** As a developer, I want generic repository pattern for data access, so that I can avoid code duplication.

#### Acceptance Criteria

1. THE Repository<T> generic class SHALL implement IRepository<T> interface
2. THE IRepository<T> interface SHALL define GetByIdAsync, GetAllAsync, FindAsync, CreateAsync, UpdateAsync, DeleteAsync methods
3. WHEN creating an entity via CreateAsync, THE Repository SHALL persist to database and assign ID
4. WHEN updating an entity via UpdateAsync, THE Repository SHALL persist changes atomically
5. WHEN deleting an entity via DeleteAsync, THE Repository SHALL remove the entity and return true on success
6. WHEN entity ID is less than 1, THE Repository SHALL throw ArgumentException
7. WHEN entity is null, THE Repository SHALL throw ArgumentNullException

### Requirement 15: FluentValidation Integration

**User Story:** As a developer, I want declarative validation for all DTOs, so that I can ensure data quality consistently.

#### Acceptance Criteria

1. THE API_Server SHALL use FluentValidation to validate all request DTOs
2. WHEN validation fails, THE Presentation_Layer middleware SHALL return HTTP 400 with detailed field-level errors
3. EACH validator class SHALL inherit from AbstractValidator<T>
4. WHEN a DTO violates validation rules, THE validator SHALL return specific error messages for each rule violation

### Requirement 16: AutoMapper Configuration

**User Story:** As a developer, I want automatic object mapping from entities to DTOs, so that I can reduce boilerplate code.

#### Acceptance Criteria

1. THE Application_Layer SHALL configure AutoMapper profiles for all entity-to-DTO mappings
2. WHEN a service converts Entity to DTO, THE service SHALL use IMapper.Map<TDestination>(source)
3. WHEN bidirectional mapping is needed, THE AutoMapper profile SHALL configure ForMember for specific field handling
4. THE Domain_Layer SHALL NOT directly reference DTOs (mapping only in Application_Layer)

### Requirement 17: Structured Logging with Serilog

**User Story:** As an operator, I want structured logs with correlation IDs, so that I can track requests end-to-end.

#### Acceptance Criteria

1. THE Presentation_Layer middleware SHALL log all HTTP requests using Serilog
2. EACH log entry SHALL include Timestamp, LogLevel, Message, and Exception (if applicable)
3. THE Infrastructure_Layer SHALL log database operations (queries, failures)
4. THE Application_Layer services SHALL log business logic transitions and errors
5. WHEN an exception occurs, THE Presentation_Layer middleware SHALL log with Error level including stack trace
6. THE Serilog sink SHALL write to both Console (development) and File (all environments)
7. WHEN log files reach daily boundary, THE Serilog FILE sink SHALL roll over to new file

### Requirement 18: Exception Handling Middleware

**User Story:** As a developer, I want centralized exception handling, so that I can return consistent error responses.

#### Acceptance Criteria

1. THE Presentation_Layer middleware SHALL catch all unhandled exceptions
2. WHEN ArgumentException or ArgumentNullException occurs, THE middleware SHALL return HTTP 400 Bad Request
3. WHEN KeyNotFoundException occurs, THE middleware SHALL return HTTP 404 Not Found
4. WHEN other exceptions occur, THE middleware SHALL return HTTP 500 Internal Server Error
5. EACH error response SHALL include Type, Message, TraceId, and Timestamp fields
6. WHEN ValidationException occurs, THE error response SHALL include detailed field-level Errors dictionary

### Requirement 19: Database Context with Entity Framework Core

**User Story:** As a developer, I want strongly-typed database access via DbContext, so that I can query safely with IntelliSense support.

#### Acceptance Criteria

1. THE Infrastructure_Layer SHALL define GetMummDbContext inheriting from DbContext
2. EACH entity SHALL have corresponding DbSet<T> property
3. THE DbContext OnModelCreating SHALL define all entity relationships using Fluent API
4. WHEN a MenuItem references Category, THE DbContext SHALL configure HasOne-WithMany relationship with Cascade delete
5. WHEN a MenuItem references Chef, THE DbContext SHALL configure HasOne-WithMany relationship with Cascade delete
6. WHEN an entity has IsDeleted field, THE DbContext SHALL apply HasQueryFilter to automatically exclude soft-deleted entities

### Requirement 20: PostgreSQL Migration Strategy

**User Story:** As a developer, I want to manage database schema changes using migrations, so that I can track and rollback changes safely.

#### Acceptance Criteria

1. THE Infrastructure_Layer SHALL use Entity Framework Core migrations
2. WHEN schema changes are made, THE developer SHALL create migration using `dotnet ef migrations add`
3. EACH migration file SHALL be version-controlled in Migrations folder
4. EACH migration SHALL have Up and Down methods for rollback capability
5. WHEN migrations are applied, THE Infrastructure_Layer SHALL use `dotnet ef database update`
6. WHEN creating table, THE migration SHALL include all columns with appropriate types and constraints
7. WHEN modifying schema, THE migration SHALL be idempotent (applying twice produces same result)

### Requirement 21: Supabase Integration with Fallback

**User Story:** As a system, I want to sync contact data to Supabase asynchronously, so that I can leverage real-time capabilities without blocking API responses.

#### Acceptance Criteria

1. THE Infrastructure_Layer ISupabaseService SHALL provide InsertContactAsync and InsertOfficeInquiryAsync methods
2. WHEN ContactService calls InsertContactAsync on ISupabaseService, THE call SHALL be fire-and-forget (non-blocking)
3. IF Supabase sync fails, THE Infrastructure_Layer SHALL log the error and continue operation
4. WHEN inserting contact, THE primary write SHALL go to PostgreSQL (required)
5. WHEN primary write succeeds and Supabase write fails, THE API_Server SHALL still return HTTP 200 OK
6. THE SupabaseService SHALL handle connection failures gracefully with retry logic in logs
7. WHEN SupabaseService initializes, THE SupabaseService SHALL use configuration values for Url and Key

### Requirement 22: Dependency Injection Configuration

**User Story:** As a developer, I want centralized DI setup in Program.cs, so that I can manage service lifetimes consistently.

#### Acceptance Criteria

1. THE Presentation_Layer Program.cs SHALL use ServiceCollectionExtensions for AddApplicationServices
2. THE Presentation_Layer Program.cs SHALL use ServiceCollectionExtensions for AddInfrastructureServices
3. WHEN registering repositories, THE DI SHALL register generic Repository<T> as scoped with IRepository<T>
4. WHEN registering services, THE DI SHALL register each service (MenuService, ChefsService, etc.) as scoped
5. WHEN registering DbContext, THE DI SHALL use PostgreSQL connection string from configuration
6. WHEN registering external services, THE DI SHALL register ISupabaseService as scoped

### Requirement 23: CORS Configuration

**User Story:** As an operator, I want to restrict cross-origin requests, so that I can prevent unauthorized frontend access.

#### Acceptance Criteria

1. THE Presentation_Layer middleware SHALL configure CORS policy named "AllowFrontend"
2. THE CORS policy SHALL only allow specified origins from configuration Cors:AllowedOrigins
3. THE CORS policy SHALL allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
4. THE CORS policy SHALL allow all request headers
5. THE CORS policy SHALL allow credentials in cross-origin requests
6. THE Presentation_Layer middleware SHALL apply CORS policy in request pipeline before routing

### Requirement 24: Configuration Management

**User Story:** As an operator, I want to manage configuration per environment, so that I can deploy to different environments with different settings.

#### Acceptance Criteria

1. THE Presentation_Layer appsettings.json SHALL define default configuration for all environments
2. THE Presentation_Layer appsettings.Development.json SHALL override settings for development environment
3. THE Presentation_Layer appsettings.Production.json SHALL override settings for production environment
4. WHEN configuration key exists in environment variables, THE Presentation_Layer SHALL use environment variable value
5. EACH environment file SHALL include ConnectionStrings, Database, Supabase, Cors, and Logging sections
6. WHEN loading configuration, THE Program.cs SHALL load files in order: default → environment-specific → environment variables

### Requirement 25: Async/Await Pattern

**User Story:** As a developer, I want all I/O operations to be asynchronous, so that I can handle concurrent requests efficiently.

#### Acceptance Criteria

1. WHEN Repository methods access database, THE Repository methods SHALL be marked async and return Task<T>
2. WHEN service methods call repository, THE service methods SHALL be marked async and return Task<T>
3. WHEN controller actions call services, THE controller actions SHALL be marked async and return Task<ActionResult>
4. ALL async methods SHALL accept CancellationToken parameter for graceful cancellation
5. WHEN awaiting async calls, THE code SHALL NOT use Result or Wait() (which block)

### Requirement 26: Request-Response Cycle Performance

**User Story:** As an operator, I want request-response to be fast, so that I can provide good user experience.

#### Acceptance Criteria

1. THE MenuService SHALL use .AsNoTracking() for read-only queries to reduce overhead
2. WHEN querying featured items, THE Presentation_Layer caching SHALL reduce database hits
3. WHEN returning large collections, THE API_Server SHALL enforce pagination (default 10, max 100 items)
4. WHEN selecting entities for response, THE service SHALL use Select() projection to return only needed fields
5. THE Infrastructure_Layer database indexes SHALL be created on frequently filtered columns (CategoryId, IsFeatured, IsAvailable)

### Requirement 27: Entity Soft Delete Pattern

**User Story:** As a developer, I want soft deletes for audit trail, so that I can maintain data history.

#### Acceptance Criteria

1. WHEN an entity is deleted, THE Repository SHALL set IsDeleted = true instead of removing the row
2. WHEN querying entities, THE DbContext query filter SHALL automatically exclude entities where IsDeleted = true
3. WHEN admin needs to see deleted entities, THE application SHALL provide explicit API to bypass soft delete filter
4. EACH entity with soft delete SHALL have IsDeleted field with default value false

### Requirement 28: Bilingual Support

**User Story:** As a frontend client, I want menu items and categories in both English and Arabic, so that I can display localized content.

#### Acceptance Criteria

1. EACH MenuItem entity SHALL have Name and NameAr fields for bilingual content
2. EACH Category entity SHALL have Name, NameAr, Description, and DescriptionAr fields
3. EACH Chef entity SHALL have Name, NameAr, Bio, BioAr, Specialties, and SpecialtiesAr fields
4. WHEN returning DTOs, THE API_Server SHALL include all bilingual fields in response
5. THE Database migration SHALL create both language fields as required (NOT NULL)

### Requirement 29: Unit Testing Framework Setup

**User Story:** As a developer, I want unit test infrastructure, so that I can verify service logic in isolation.

#### Acceptance Criteria

1. THE GetMumm.Tests project SHALL use xUnit as test framework
2. WHEN testing services, THE tests SHALL use Moq to mock IRepository<T> dependencies
3. THE test class SHALL have one [Fact] per specific behavior to test
4. WHEN mocking repository, THE test setup SHALL specify expected calls and return values
5. THE tests SHALL NOT depend on database (all data access mocked)

### Requirement 30: Integration Testing Infrastructure

**User Story:** As a developer, I want integration tests that exercise full request-response cycle, so that I can verify end-to-end behavior.

#### Acceptance Criteria

1. THE GetMumm.Tests project SHALL include integration tests using TestContainers for PostgreSQL
2. WHEN integration test runs, THE test environment SHALL spin up real PostgreSQL container
3. WHEN test completes, THE container SHALL be automatically torn down
4. THE integration test SHALL exercise controller → service → repository → database flow
5. THE integration test database SHALL be seeded with test data before each test

### Requirement 31: Property-Based Testing Coverage

**User Story:** As a developer, I want property-based tests for data validation, so that I can catch edge cases with generated inputs.

#### Acceptance Criteria

1. THE test framework for PBT SHALL be identified during implementation (fast-check or equivalent)
2. WHEN testing MenuItemFilterDto validation, THE PBT SHALL generate random page numbers and verify bounds checking
3. WHEN testing ContactRequest validation, THE PBT SHALL generate random strings and verify email format, length constraints
4. THE PBT tests SHALL run minimum 100 iterations per property to surface edge cases
5. EACH PBT test SHALL be tagged with feature name and property description

### Requirement 32: API Documentation

**User Story:** As a developer or API consumer, I want OpenAPI documentation, so that I can understand available endpoints and models.

#### Acceptance Criteria

1. THE Presentation_Layer controllers SHALL use XML comments on all public methods
2. THE controllers SHALL use [ProduceResponseType] attributes to document success and error responses
3. THE Presentation_Layer middleware SHALL integrate Swagger UI for interactive API documentation
4. WHEN accessing `/swagger/ui`, THE browser SHALL display interactive API documentation
5. EACH endpoint SHALL document request parameters, request body schema, response schema, and possible status codes

### Requirement 33: Deployment to App Service (MonsterASP)

**User Story:** As an operator, I want to deploy to MonsterASP (or Azure App Service), so that I can host the backend with reliable infrastructure and scalability.

#### Acceptance Criteria

1. THE Presentation_Layer SHALL be deployable to MonsterASP via FTP or Git
2. WHEN deployed to MonsterASP, THE application SHALL start and respond to HTTP requests
3. THE application configuration SHALL read connection strings and settings from environment variables or web.config
4. WHEN application starts, THE Entity Framework Core DbContext SHALL initialize and migrations SHALL apply
5. THE health check endpoint SHALL be available at /api/health for monitoring

### Requirement 34: Health Check Endpoint

**User Story:** As an operator, I want to check backend health, so that I can monitor service availability.

#### Acceptance Criteria

1. WHEN the API_Server receives a GET request to `/api/health`, THE API_Server SHALL return HTTP 200 OK
2. THE health check response SHALL include status "Healthy" or "Unhealthy"
3. WHEN database connection fails, THE health check SHALL return status "Unhealthy"
4. THE health check SHALL NOT be protected by authentication (always accessible)

### Requirement 35: Request Validation Pipeline

**User Story:** As a developer, I want automatic request validation, so that I can avoid manual null checks and format validation.

#### Acceptance Criteria

1. WHEN a controller action receives a request DTO, THE Presentation_Layer middleware SHALL validate using FluentValidation
2. IF validation fails, THE middleware SHALL intercept and return HTTP 400 before service method is called
3. THE error response SHALL include all validation error messages for each invalid field
4. WHEN no validator exists for a DTO, THE request SHALL proceed without validation
5. WHEN MaxModelValidationErrors is reached, THE middleware SHALL return HTTP 400 with truncated error list

### Requirement 36: Transaction Support

**User Story:** As a developer, I want transaction support for multi-step operations, so that I can maintain data consistency.

#### Acceptance Criteria

1. WHEN multiple repository operations occur in single service method, THE operations SHALL execute within single database transaction
2. IF any operation fails, THE transaction SHALL rollback all changes
3. IF all operations succeed, THE transaction SHALL commit atomically
4. THE DbContext SaveChangesAsync SHALL handle transaction lifecycle automatically
5. WHEN explicit transaction control needed, THE application SHALL support BeginTransactionAsync

### Requirement 37: Input Sanitization

**User Story:** As a system, I want to prevent SQL injection, so that I can secure database access.

#### Acceptance Criteria

1. WHEN Repository constructs queries, THE Repository SHALL use LINQ (never string concatenation)
2. WHEN Entity Framework Core executes query, THE parameters SHALL be parameterized automatically
3. WHEN user input contains SQL keywords, THE SQL keywords SHALL be safely escaped by EF Core
4. THE application SHALL NOT use raw SQL queries except for stored procedures with parameterization

### Requirement 38: Rate Limiting on Contact Endpoints

**User Story:** As an operator, I want to rate limit contact submissions, so that I can prevent spam and abuse.

#### Acceptance Criteria

1. WHEN contact form is submitted multiple times from same IP, THE API_Server SHALL track submission rate
2. IF submissions exceed 5 per hour from same IP, THE API_Server SHALL return HTTP 429 Too Many Requests
3. THE rate limit configuration SHALL be configurable via appsettings
4. WHEN rate limit is exceeded, THE error response SHALL include Retry-After header with seconds to wait

### Requirement 39: Deployment Configuration

**User Story:** As an operator, I want clear deployment instructions, so that I can reliably deploy to production.

#### Acceptance Criteria

1. THE project documentation SHALL include dotnet publish command for release build
2. THE documentation SHALL include EF Core migration commands for database preparation
3. THE documentation SHALL specify required environment variables for production
4. THE deployment process SHALL validate all required environment variables before starting application
5. THE documentation SHALL include rollback procedure for failed deployments

### Requirement 40: Code Coverage Target

**User Story:** As a developer, I want measurable code quality targets, so that I can maintain high code quality.

#### Acceptance Criteria

1. THE Application_Layer services SHALL have minimum 80% code coverage by unit tests
2. WHEN running test suite, THE coverage report SHALL be generated in LCOV format
3. WHEN PR is created, THE CI/CD pipeline SHALL fail if coverage drops below 80%
4. THE Infrastructure_Layer repositories SHALL have minimum 70% coverage (less critical due to EF Core testing)

