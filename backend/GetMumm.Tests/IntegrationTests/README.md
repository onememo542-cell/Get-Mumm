# Integration Tests

Integration tests exercise the full request-response cycle from controller through service to database, using TestContainers to provide a real PostgreSQL instance.

## Structure

```
IntegrationTests/
├── Controllers/          # Controller integration tests
├── Services/             # Service integration tests
├── Database/             # Repository/DbContext tests
└── [FeatureFolder]/      # Organize by feature/domain
```

## Guidelines

- **Real Database**: Use TestContainers PostgreSQL, not mocks
- **Slower**: Tests may take 1-5 seconds due to database I/O
- **End-to-End**: Test controller → service → repository → database flow
- **Seeded Data**: IntegrationTestFixture provides pre-populated database
- **Isolation**: Each test class gets fresh database via IAsyncLifetime

## Example

```csharp
public class MenuControllerIntegrationTests : IAsyncLifetime
{
    private readonly IntegrationTestFixture _fixture = new();
    private MenuController _controller = null!;

    public Task InitializeAsync() => _fixture.InitializeAsync();
    public Task DisposeAsync() => _fixture.DisposeAsync();

    [Fact]
    public async Task GetFeaturedItems_ReturnsSeededFeaturedItems()
    {
        // Arrange
        var repository = new Repository<MenuItem>(_fixture.DbContext);
        var mapper = new MenuMappingProfile().CreateMapper();
        var service = new MenuService(repository, new Repository<Category>(_fixture.DbContext), mapper);
        _controller = new MenuController(service);

        // Act
        var result = await _controller.GetFeaturedItems();

        // Assert
        result.Value.Data.Should().NotBeEmpty();
    }
}
```

## Using IntegrationTestFixture

The fixture automatically:
1. Starts PostgreSQL container
2. Creates database schema
3. Seeds test data (categories, chefs, menu items)
4. Provides fresh `DbContext` for each test

For custom setup:
```csharp
public Task InitializeAsync()
{
    var task = _fixture.InitializeAsync();
    // Additional setup if needed
    return task;
}
```

To reset database between tests:
```csharp
[Fact]
public async Task Test1()
{
    // Test code
    await _fixture.ResetDatabaseAsync(); // Reset for next test
}
```

## Seeded Test Data

The fixture provides:
- **Categories**: Appetizers (ID: 1), Main Courses (ID: 2)
- **Chefs**: Chef Ahmed (ID: 1) with 5 items
- **Menu Items**: Hummus (ID: 1) - featured, vegan, gluten-free

Access seeded data via `_fixture.DbContext`:
```csharp
var categories = await _fixture.DbContext.Categories.ToListAsync();
```

## Test Categories

- **Happy Path**: Normal workflows with seeded data
- **Database Constraints**: Foreign key relationships, unique constraints
- **Pagination**: Real data ordering and limiting
- **Filtering**: Query results with various filters
- **Error Handling**: 404s, constraint violations
