using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Services;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;
using GetMumm.Tests.Fixtures;
using Moq;

namespace GetMumm.Tests.UnitTests.Services;

/// <summary>
/// Unit tests for ChefsService
/// </summary>
public class ChefsServiceTests : IDisposable
{
    private readonly UnitTestFixture _fixture;
    private readonly ChefsService _chefsService;
    private readonly Mock<IRepository<Chef>> _chefRepoMock;
    private readonly Mock<IMapper> _mapperMock;

    public ChefsServiceTests()
    {
        _fixture = new UnitTestFixture();
        _chefRepoMock = _fixture.ChefRepositoryMock;
        _mapperMock = _fixture.MapperMock;

        _chefsService = new ChefsService(_chefRepoMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task GetAllChefsAsync_ShouldReturnChefsOrderedByRatingDescending()
    {
        // Arrange
        var chefs = new List<Chef>
        {
            new Chef { Id = Guid.NewGuid(), Name = "Chef A", Rating = 4.5m },
            new Chef { Id = Guid.NewGuid(), Name = "Chef B", Rating = 4.8m },
            new Chef { Id = Guid.NewGuid(), Name = "Chef C", Rating = 4.2m }
        };

        var chefDtos = new List<ChefDto>
        {
            new ChefDto { Name = "Chef B", Rating = 4.8m },
            new ChefDto { Name = "Chef A", Rating = 4.5m },
            new ChefDto { Name = "Chef C", Rating = 4.2m }
        };

        _chefRepoMock
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(chefs);

        _mapperMock
            .Setup(m => m.Map<IEnumerable<ChefDto>>(It.IsAny<IEnumerable<Chef>>()))
            .Returns(chefDtos);

        // Act
        var result = await _chefsService.GetAllChefsAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count());
        _chefRepoMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetChefByIdAsync_WithValidId_ShouldReturnChef()
    {
        // Arrange
        var id = Guid.NewGuid();
        var chef = new Chef
        {
            Id = id,
            Name = "Gordon Ramsay",
            NameAr = "جوردون رامزي",
            Bio = "World renowned chef",
            Rating = 4.9m
        };

        var chefDetailDto = new ChefDetailDto
        {
            Id = id,
            Name = "Gordon Ramsay",
            NameAr = "جوردون رامزي",
            Rating = 4.9m
        };

        _chefRepoMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(chef);

        _mapperMock
            .Setup(m => m.Map<ChefDetailDto>(It.IsAny<Chef>()))
            .Returns(chefDetailDto);

        // Act
        var result = await _chefsService.GetChefByIdAsync(id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
        Assert.Equal("Gordon Ramsay", result.Name);
    }

    [Fact]
    public async Task GetChefByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        var id = Guid.NewGuid();

        _chefRepoMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Chef?)null);

        // Act
        var result = await _chefsService.GetChefByIdAsync(id);

        // Assert
        Assert.Null(result);
    }

    public void Dispose()
    {
        _fixture.Dispose();
    }
}
