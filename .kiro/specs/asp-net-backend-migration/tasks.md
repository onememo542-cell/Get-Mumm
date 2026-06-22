# Implementation Plan: ASP.NET Core Backend Migration

## Overview

This implementation plan breaks down the migration from Node.js/Express backend to ASP.NET Core with clean architecture into seven sequential phases. Each phase builds on the previous, progressing from foundation infrastructure through domain entities, business logic, data access, API endpoints, testing, and finally deployment configuration. The plan follows the 4-layer architecture: Presentation (Controllers) → Application (Services) → Domain (Entities) → Infrastructure (Database).

---

## Phase 1: Project Setup & Infrastructure (Foundation)

- [x] 1. Create ASP.NET Core project structure and configuration
  - Create four class library projects: GetMumm.Domain, GetMumm.Application, GetMumm.Infrastructure, GetMumm.Tests
  - Create GetMumm.Api ASP.NET Core web API project
  - Set up project file structure with folders: Controllers/, Services/, Entities/, DTOs/, Validators/, Repositories/
  - Add NuGet packages: EF Core, Npgsql, FluentValidation, AutoMapper, Serilog
  - Configure solution file with project references and dependencies
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 2. Configure dependency injection and Program.cs setup
  - Create ServiceCollectionExtensions class for AddApplicationServices()
  - Create ServiceCollectionExtensions class for AddInfrastructureServices()
  - Implement middleware pipeline configuration in Program.cs
  - Set up Serilog logging configuration
  - Configure CORS policy named "AllowFrontend"
  - Add Controllers and JsonOptions configuration
  - _Requirements: 22, 23, 17_

- [x] 3. Configure application settings and environment files
  - Create appsettings.json with default configuration (ConnectionStrings, Database, Supabase, Cors, Logging sections)
  - Create appsettings.Development.json with development overrides
  - Create appsettings.Production.json with production overrides
  - Add configuration models: DatabaseSettings, SupabaseSettings, CorsSettings
  - Implement IConfiguration binding to strongly-typed classes
  - _Requirements: 24_

- [x] 4. Set up database context and EF Core
  - Create GetMummDbContext class inheriting from DbContext
  - Configure DbSet properties for all entities (Category, MenuItem, Chef, BlogPost, Contact, OfficeInquiry, Subscription, Testimonial)
  - Implement OnModelCreating with Fluent API for entity relationships
  - Configure one-to-many relationships with cascade delete behavior
  - Add query filters for soft-deleted entities
  - Add database indexes on frequently filtered columns (CategoryId, IsFeatured, IsAvailable, CreatedAt)
  - _Requirements: 19, 26_

- [x] 5. Create generic repository pattern
  - Define IRepository<T> interface with GetByIdAsync, GetAllAsync, FindAsync, CreateAsync, UpdateAsync, DeleteAsync methods
  - Implement generic Repository<T> class with full async/await support
  - Add CancellationToken support to all repository methods
  - Implement input validation (throw ArgumentException for invalid IDs, ArgumentNullException for null entities)
  - Configure Repository<T> to accept IQueryable with expression predicates
  - _Requirements: 14, 25_

- [x] 6. Create exception handling middleware and custom exceptions
  - Define ApplicationException base class with StatusCode property
  - Create NotFoundException, BadRequestException, ValidationException derived classes
  - Implement ExceptionHandlingMiddleware to catch and format exceptions
  - Configure middleware to map exceptions to appropriate HTTP status codes
  - Create ErrorResponse DTO with Type, Message, Errors, TraceId, Timestamp fields
  - Register middleware in Program.cs pipeline
  - _Requirements: 18_

- [ ] 7. Set up health check endpoint
  - Create HealthController with GET /api/health endpoint
  - Implement health check response with status field ("Healthy" or "Unhealthy")
  - Add database connectivity check
  - Configure endpoint to return HTTP 200 with status
  - _Requirements: 34_

- [ ] 8. Initialize database migrations infrastructure
  - Create Migrations folder in Infrastructure project
  - Set up EF Core migrations assembly in DbContext configuration
  - Document migration commands and processes
  - Prepare migration generation and application commands
  - _Requirements: 20_

