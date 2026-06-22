using FluentValidation.TestHelper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Validators;

namespace GetMumm.Tests.UnitTests.Validators;

/// <summary>
/// Unit tests for SubmitContactRequestValidator
/// </summary>
public class SubmitContactRequestValidatorTests
{
    private readonly SubmitContactRequestValidator _validator;

    public SubmitContactRequestValidatorTests()
    {
        _validator = new SubmitContactRequestValidator();
    }

    [Fact]
    public void Validate_WithValidRequest_ShouldSucceed()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "+1-555-0123",
            Message = "This is a test message",
            Subject = "Test Subject"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyName_ShouldFail()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "",
            Email = "john@example.com",
            Phone = "+1-555-0123",
            Message = "This is a test message",
            Subject = "Test Subject"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WithNameExceedsMax_ShouldFail()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = new string('A', 101),
            Email = "john@example.com",
            Phone = "+1-555-0123",
            Message = "This is a test message",
            Subject = "Test Subject"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WithInvalidEmail_ShouldFail()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "John Doe",
            Email = "invalid-email",
            Phone = "+1-555-0123",
            Message = "This is a test message",
            Subject = "Test Subject"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validate_WithShortMessage_ShouldFail()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "+1-555-0123",
            Message = "Short",
            Subject = "Test Subject"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Message);
    }

    [Fact]
    public void Validate_WithOptionalPhoneEmpty_ShouldSucceed()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "",
            Message = "This is a test message",
            Subject = "Test Subject"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithInvalidPhoneFormat_ShouldFail()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "123",
            Message = "This is a test message",
            Subject = "Test Subject"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Phone);
    }

    [Fact]
    public void Validate_WithSubjectExceedsMax_ShouldFail()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "+1-555-0123",
            Message = "This is a test message",
            Subject = new string('A', 201)
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Subject);
    }
}
