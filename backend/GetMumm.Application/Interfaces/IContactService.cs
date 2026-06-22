using GetMumm.Application.DTOs;

namespace GetMumm.Application.Interfaces;

public interface IContactService
{
    Task SubmitContactAsync(SubmitContactRequest request, CancellationToken cancellationToken = default);
    Task SubmitOfficeInquiryAsync(SubmitOfficeInquiryRequest request, CancellationToken cancellationToken = default);
    Task<IEnumerable<ContactSubmissionDto>> GetAllContactsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<OfficeInquirySubmissionDto>> GetAllOfficeInquiriesAsync(CancellationToken cancellationToken = default);
}