---

## Phase 2: Domain Layer (Core Entities)

- [x] 1. Define core domain entities and value objects
  - Create MenuItem entity with properties: Id, Name, NameAr, Description, DescriptionAr, Price, CategoryId, CategoryName, CategoryNameAr, ImageUrl, Dietary[], IsAvailable, IsFeatured, ChefName, ChefNameAr, Rating, PrepTimeMinutes, CreatedAt
  - Create Category entity with properties: Id, Name, NameAr, Description, DescriptionAr, ImageUrl, ItemCount, CreatedAt
  - Create Chef entity with properties: Id, Name, NameAr, Bio, BioAr, ImageUrl, Specialties[], SpecialtiesAr[], ItemCount, Rating, JoinedYear, CreatedAt
  - Create BlogPost entity with properties: Id, Title, TitleAr, Content, ContentAr, AuthorName, AuthorNameAr, Slug, PublishStatus, PublishedAt, CreatedAt
  - Add navigation properties for relationships (e.g., MenuItem.Category, MenuItem.Chef)
  - _Requirements: 28, 1, 4, 5_

- [ ] 2. Define contact and inquiry entities
  - Create Contact entity with properties: Id, Name, Email, Phone, Message, Subject, CreatedAt
  - Create OfficeInquiry entity with properties: Id, CompanyName, ContactName, Email, Phone, HeadCount, DeliveryArea, Frequency, Message, CreatedAt
  - Configure both entities for database persistence
  - _Requirements: 6, 7_

- [ ] 3. Define additional domain entities
  - Create Subscription entity with properties: Id, UserId, Type, StartDate, EndDate, Status, CreatedAt
  - Create Testimonial entity with properties: Id, CustomerName, Rating, Content, CreatedAt
  - Add appropriate navigation and field validation
  - _Requirements: 10, 11_

- [ ] 4. Implement soft delete pattern across entities
  - Add IsDeleted field to all domain entities (default value: false)
  - Configure DbContext query filters to automatically exclude soft-deleted entities from queries
  - Ensure Repository.DeleteAsync sets IsDeleted = true instead of removing row
  - _Requirements: 27_

- [ ] 5. Create domain enums and constants
  - Create PublishStatus enum: Draft, Published, Archived
  - Create DietaryRestriction enum: Vegetarian, Vegan, GlutenFree, NutFree
  - Create SubscriptionType enum: Monthly, Quarterly, Annual
  - Create SubscriptionStatus enum: Active, Paused, Canceled
  - Create ContactStatus enum: New, Reviewed, Responded
  - _Requirements: 28_

---

## Phase 3: Application Layer (Services & Validation)

- [ ] 1. Create validators using FluentValidation
  - Create SubmitContactRequestValidator with rules: Name required (max 100), Email required (valid format), Phone optional (regex format), Message required (min 10 chars), Subject required (max 200)
  - Create SubmitOfficeInquiryRequestValidator with rules: CompanyName required, ContactName required, Email valid format, HeadCount > 0, Message required
  - Create MenuItemFilterDtoValidator with rules: Page > 0, PageSize > 0 and ≤ 100
  - Register all validators in DI container
  - _Requirements: 15, 6, 7, 1_

- [ ] 2. Create AutoMapper configuration and profiles
  - Create MappingProfile class inheriting from Profile
  - Configure mappings: MenuItem → MenuItemDto, MenuItem → MenuItemDetailDto
  - Configure mappings: Category → CategoryDto
  - Configure mappings: Chef → ChefDto, Chef → ChefDetailDto
  - Configure mappings: BlogPost → BlogPostDto, BlogPost → BlogPostDetailDto
  - Configure mappings: Contact request → Contact entity, OfficeInquiry request → OfficeInquiry entity
  - Register AutoMapper in DI container
  - _Requirements: 16_

