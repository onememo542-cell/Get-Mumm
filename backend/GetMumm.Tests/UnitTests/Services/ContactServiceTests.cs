using AutoMapper;
using FluentValidation;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Application.Services;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;
using GetMumm.Tests.Fixtures;
using Moq;

namespace GetMumm.Tests.UnitTests.Services;

/// <summary>
/// Unit tests for ContactService
/// </summary>
public class ContactServiceTests : IDisposable
{
    private readonly UnitTestFixture _fixture;
    private readonly ContactService _contactService;
    private readonly Mock<IRepository<Contact>> _contactRepoMock;
    private readonly Mock<IRepository<OfficeInquiry>> _officeInquiryRepoMock;
    private readonly Mock<ISupabaseService> _supabaseServiceMock;
    private readonly Mock<IValidator<SubmitContactRequest>> _contactValidatorMock;
    private readonly Mock<IValidator<SubmitOfficeInquiryRequest>> _officeValidatorMock;
    private readonly Mock<IMapper> _mapperMock;

    public ContactServiceTests()
    {
        _fixture = new UnitTestFixture();
        _contactRepoMock = _fixture.ContactRepositoryMock;
        _mapperMock = _fixture.MapperMock;
        
        _officeInquiryRepoMock = new Mock<IRepository<OfficeInquiry>>();
        _supabaseServiceMock = new Mock<ISupabaseService>();
        _contactValidatorMock = new Mock<IValidator<SubmitContactRequest>>();
        _officeValidatorMock = new Mock<IValidator<SubmitOfficeInquiryRequest>>();

        var loggerMock = _fixture.GetLoggerMock<ContactService>();

        _contactService = new ContactService(
            _contactRepoMock.Object,
            _officeInquiryRepoMock.Object,
            _supabaseServiceMock.Object,
            _mapperMock.Object,
            _contactValidatorMock.Object,
            _officeValidatorMock.Object,
            loggerMock.Object);
    }

    [Fact]
    public async Task SubmitContactAsync_WithValidRequest_ShouldPersistToPostgres()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "+1-555-0123",
            Message = "This is a test message with more than 10 characters",
            Subject = "Test Subject"
        };

        var contact = new Contact
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Message = request.Message,
            Subject = request.Subject
        };

        _contactValidatorMock
            .Setup(v => v.ValidateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());

        _mapperMock
            .Setup(m => m.Map<Contact>(request))
            .Returns(contact);

        _contactRepoMock
            .Setup(r => r.CreateAsync(It.IsAny<Contact>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(contact);

        _supabaseServiceMock
            .Setup(s => s.InsertContactAsync(It.IsAny<Contact>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await _contactService.SubmitContactAsync(request);

        // Assert
        _contactRepoMock.Verify(
            r => r.CreateAsync(It.IsAny<Contact>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task SubmitContactAsync_WithInvalidRequest_ShouldThrowValidationException()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "",
            Email = "invalid",
            Phone = "",
            Message = "short",
            Subject = ""
        };

        var validationResult = new FluentValidation.Results.ValidationResult(new[]
        {
            new FluentValidation.Results.ValidationFailure("Name", "Name is required")
        });

        _contactValidatorMock
            .Setup(v => v.ValidateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(() => 
            _contactService.SubmitContactAsync(request));
    }

    [Fact]
    public async Task SubmitContactAsync_SupabaseFailureDoesNotBlockResponse()
    {
        // Arrange
        var request = new SubmitContactRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "+1-555-0123",
            Message = "This is a test message with more than 10 characters",
            Subject = "Test Subject"
        };

        var contact = new Contact
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Message = request.Message,
            Subject = request.Subject
        };

        _contactValidatorMock
            .Setup(v => v.ValidateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());

        _mapperMock
            .Setup(m => m.Map<Contact>(request))
            .Returns(contact);

        _contactRepoMock
            .Setup(r => r.CreateAsync(It.IsAny<Contact>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(contact);

        // Simulate Supabase failure
        _supabaseServiceMock
            .Setup(s => s.InsertContactAsync(It.IsAny<Contact>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Supabase connection error"));

        // Act - Should not throw even though Supabase fails
        await _contactService.SubmitContactAsync(request);

        // Assert - PostgreSQL write should have succeeded
        _contactRepoMock.Verify(
            r => r.CreateAsync(It.IsAny<Contact>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    public void Dispose()
    {
        _fixture.Dispose();
    }
}
