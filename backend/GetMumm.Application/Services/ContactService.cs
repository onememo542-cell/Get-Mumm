using AutoMapper;
using FluentValidation;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Application.Validators;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace GetMumm.Application.Services;

/// <summary>
/// Service for contact form submissions and office catering inquiries.
/// Handles validation, persistence to PostgreSQL, and async sync to Supabase.
/// </summary>
public class ContactService : IContactService
{
    private readonly IRepository<Contact> _contactRepository;
    private readonly IRepository<OfficeInquiry> _officeInquiryRepository;
    private readonly ISupabaseService _supabaseService;
    private readonly IMapper _mapper;
    private readonly IValidator<SubmitContactRequest> _contactValidator;
    private readonly IValidator<SubmitOfficeInquiryRequest> _officeInquiryValidator;
    private readonly ILogger<ContactService> _logger;

    /// <summary>
    /// Initializes a new instance of the ContactService class.
    /// </summary>
    /// <param name="contactRepository">Repository for Contact entities</param>
    /// <param name="officeInquiryRepository">Repository for OfficeInquiry entities</param>
    /// <param name="supabaseService">Supabase external service for async sync</param>
    /// <param name="mapper">AutoMapper instance</param>
    /// <param name="contactValidator">Validator for contact requests</param>
    /// <param name="officeInquiryValidator">Validator for office inquiry requests</param>
    /// <param name="logger">Logger instance</param>
    public ContactService(
        IRepository<Contact> contactRepository,
        IRepository<OfficeInquiry> officeInquiryRepository,
        ISupabaseService supabaseService,
        IMapper mapper,
        IValidator<SubmitContactRequest> contactValidator,
        IValidator<SubmitOfficeInquiryRequest> officeInquiryValidator,
        ILogger<ContactService> logger)
    {
        _contactRepository = contactRepository;
        _officeInquiryRepository = officeInquiryRepository;
        _supabaseService = supabaseService;
        _mapper = mapper;
        _contactValidator = contactValidator;
        _officeInquiryValidator = officeInquiryValidator;
        _logger = logger;
    }

    /// <summary>
    /// Submits a contact form message.
    /// Validates input, persists to PostgreSQL, and initiates async Supabase sync (fire-and-forget).
    /// </summary>
    /// <param name="request">Contact request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Completed task</returns>
    /// <exception cref="ValidationException">Thrown if validation fails</exception>
    public async Task SubmitContactAsync(
        SubmitContactRequest request,
        CancellationToken cancellationToken = default)
    {
        // Validate request
        var validationResult = await _contactValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        // Map request to entity
        var contact = _mapper.Map<Contact>(request);

        // Persist to PostgreSQL
        await _contactRepository.CreateAsync(contact, cancellationToken);

        // Sync to Supabase (fire-and-forget)
        _ = Task.Run(async () =>
        {
            try
            {
                await _supabaseService.InsertContactAsync(contact, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Failed to sync contact (ID: {ContactId}) to Supabase. PostgreSQL write succeeded.",
                    contact.Id);
            }
        }, cancellationToken);
    }

    /// <summary>
    /// Submits an office catering inquiry.
    /// Validates input, persists to PostgreSQL, and initiates async Supabase sync (fire-and-forget).
    /// </summary>
    /// <param name="request">Office inquiry request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Completed task</returns>
    /// <exception cref="ValidationException">Thrown if validation fails</exception>
    public async Task SubmitOfficeInquiryAsync(
        SubmitOfficeInquiryRequest request,
        CancellationToken cancellationToken = default)
    {
        // Validate request
        var validationResult = await _officeInquiryValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        // Map request to entity
        var inquiry = _mapper.Map<OfficeInquiry>(request);

        // Persist to PostgreSQL
        await _officeInquiryRepository.CreateAsync(inquiry, cancellationToken);

        // Sync to Supabase (fire-and-forget)
        _ = Task.Run(async () =>
        {
            try
            {
                await _supabaseService.InsertOfficeInquiryAsync(inquiry, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Failed to sync office inquiry (ID: {InquiryId}) to Supabase. PostgreSQL write succeeded.",
                    inquiry.Id);
            }
        }, cancellationToken);
    }
}
