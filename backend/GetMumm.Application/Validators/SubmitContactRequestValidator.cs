namespace GetMumm.Application.Validators;

using GetMumm.Application.DTOs;

/// <summary>
/// FluentValidation validator for SubmitContactRequest DTO
/// Enforces validation rules for contact form submissions
/// </summary>
public class SubmitContactRequestValidator : AbstractValidator<SubmitContactRequest>
{
    /// <summary>
    /// Initializes a new instance of the SubmitContactRequestValidator class
    /// and configures all validation rules
    /// </summary>
    public SubmitContactRequestValidator()
    {
        // Name validation: required, max 100 characters
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required")
            .MaximumLength(100)
            .WithMessage("Name must not exceed 100 characters");

        // Email validation: required, valid format
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("Email format is invalid");

        // Phone validation: optional, but if provided must match regex format
        RuleFor(x => x.Phone)
            .Matches(@"^\+?[\d\s\-()]{7,}$")
            .When(x => !string.IsNullOrEmpty(x.Phone))
            .WithMessage("Phone format is invalid");

        // Message validation: required, minimum 10 characters
        RuleFor(x => x.Message)
            .NotEmpty()
            .WithMessage("Message is required")
            .MinimumLength(10)
            .WithMessage("Message must be at least 10 characters");

        // Subject validation: required, max 200 characters
        RuleFor(x => x.Subject)
            .NotEmpty()
            .WithMessage("Subject is required")
            .MaximumLength(200)
            .WithMessage("Subject must not exceed 200 characters");
    }
}