- [ ] 3. Create MenuItem and Category Service
  - Implement IMenuService interface with methods: GetCategoriesAsync, GetMenuItemsAsync, GetFeaturedItemsAsync, GetMenuItemByIdAsync
  - Implement MenuService with business logic for filtering, pagination, featured items
  - Implement filtering logic: validate CategoryId matches, search in Name/NameAr fields, check IsAvailable
  - Implement pagination: skip/take based on Page and PageSize parameters
  - Use AutoMapper for entity-to-DTO conversion
  - _Requirements: 1, 2, 3, 4, 26_

- [ ] 4. Create Chef Service
  - Implement IChefsService interface with methods: GetAllChefsAsync, GetChefByIdAsync
  - Implement ChefsService to retrieve chefs ordered by Rating descending
  - Use AutoMapper to convert Chef entities to ChefDto
  - Handle null cases (return null if chef not found)
  - _Requirements: 5_

- [ ] 5. Create Contact Service
  - Implement IContactService interface with methods: SubmitContactAsync, SubmitOfficeInquiryAsync
  - Implement ContactService to persist Contact and OfficeInquiry to PostgreSQL via repository
  - Implement fire-and-forget async sync to Supabase using Task.Run() or similar
  - Ensure PostgreSQL write completes before returning response
  - Ensure Supabase sync failure does not block response
  - Use FluentValidation for input validation
  - _Requirements: 6, 7, 21_

- [ ] 6. Create Blog Service
  - Implement IBlogService interface with methods: GetBlogPostsAsync, GetBlogPostByIdAsync, GetBlogPostBySlugAsync
  - Implement BlogService to return only published posts (PublishStatus = Published)
  - Support pagination with configurable page size (default 10, max 100)
  - Use AutoMapper for entity-to-DTO conversion
  - _Requirements: 8, 9_

- [ ] 7. Create Testimonials and Stats Service
  - Implement ITestimonialService with GetTestimonialsAsync method
  - Return testimonials ordered by creation date descending (newest first)
  - Implement IStatsService with GetStatsAsync method
  - Calculate and return: total menu items count, chef count, subscription count
  - _Requirements: 10, 12_

- [ ] 8. Create Subscriptions Service
  - Implement ISubscriptionService interface with methods: GetAllAsync, GetByIdAsync, CreateAsync, UpdateAsync, CancelAsync
  - Implement SubscriptionService with CRUD operations
  - Use repository for database persistence
  - Use FluentValidation for subscription data validation
  - _Requirements: 11_

- [ ] 9. Create request and response DTOs
  - Create MenuItemFilterDto with properties: CategoryId?, Search, Page, PageSize
  - Create SubmitContactRequest DTO
  - Create SubmitOfficeInquiryRequest DTO
  - Create list/detail response DTOs: ListCategoriesResponse, ListMenuItemsResponse, ListChefsResponse, GetMenuItemResponse, GetChefResponse
  - Create PaginatedResult<T> generic response wrapper with Data, Total, Page, PageSize, PaginationMetadata
  - _Requirements: 1, 6, 7, 8_

- [ ] 10. Configure service registration in DI
  - Register IMenuService → MenuService as scoped
  - Register IChefsService → ChefsService as scoped
  - Register IContactService → ContactService as scoped
  - Register IBlogService → BlogService as scoped
  - Register ISubscriptionService → SubscriptionService as scoped
  - Register ITestimonialService → TestimonialService as scoped
  - Register IStatsService → StatsService as scoped
  - _Requirements: 22_

- [ ]* 11. Write property tests for service validation logic
  - **Property 1: MenuItemFilter bounds checking**
  - **Validates: Requirements 1.5**
  - Test: Generate random Page and PageSize values, verify bounds are enforced (Page > 0, PageSize ≤ 100)
  - Test framework: fast-check or Property.Forall
  - Minimum 100 test iterations

- [ ]* 12. Write unit tests for service layer methods
  - Test MenuService.GetMenuItemsAsync with mocked repository
  - Test MenuService filtering logic with various CategoryId and search terms
  - Test MenuService pagination (verify skip/take applied correctly)
  - Test ChefsService ordering by rating descending
  - Test ContactService validation before persistence
  - _Requirements: 29_

---

