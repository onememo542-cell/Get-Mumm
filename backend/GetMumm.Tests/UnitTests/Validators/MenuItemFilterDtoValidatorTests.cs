using FluentValidation.TestHelper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Validators;

namespace GetMumm.Tests.UnitTests.Validators;

/// <summary>
/// Unit tests for MenuItemFilterDtoValidator
/// </summary>
public class MenuItemFilterDtoValidatorTests
{
    private readonly MenuItemFilterDtoValidator _validator;

    public MenuItemFilterDtoValidatorTests()
    {
        _validator = new MenuItemFilterDtoValidator();
    }

    [Fact]
    public void Validate_WithValidDto_ShouldSucceed()
    {
        // Arrange
        var dto = new MenuItemFilterDto { Page = 1, PageSize = 10 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithPageZero_ShouldFail()
    {
        // Arrange
        var dto = new MenuItemFilterDto { Page = 0, PageSize = 10 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Page);
    }

    [Fact]
    public void Validate_WithPageNegative_ShouldFail()
    {
        // Arrange
        var dto = new MenuItemFilterDto { Page = -1, PageSize = 10 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Page);
    }

    [Fact]
    public void Validate_WithPageSizeZero_ShouldFail()
    {
        // Arrange
        var dto = new MenuItemFilterDto { Page = 1, PageSize = 0 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.PageSize);
    }

    [Fact]
    public void Validate_WithPageSizeExceedsMax_ShouldFail()
    {
        // Arrange
        var dto = new MenuItemFilterDto { Page = 1, PageSize = 101 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.PageSize);
    }

    [Fact]
    public void Validate_WithPageSizeAtMax_ShouldSucceed()
    {
        // Arrange
        var dto = new MenuItemFilterDto { Page = 1, PageSize = 100 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(1)]
    [InlineData(5)]
    [InlineData(10)]
    [InlineData(100)]
    public void Validate_WithValidPageSizes_ShouldSucceed(int pageSize)
    {
        // Arrange
        var dto = new MenuItemFilterDto { Page = 1, PageSize = pageSize };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }
}
