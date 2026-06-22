# Unit Tests

Unit tests focus on testing individual components (controllers, services, validators) in isolation with mocked dependencies.

## Structure

```
UnitTests/
├── Controllers/          # Controller unit tests
├── Services/             # Service unit tests
├── Validators/           # Validator unit tests
├── Repositories/         # Repository unit tests (if applicable)
└── [FeatureFolder]/      # Organize by feature/domain
```

## Guidelines

- **Use Mocks**: Mock all external dependencies (repositories, services, mappers)
- **Fast**: Unit tests should complete in milliseconds
- **Isolated**: No database, no HTTP calls, no external dependencies
- **Deterministic**: Same inputs always produce same outputs
- **Clear**: Use descriptive names and AAA pattern

## Example

```csharp
public class MenuServiceUnitTests : IDisposable
{
    private readonly UnitTestFixture _fixture;
    private readonly MenuService _service;

    public MenuServiceUnitTests()
    {
        _fixture = new UnitTestFixture();
        _service = new MenuService(
            _fixture.MenuItemRepositoryMock.Object,
            _fixture.CategoryRepositoryMock.Object,
            _fixture.MapperMock.Object);
    }

    [Fact]
    public async Task GetCategories_WhenCalled_ReturnsAllCategories()
    {
        // Arrange
        var categories = new[] { new Category { Id = 1, Name = "Appetizers" } };
        _fixture.CategoryRepositoryMock
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);

        // Act
        var result = await _service.GetCategoriesAsync();

        // Assert
        result.Should().HaveCount(1);
        _fixture.CategoryRepositoryMock.Verify(
            r => r.GetAllAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    public void Dispose()
    {
        _fixture?.Dispose();
    }
}
```

## Test Categories

- **Happy Path**: Normal operation with valid inputs
- **Edge Cases**: Boundary values, empty collections, null references
- **Error Cases**: Invalid inputs, exceptions
- **Performance**: Ensures response times are acceptable