## Phase 4: Infrastructure Layer (Database & External Services)

- [x] 1. Create Supabase client wrapper
  - Implement ISupabaseService interface with methods: InsertContactAsync, InsertOfficeInquiryAsync
  - Implement SupabaseService with Supabase client initialization
  - Load Supabase Url and Key from configuration
  - Implement exception handling and logging for Supabase operations
  - Implement fire-and-forget async pattern (non-blocking calls)
  - _Requirements: 21_

- [ ] 2. Create initial database migration
  - Create migration: "InitialCreate" with all entity table definitions
  - Define Categories table with columns: id (PK), name, name_ar, description, description_ar, image_url, item_count, created_at, is_deleted
  - Define MenuItems table with columns: id (PK), category_id (FK), chef_id (FK), name, name_ar, description, description_ar, price, dietary[], image_url, is_available, is_featured, rating, prep_time_minutes, created_at, is_deleted
  - Define Chefs table with columns: id (PK), name, name_ar, bio, bio_ar, image_url, specialties[], specialties_ar[], item_count, rating, joined_year, created_at, is_deleted
  - Define BlogPosts, Contacts, OfficeInquiries, Subscriptions, Testimonials tables
  - Apply foreign key constraints with cascade delete
  - Apply unique constraints on natural keys (e.g., slug for BlogPost)
  - _Requirements: 20, 28_

- [ ] 2. Create database indexes for performance
  - Create index on MenuItem.CategoryId for fast category filtering
  - Create index on MenuItem.IsFeatured for featured items query
  - Create index on MenuItem.IsAvailable for availability filtering
  - Create index on Contact.CreatedAt for sorting
  - Create index on BlogPost.PublishStatus for publish status filtering
  - _Requirements: 26_

- [ ] 3. Configure logging infrastructure
  - Set up Serilog with Console and File sinks
  - Configure logging to write to logs/app-.txt with daily rolling intervals
  - Configure JSON formatting for structured logs
  - Add enrichers: FromLogContext, WithMachineName, WithThreadId
  - Configure log levels per namespace (Microsoft: Warning, Others: Information)
  - _Requirements: 17_

- [ ] 4. Implement caching service (optional but recommended)
  - Create ICacheService interface with GetOrSetAsync, GetAsync, SetAsync, RemoveAsync methods
  - Implement in-memory cache using IMemoryCache
  - Implement cache invalidation strategy
  - Use for caching categories and featured items (1 hour expiration)
  - _Requirements: 2, 26_

- [ ] 5. Create rate limiting infrastructure
  - Implement rate limiting for contact endpoints
  - Track requests by IP address
  - Implement limit: 5 submissions per hour per IP
  - Return HTTP 429 Too Many Requests with Retry-After header when exceeded
  - Make rate limit configurable via appsettings
  - _Requirements: 38_

- [ ] 6. Register infrastructure services in DI
  - Register DbContext with PostgreSQL connection string
  - Register ISupabaseService → SupabaseService as scoped
  - Register ICacheService → CacheService as scoped
  - Register IRepository<T> → Repository<T> as scoped (generic)
  - _Requirements: 22, 21_

- [ ]* 7. Write integration tests with TestContainers
  - Set up xUnit with TestContainers for PostgreSQL
  - Create PostgresContainerFixture for spinning up test database
  - Create test database seeding with sample data
  - Test repository operations: GetByIdAsync, GetAllAsync, CreateAsync, UpdateAsync, DeleteAsync
  - Test soft delete behavior (IsDeleted filter)
  - Test transaction rollback on error
  - _Requirements: 30, 36_

---

## Phase 5: Presentation Layer (Controllers & Middleware)

- [x] 1. Create MenuController with endpoints
  - Implement MenuController inheriting from ControllerBase
  - Implement GET /api/menu/categories endpoint returning ListCategoriesResponse
  - Implement GET /api/menu/items with MenuItemFilterDto query parameters
  - Implement GET /api/menu/items/featured endpoint returning featured items
  - Implement GET /api/menu/items/{id} endpoint with item detail response
  - Apply [HttpGet], [ProduceResponseType] attributes for documentation
  - Inject IMenuService via constructor
  - _Requirements: 1, 2, 3, 4, 32_

