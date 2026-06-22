namespace GetMumm.Application.Validators;

using GetMumm.Application.DTOs;

/// <summary>
/// FluentValidation validator for MenuItemFilterDto
/// Enforces pagination and filtering bounds for menu item queries
/// </summary>
public class MenuItemFilterDtoValidator : AbstractValidator<MenuItemFilterDto>
{
    /// <summary>
    /// Initializes a new instance of the MenuItemFilterDtoValidator class
    /// and configures all validation rules
    /// </summary>
    public MenuItemFilterDtoValidator()
    {
        // Page validation: must be greater than 0
        RuleFor(x => x.Page)
            .GreaterThan(0)
            .WithMessage("Page must be greater than 0");

        // PageSize validation: must be greater than 0 and not exceed 100
        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .WithMessage("PageSize must be greater than 0")
            .LessThanOrEqualTo(100)
            .WithMessage("PageSize must not exceed 100");
    }
}
