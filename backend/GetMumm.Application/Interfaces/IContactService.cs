using GetMumm.Application.DTOs;

namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for contact and inquiry related business operations.
/// Handles contact form submissions and office catering inquiries.
/// </summary>
public interface IContactService
{
    /// <summary>
    /// Submits a contact form message.
    /// Persists to PostgreSQL and syncs to Supabase asynchronously (fire-and-forget).
    /// </summary>
    /// <param name="request">Contact request with name, email, message, and subject</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Completed task representing the operation</returns>
    Task SubmitContactAsync(SubmitContactRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Submits an office catering inquiry.
    /// Persists to PostgreSQL and syncs to Supabase asynchronously (fire-and-forget).
    /// </summary>
    /// <param name="request">Office inquiry request with company and contact details</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Completed task representing the operation</returns>
    Task SubmitOfficeInquiryAsync(SubmitOfficeInquiryRequest request, CancellationToken cancellationToken = default);
}
