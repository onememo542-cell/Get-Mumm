using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Application.Services;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;
using GetMumm.Tests.Fixtures;
using Moq;

namespace GetMumm.Tests.UnitTests.Services;

/// <summary>
/// Unit tests for MenuService with mocked repository
/// </summary>
public class MenuServiceTests : IDisposable
{
    private readonly UnitTestFixture _fixture;
    private readonly MenuService _menuService;
    private readonly Mock<IRepository<MenuItem>> _menuItemRepoMock;
    private readonly Mock<IRepository<Category>> _categoryRepoMock;
    private readonly Mock<IMapper> _mapperMock;

    public MenuServiceTests()
    {
        _fixture = new UnitTestFixture();
        _menuItemRepoMock = _fixture.MenuItemRepositoryMock;
        _categoryRepoMock = _fixture.CategoryRepositoryMock;
        _mapperMock = _fixture.MapperMock;

        _menuService = new MenuService(_menuItemRepoMock.Object, _categoryRepoMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task GetCategoriesAsync_ShouldReturnMappedCategories()
    {
        // Arrange
        var categories = new List<Category>
        {
            new Category { Id = Guid.NewGuid(), Name = "Appetizers", NameAr = "المقبلات" },
            new Category { Id = Guid.NewGuid(), Name = "Main Course", NameAr = "الطبق الرئيسي" }
        };

        var categoryDtos = new List<CategoryDto>
        {
            new CategoryDto { Name = "Appetizers", NameAr = "المقبلات" },
            new CategoryDto { Name = "Main Course", NameAr = "الطبق الرئيسي" }
        };

        _categoryRepoMock
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);

        _mapperMock
            .Setup(m => m.Map<IEnumerable<CategoryDto>>(It.IsAny<IEnumerable<Category>>()))
            .Returns(categoryDtos);

        // Act
        var result = await _menuService.GetCategoriesAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
        _categoryRepoMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetFeaturedItemsAsync_ShouldReturnOnlyFeaturedAvailableItems()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var items = new List<MenuItem>
        {
            new MenuItem
            {
                Id = Guid.NewGuid(),
                Name = "Pasta",
                IsFeatured = true,
                IsAvailable = true,
                CategoryId = categoryId
            },
            new MenuItem
            {
                Id = Guid.NewGuid(),
                Name = "Pizza",
                IsFeatured = false,
                IsAvailable = true,
                CategoryId = categoryId
            }
        };

        var itemDtos = new List<MenuItemDto>
        {
            new MenuItemDto { Name = "Pasta", IsAvailable = true }
        };

        _menuItemRepoMock
            .Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<Func<MenuItem, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(items.Where(x => x.IsFeatured && x.IsAvailable).ToList());

        _mapperMock
            .Setup(m => m.Map<IEnumerable<MenuItemDto>>(It.IsAny<IEnumerable<MenuItem>>()))
            .Returns(itemDtos);

        // Act
        var result = await _menuService.GetFeaturedItemsAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Single(result);
    }

    [Fact]
    public async Task GetMenuItemByIdAsync_WithValidId_ShouldReturnMenuItem()
    {
        // Arrange
        var id = Guid.NewGuid();
        var menuItem = new MenuItem
        {
            Id = id,
            Name = "Burger",
            NameAr = "برجر",
            CategoryId = Guid.NewGuid(),
            Price = 15.99m
        };

        var menuItemDetailDto = new MenuItemDetailDto
        {
            Id = id,
            Name = "Burger",
            NameAr = "برجر",
            Price = 15.99m
        };

        _menuItemRepoMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(menuItem);

        _mapperMock
            .Setup(m => m.Map<MenuItemDetailDto>(It.IsAny<MenuItem>()))
            .Returns(menuItemDetailDto);

        // Act
        var result = await _menuService.GetMenuItemByIdAsync(id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
        Assert.Equal("Burger", result.Name);
    }

    [Fact]
    public async Task GetMenuItemByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        var id = Guid.NewGuid();

        _menuItemRepoMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((MenuItem?)null);

        // Act
        var result = await _menuService.GetMenuItemByIdAsync(id);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetMenuItemsAsync_WithCategoryFilter_ShouldReturnFilteredItems()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var filter = new MenuItemFilterDto
        {
            CategoryId = categoryId,
            Search = null,
            Page = 1,
            PageSize = 10
        };

        var items = new List<MenuItem>
        {
            new MenuItem
            {
                Id = Guid.NewGuid(),
                Name = "Pasta Carbonara",
                CategoryId = categoryId,
                IsAvailable = true
            }
        };

        var itemDtos = new List<MenuItemDto>
        {
            new MenuItemDto { Name = "Pasta Carbonara", IsAvailable = true }
        };

        _menuItemRepoMock
            .Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<Func<MenuItem, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(items);

        _mapperMock
            .Setup(m => m.Map<IEnumerable<MenuItemDto>>(It.IsAny<IEnumerable<MenuItem>>()))
            .Returns(itemDtos);

        // Act
        var result = await _menuService.GetMenuItemsAsync(filter);

        // Assert
        Assert.NotNull(result);
        Assert.Single(result.Data);
        Assert.Equal(1, result.Page);
        Assert.Equal(10, result.PageSize);
    }

    public void Dispose()
    {
        _fixture.Dispose();
    }
}
