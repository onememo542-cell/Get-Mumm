using AutoMapper;
using FluentValidation;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace GetMumm.Application.Services;

public class ContactService : IContactService
{
    private readonly IRepository<Contact> _contactRepository;
    private readonly IRepository<OfficeInquiry> _officeInquiryRepository;
    private readonly ISupabaseService _supabaseService;
    private readonly IMapper _mapper;
    private readonly IValidator<SubmitContactRequest> _contactValidator;
    private readonly IValidator<SubmitOfficeInquiryRequest> _officeInquiryValidator;
    private readonly ILogger<ContactService> _logger;

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

    public async Task SubmitContactAsync(SubmitContactRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _contactValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid) throw new ValidationException(validationResult.Errors);

        var contact = _mapper.Map<Contact>(request);
        await _contactRepository.CreateAsync(contact, cancellationToken);

        _ = Task.Run(async () =>
        {
            try { await _supabaseService.InsertContactAsync(contact, cancellationToken); }
            catch (Exception ex) { _logger.LogWarning(ex, "Failed to sync contact {ContactId} to Supabase.", contact.Id); }
        }, cancellationToken);
    }

    public async Task SubmitOfficeInquiryAsync(SubmitOfficeInquiryRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await _officeInquiryValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid) throw new ValidationException(validationResult.Errors);

        var inquiry = _mapper.Map<OfficeInquiry>(request);
        await _officeInquiryRepository.CreateAsync(inquiry, cancellationToken);

        _ = Task.Run(async () =>
        {
            try { await _supabaseService.InsertOfficeInquiryAsync(inquiry, cancellationToken); }
            catch (Exception ex) { _logger.LogWarning(ex, "Failed to sync office inquiry {InquiryId} to Supabase.", inquiry.Id); }
        }, cancellationToken);
    }

    public async Task<IEnumerable<ContactSubmissionDto>> GetAllContactsAsync(CancellationToken cancellationToken = default)
    {
        var contacts = await _contactRepository.GetAllAsync(cancellationToken);
        return contacts
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ContactSubmissionDto
            {
                Id        = c.Id,
                Name      = c.Name,
                Email     = c.Email,
                Phone     = c.Phone,
                Subject   = c.Subject,
                Message   = c.Message,
                Status    = c.Status.ToString(),
                CreatedAt = c.CreatedAt,
            });
    }

    public async Task<IEnumerable<OfficeInquirySubmissionDto>> GetAllOfficeInquiriesAsync(CancellationToken cancellationToken = default)
    {
        var inquiries = await _officeInquiryRepository.GetAllAsync(cancellationToken);
        return inquiries
            .OrderByDescending(i => i.CreatedAt)
            .Select(i => new OfficeInquirySubmissionDto
            {
                Id           = i.Id,
                CompanyName  = i.CompanyName,
                ContactName  = i.ContactName,
                Email        = i.Email,
                Phone        = i.Phone,
                HeadCount    = i.HeadCount,
                DeliveryArea = i.DeliveryArea,
                Frequency    = i.Frequency,
                Message      = i.Message,
                CreatedAt    = i.CreatedAt,
            });
    }
}