- [ ] 2. Create ChefsController with endpoints
  - Implement ChefsController with GET /api/chefs endpoint
  - Implement GET /api/chefs/{id} endpoint with chef details
  - Return 404 when chef not found
  - Apply [ProduceResponseType] attributes for all status codes
  - Inject IChefsService via constructor
  - _Requirements: 5, 32_

- [ ] 3. Create ContactController with endpoints
  - Implement ContactController with POST /api/contact endpoint
  - Implement POST /api/contact/office-inquiry endpoint
  - Accept request DTOs with [FromBody]
  - Validate requests using FluentValidation (automatic via middleware)
  - Return 200 OK with success message on valid submission
  - Return 400 Bad Request with validation errors on invalid input
  - Catch and handle rate limit (429) responses
  - _Requirements: 6, 7, 35, 38, 32_

- [ ] 4. Create BlogController with endpoints
  - Implement BlogController with GET /api/blog endpoint (paginated)
  - Implement GET /api/blog/{id} endpoint
  - Implement GET /api/blog/slug/{slug} endpoint
  - Return 404 when blog post not found
  - Apply [ProduceResponseType] for documentation
  - Inject IBlogService via constructor
  - _Requirements: 8, 9, 32_

- [ ] 5. Create TestimonialsController with endpoint
  - Implement TestimonialsController with GET /api/testimonials endpoint
  - Return testimonials ordered by creation date descending
  - Return empty list if no testimonials exist
  - _Requirements: 10_

- [ ] 6. Create StatsController with endpoint
  - Implement StatsController with GET /api/stats endpoint
  - Return system statistics: item count, chef count, subscription count
  - _Requirements: 12_

- [ ] 7. Create SubscriptionsController with endpoints
  - Implement SubscriptionsController with GET /api/subscriptions endpoint
  - Implement POST /api/subscriptions endpoint for creating subscription
  - Implement PUT /api/subscriptions/{id} endpoint for updating subscription
  - Implement DELETE /api/subscriptions/{id} endpoint for canceling subscription
  - Validate subscription data using FluentValidation
  - Return 404 when subscription not found
  - _Requirements: 11, 32_

- [ ] 8. Implement validation middleware
  - Create FluentValidationMiddleware to intercept requests
  - Validate DTOs using registered validators before controller execution
  - Return HTTP 400 with detailed field-level error messages on validation failure
  - _Requirements: 35, 15_

- [ ] 9. Implement request logging middleware
  - Create request/response logging middleware using Serilog
  - Log HTTP method, path, status code, response time
  - Log correlation IDs for request tracing
  - _Requirements: 17_

- [ ] 10. Configure Swagger/OpenAPI documentation
  - Enable Swagger UI middleware in Program.cs
  - Configure OpenAPI schema generation
  - Document all controller methods with XML comments
  - Configure endpoint-level response types via [ProduceResponseType]
  - Document request/response models in schemas
  - _Requirements: 32_

- [ ] 11. Implement CORS middleware
  - Apply UseCors middleware in correct pipeline position
  - Ensure CORS policy "AllowFrontend" is configured and applied
  - _Requirements: 23_

---

## Phase 6: Testing & Quality (Unit, Integration, Property-based)

- [x] 1. Set up test project structure
  - Create xUnit test project (GetMumm.Tests)
  - Install xUnit, Moq, TestContainers, and property-based test framework
  - Create test class folders: UnitTests/, IntegrationTests/, PropertyTests/
  - Create test fixtures and helpers
  - _Requirements: 29, 30, 31_

- [ ] 2. Write unit tests for MenuService
  - Test GetCategoriesAsync returns all categories via mapper
  - Test GetMenuItemsAsync with category filter
  - Test GetMenuItemsAsync with search filter
  - Test GetMenuItemsAsync pagination (skip/take)
  - Test GetMenuItemsAsync returns only available items
  - Test GetFeaturedItemsAsync returns featured available items
  - Test GetMenuItemByIdAsync returns correct item
  - Test GetMenuItemByIdAsync returns null when not found
  - Mock IRepository<MenuItem> and IRepository<Category>
  - _Requirements: 29, 1, 2, 3, 4_

