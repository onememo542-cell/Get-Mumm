# GetMumm.Tests - Testing Infrastructure

This project contains comprehensive test coverage for the GetMumm backend using xUnit, Moq, TestContainers, and CsCheck.

## Project Structure

```
GetMumm.Tests/
├── UnitTests/                  # Fast, isolated tests with mocked dependencies
├── IntegrationTests/           # End-to-end tests using TestContainers for real database
├── PropertyTests/              # Property-based tests using CsCheck
├── Fixtures/                   # Reusable test fixtures, factories, and generators
│   ├── UnitTestFixture.cs      # Mock setup for unit tests
│   ├── IntegrationTestFixture.cs # PostgreSQL container management
│   ├── PropertyTestGenerators.cs # CsCheck generators for PBT
│   └── [other fixtures]
└── GlobalUsings.cs             # Global using statements for all test classes
```

## Testing Frameworks

### xUnit
- Framework: `xUnit 2.6.6`
- Test runner: `xunit.runner.visualstudio 2.5.4`
- Usage: `[Fact]` for simple tests, `[Theory]` with `[InlineData]` for parameterized tests

### Moq
- Version: `4.20.70`
- Purpose: Mocking interfaces and repositories
- Usage: Create mocks in test setup, configure expectations

### TestContainers
- Version: `3.7.0` (PostgreSQL `3.7.0`)
- Purpose: Spin up real PostgreSQL container for integration tests
- Lifecycle: Automatically created on test start, torn down on test end

### CsCheck
- Version: `1.2.21`
- Purpose: Property-based testing framework
- Usage: Generate random test data, define properties that should hold for all inputs

### FluentAssertions
- Version: `6.12.0`
- Purpose: Readable, chainable assertions
- Usage: `result.Should().Be(expected)`, `collection.Should().NotBeEmpty()`

## Running Tests

### Run All Tests
```bash
dotnet test
```

### Run Specific Test Class
```bash
dotnet test --filter "ClassName=MenuServiceTests"
```

### Run Only Unit Tests
```bash
dotnet test --filter "Category=Unit"
```

### Run Only Integration Tests
```bash
dotnet test --filter "Category=Integration"
```

### Run Only Property-Based Tests
```bash
dotnet test --filter "Category=Property"
```

### Run with Verbose Output
```bash
dotnet test -v d
```

## Unit Testing

Unit tests focus on testing services, controllers, and business logic in isolation using mocked dependencies.

### Example Unit Test
```csharp
public class MenuServiceTests
{
    private readonly UnitTestFixture _fixture = new();

    [Fact]
    public async Task GetCategories_ReturnsAllCategories()
    {
        // Arrange
        var categories = new[] { new Category { Id = 1, Name = "Appetizers" } };
        _fixture.CategoryRepositoryMock
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);
        
        var service = new MenuService(_fixture.CategoryRepositoryMock.Object, _fixture.MapperMock.Object);

        // Act
        var result = await service.GetCategoriesAsync();

        // Assert
        result.Should().HaveCount(1);
    }
}
```

## Integration Testing

Integration tests use `IntegrationTestFixture` to spin up a real PostgreSQL database via TestContainers.

### Example Integration Test
```csharp
public class MenuControllerIntegrationTests : IAsyncLifetime
{
    private readonly IntegrationTestFixture _fixture = new();

    public Task InitializeAsync() => _fixture.InitializeAsync();
    public Task DisposeAsync() => _fixture.DisposeAsync();

    [Fact]
    public async Task GetCategories_ReturnsSeededData()
    {
        // Arrange
        var controller = new MenuController(new MenuService(...));

        // Act
        var result = await controller.GetCategories();

        // Assert
        result.Should().NotBeNull();
    }
}
```

## Property-Based Testing

Property-based tests use `PropertyTestGenerators` to create randomized test data and verify properties hold for all generated inputs.

### Example Property Test
```csharp
public class MenuFilterPropertyTests
{
    [Fact]
    public void PageSize_MustBeEnforced()
    {
        var gen = PropertyTestGenerators.MenuItemFilterDtoGen();
        
        Gen.Sample(gen).ForAll(filter =>
        {
            filter.PageSize.Should().BeGreaterThan(0).And.BeLessThanOrEqualTo(100);
        });
    }
}
```

## Fixtures & Helpers

### UnitTestFixture
Provides mocked dependencies for unit tests:
- `MenuItemRepositoryMock`
- `CategoryRepositoryMock`
- `ChefRepositoryMock`
- `ContactRepositoryMock`
- `MapperMock`

Use `Reset()` between tests for clean state.

### IntegrationTestFixture
Manages PostgreSQL container and database lifecycle:
- Implements `IAsyncLifetime` for automatic setup/teardown
- Seeds test data on initialization
- Provides fresh `DbContext` via `GetDbContext()`
- Supports database reset with `ResetDatabaseAsync()`

### PropertyTestGenerators
CsCheck generators for common test data:
- `MenuItemFilterDtoGen()` - Valid filter objects
- `ValidPageNumberGen()` / `InvalidPageNumberGen()`
- `ValidPageSizeGen()` / `InvalidPageSizeGen()`
- `ValidEmailGen()` / `InvalidEmailGen()`
- `ValidContactRequestGen()` - Complete contact requests
- See class for more generators

## Best Practices

1. **Test Naming**: Use `[MethodUnderTest]_[Scenario]_[ExpectedResult]` pattern
2. **AAA Pattern**: Arrange → Act → Assert
3. **One Assertion Per Test**: Keep tests focused
4. **Mock External Dependencies**: Only mock what's external to the unit
5. **Use Fixtures**: Reuse common setup with fixtures
6. **Property Tests**: Verify universal properties, not specific examples
7. **Category Attributes**: Tag tests with `[Trait("Category", "Unit|Integration|Property")]`

## Troubleshooting

### TestContainers Not Starting
- Ensure Docker is running: `docker ps`
- Check PostgreSQL image: `docker images | grep postgres`
- Review container logs: Check test output for detailed errors

### Moq Setup Issues
- Verify interface matches actual implementation
- Use `It.IsAny<T>()` for flexible matching
- Check `Verify()` calls with `Times.Once()` etc.

### Property Tests Too Slow
- Reduce sample size: `Gen.Sample(gen, 10)` for quick checks
- Use `Retry(n)` for flaky tests: `Gen.Retry(Gen.Sample(gen), 3)`

## Resources

- [xUnit Documentation](https://xunit.net/docs/getting-started/netfx)
- [Moq Documentation](https://github.com/moq/moq4/wiki/Quickstart)
- [TestContainers for .NET](https://testcontainers.com/docs/languages/dotnet)
- [CsCheck Documentation](https://github.com/AnthonyLloyd/CsCheck)
- [FluentAssertions](https://fluentassertions.com/)
