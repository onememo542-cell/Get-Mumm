namespace GetMumm.Application.Validators;

using GetMumm.Application.DTOs;

/// <summary>
/// FluentValidation validator for SubmitOfficeInquiryRequest DTO
/// Enforces validation rules for office catering inquiries
/// </summary>
public class SubmitOfficeInquiryRequestValidator : AbstractValidator<SubmitOfficeInquiryRequest>
{
    /// <summary>
    /// Initializes a new instance of the SubmitOfficeInquiryRequestValidator class
    /// and configures all validation rules
    /// </summary>
    public SubmitOfficeInquiryRequestValidator()
    {
        // Company name validation: required
        RuleFor(x => x.CompanyName)
            .NotEmpty()
            .WithMessage("Company name is required");

        // Contact name validation: required
        RuleFor(x => x.ContactName)
            .NotEmpty()
            .WithMessage("Contact name is required");

        // Email validation: required, valid format
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("Email format is invalid");

        // Head count validation: required, must be greater than 0
        RuleFor(x => x.HeadCount)
            .GreaterThan(0)
            .WithMessage("Head count must be greater than 0");

        // Message validation: required
        RuleFor(x => x.Message)
            .NotEmpty()
            .WithMessage("Message is required");
    }
}