- [ ] 3. Write unit tests for ChefsService
  - Test GetAllChefsAsync returns chefs ordered by rating descending
  - Test GetChefByIdAsync returns correct chef
  - Test GetChefByIdAsync returns null when not found
  - Mock IRepository<Chef>
  - _Requirements: 29, 5_

- [ ] 4. Write unit tests for ContactService
  - Test SubmitContactAsync persists to PostgreSQL repository
  - Test SubmitContactAsync initiates Supabase sync (fire-and-forget)
  - Test Supabase sync failure does not block response
  - Test validation failures throw exceptions
  - Mock IRepository<Contact> and ISupabaseService
  - _Requirements: 29, 6, 7_

- [ ] 5. Write unit tests for validators
  - Test SubmitContactRequestValidator accepts valid input
  - Test SubmitContactRequestValidator rejects invalid email
  - Test SubmitContactRequestValidator requires Name
  - Test MenuItemFilterDtoValidator enforces Page > 0
  - Test MenuItemFilterDtoValidator enforces PageSize ≤ 100
  - _Requirements: 29, 15_

- [ ] 6. Write integration tests with TestContainers
  - Create PostgreSQL container fixture
  - Test full repository → service → database flow for MenuItem operations
  - Test database transaction rollback on error
  - Test soft delete filtering (IsDeleted = true excluded)
  - Test pagination returns correct slice of data
  - Seed test data before each test
  - _Requirements: 30, 27, 36_

- [ ] 7. Write property-based tests for validation
  - **Property 1: MenuItemFilterDto page/size bounds**
  - **Validates: Requirements 1.5**
  - Generate random positive and negative Page values, verify validation
  - Generate random PageSize values, verify enforcement of ≤ 100
  - Minimum 100 test iterations
  - Use fast-check or similar framework
  - _Requirements: 31_

- [ ] 8. Write property-based tests for data transformations
  - **Property 2: MenuItem-to-MenuItemDto mapping consistency**
  - **Validates: Requirements 16, 1**
  - Generate random MenuItem entities, map to DTO, verify field values preserved
  - Test bilingual field handling (Name, NameAr, Description, DescriptionAr)
  - _Requirements: 31_

- [ ] 9. Create checkpoint test suite
  - Create test runner that executes all unit tests
  - Create test runner that executes integration tests
  - Ensure all tests pass (exit code 0) before phase completion
  - Generate test coverage report targeting 70%+ service layer coverage
  - _Requirements: 29, 30, 31_

---

## Phase 7: Documentation & Deployment (Final)

- [ ] 1. Create deployment configuration and documentation
  - Document required environment variables for deployment (ConnectionStrings, Supabase credentials, CORS origins)
  - Document database migration process (dotnet ef database update)
  - Create deployment checklist for production environment
  - Document cold start considerations for serverless deployments
  - _Requirements: 33, 39_

- [ ] 2. Create README and setup guide
  - Document project structure and layer responsibilities
  - Document local development setup (database, environment variables)
  - Document running migrations locally
  - Document running the application (dotnet run)
  - Document running tests (dotnet test)
  - _Requirements: 39_

- [ ] 3. Document API with OpenAPI/Swagger
  - Ensure all controllers have XML documentation comments
  - Ensure all endpoints have [ProduceResponseType] attributes
  - Generate OpenAPI specification
  - Test Swagger UI at /swagger/ui endpoint
  - Document all request/response schemas
  - _Requirements: 32, 39_

- [ ] 4. Create database migration guide
  - Document migration creation: `dotnet ef migrations add MigrationName`
  - Document migration application: `dotnet ef database update`
  - Document migration rollback: `dotnet ef migrations remove`
  - Document SQL script generation for manual deployment
  - _Requirements: 20_

