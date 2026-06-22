using GetMumm.Application.DTOs;
using GetMumm.Application.Validators;

namespace GetMumm.Tests.PropertyTests;

/// <summary>
/// Property-based tests for MenuItemFilterDto pagination bounds.
/// Tests universal properties across generated random values.
/// </summary>
public class MenuItemFilterBoundsPropertyTests
{
    private readonly MenuItemFilterDtoValidator _validator;

    public MenuItemFilterBoundsPropertyTests()
    {
        _validator = new MenuItemFilterDtoValidator();
    }

    [Fact]
    public void PageMustBeGreaterThanZero_Property()
    {
        // Property: For all positive Page values (1-1000), validation should succeed
        for (int page = 1; page <= 1000; page += 50)
        {
            var dto = new MenuItemFilterDto { Page = page, PageSize = 10 };
            var result = _validator.Validate(dto);
            Assert.True(result.IsValid, $"Page {page} should be valid");
        }
    }

    [Fact]
    public void PageZeroOrNegativeInvalid_Property()
    {
        // Property: For all zero or negative Page values, validation should fail
        int[] invalidPages = { 0, -1, -10, -100, int.MinValue };
        foreach (var page in invalidPages)
        {
            var dto = new MenuItemFilterDto { Page = page, PageSize = 10 };
            var result = _validator.Validate(dto);
            Assert.False(result.IsValid, $"Page {page} should be invalid");
        }
    }

    [Fact]
    public void PageSizeMustBeWithinBounds_Property()
    {
        // Property: For all PageSize values between 1 and 100, validation should succeed
        for (int pageSize = 1; pageSize <= 100; pageSize += 10)
        {
            var dto = new MenuItemFilterDto { Page = 1, PageSize = pageSize };
            var result = _validator.Validate(dto);
            Assert.True(result.IsValid, $"PageSize {pageSize} should be valid");
        }
    }

    [Fact]
    public void PageSizeExceedingMaxInvalid_Property()
    {
        // Property: For all PageSize values exceeding 100, validation should fail
        int[] invalidPageSizes = { 101, 200, 1000, int.MaxValue };
        foreach (var pageSize in invalidPageSizes)
        {
            var dto = new MenuItemFilterDto { Page = 1, PageSize = pageSize };
            var result = _validator.Validate(dto);
            Assert.False(result.IsValid, $"PageSize {pageSize} should be invalid");
        }
    }

    [Fact]
    public void ValidCombinationsAlwaysPass_Property()
    {
        // Property: Valid combinations of Page and PageSize always pass
        for (int page = 1; page <= 100; page += 20)
        {
            for (int pageSize = 1; pageSize <= 100; pageSize += 20)
            {
                var dto = new MenuItemFilterDto { Page = page, PageSize = pageSize };
                var result = _validator.Validate(dto);
                Assert.True(result.IsValid, 
                    $"Valid combination Page={page}, PageSize={pageSize} should pass");
            }
        }
    }

    [Fact]
    public void InvalidPageWithValidPageSize_Fails_Property()
    {
        // Property: Invalid Page (≤ 0) with valid PageSize always fails
        int[] invalidPages = { 0, -1, -10, int.MinValue };
        int[] validPageSizes = { 1, 25, 50, 100 };
        
        foreach (var page in invalidPages)
        {
            foreach (var pageSize in validPageSizes)
            {
                var dto = new MenuItemFilterDto { Page = page, PageSize = pageSize };
                var result = _validator.Validate(dto);
                Assert.False(result.IsValid,
                    $"Invalid Page={page} with PageSize={pageSize} should fail");
            }
        }
    }

    [Fact]
    public void ValidPageWithInvalidPageSize_Fails_Property()
    {
        // Property: Valid Page with invalid PageSize (> 100) always fails
        int[] validPages = { 1, 25, 50, 100 };
        int[] invalidPageSizes = { 101, 500, 1000, int.MaxValue };
        
        foreach (var page in validPages)
        {
            foreach (var pageSize in invalidPageSizes)
            {
                var dto = new MenuItemFilterDto { Page = page, PageSize = pageSize };
                var result = _validator.Validate(dto);
                Assert.False(result.IsValid,
                    $"Valid Page={page} with invalid PageSize={pageSize} should fail");
            }
        }
    }
}