- [ ] 5. Validate clean architecture adherence
  - Verify Presentation_Layer (Controllers) has NO Domain_Layer entity references (use DTOs)
  - Verify Application_Layer services depend on Domain_Layer interfaces only
  - Verify Infrastructure_Layer implements Domain_Layer interfaces
  - Verify no circular dependencies between layers
  - Document architecture decision rationale
  - _Requirements: 13_

- [ ] 6. Performance validation
  - Verify menu endpoint response time < 100ms
  - Verify featured items endpoint uses caching (verify cache hit on second request)
  - Verify pagination enforces max 100 items per response
  - Run load test with concurrent requests to verify async handling
  - _Requirements: 26_

- [ ] 7. Security validation checklist
  - Verify all LINQ queries (no raw SQL string concatenation)
  - Verify CORS policy restricts to configured origins
  - Verify rate limiting is enforced on contact endpoints
  - Verify exception middleware does NOT expose sensitive details in error responses
  - Verify all input is validated via FluentValidation before processing
  - _Requirements: 37, 23, 38, 18, 35_

- [ ] 8. Create deployment scripts
  - Create PowerShell/Bash script for local development setup
  - Create migration application script for CI/CD pipeline
  - Create appsettings environment variable replacement script
  - Document CI/CD pipeline stages (build, test, deploy)
  - _Requirements: 33, 39_

- [ ] 9. Final integration testing
  - Test all menu endpoints return correct responses
  - Test all chef endpoints return correct data
  - Test contact form submission to PostgreSQL and Supabase
  - Test office inquiry submission to PostgreSQL and Supabase
  - Test blog post retrieval with pagination
  - Test all response status codes and error messages
  - Verify no unhandled exceptions escape middleware
  - _Requirements: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12_

- [ ] 10. Final review and sign-off
  - Review all 40 requirements are implemented
  - Review clean architecture principles are followed
  - Review test coverage meets 70% target
  - Review API documentation is complete
  - Document known limitations or future enhancements
  - _Requirements: All_

---

## Notes

- All tasks follow async/await pattern with CancellationToken support (Requirement 25)
- Optional test sub-tasks (marked with `*`) can be skipped for MVP but are recommended for quality
- Each phase checkpoint ensures completeness before proceeding
- Property-based tests validate universal properties while unit tests validate specific examples
- Database indexes are critical for performance on MenuItems filtering
- Soft delete pattern requires query filters in DbContext to function correctly
- Supabase sync is fire-and-forget (non-blocking) to prevent contact form delays

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": [
        "1.1",
        "1.2",
        "1.3",
        "1.4",
        "1.5",
        "1.6",
        "1.7",
        "1.8"
      ]
    },
    {
      "id": 1,
      "tasks": [
        "2.1",
        "2.2",
        "2.3",
        "2.4",
        "2.5"
      ]
    },
    {
      "id": 2,
      "tasks": [
        "3.1",
        "3.2",
        "3.3",
        "3.4",
        "3.5",
        "3.6",
        "3.7",
        "3.8",
        "3.9",
        "3.10"
      ]
    },
    {
      "id": 3,
      "tasks": [
        "3.11",
        "3.12"
      ]
    },
    {
      "id": 4,
      "tasks": [
        "4.1",
        "4.2",
        "4.3",
        "4.4",
        "4.5",
        "4.6"
      ]
    },
    {
      "id": 5,
      "tasks": [
        "4.7"
      ]
    },
    {
      "id": 6,
      "tasks": [
        "5.1",
        "5.2",
        "5.3",
        "5.4",
        "5.5",
        "5.6",
        "5.7",
        "5.8",
        "5.9",
        "5.10",
        "5.11"
      ]
    },
    {
      "id": 7,
      "tasks": [
        "6.1",
        "6.2",
        "6.3",
        "6.4",
        "6.5",
        "6.6",
        "6.7",
        "6.8",
        "6.9"
      ]
    },
    {
      "id": 8,
      "tasks": [
        "7.1",
        "7.2",
        "7.3",
        "7.4",
        "7.5",
        "7.6",
        "7.7",
        "7.8",
        "7.9",
        "7.10"
      ]
    }
  ]
}
```
