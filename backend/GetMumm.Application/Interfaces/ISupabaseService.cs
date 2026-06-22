using GetMumm.Domain.Entities;

namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for Supabase external service operations.
/// Handles fire-and-forget async operations for data synchronization.
/// </summary>
public interface ISupabaseService
{
    /// <summary>
    /// Inserts a contact entity to Supabase asynchronously.
    /// Executes as fire-and-forget - failures do not propagate to caller.
    /// </summary>
    /// <param name="entity">The contact entity to insert</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>A task representing the fire-and-forget operation</returns>
    Task InsertContactAsync(Contact entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Inserts an office inquiry entity to Supabase asynchronously.
    /// Executes as fire-and-forget - failures do not propagate to caller.
    /// </summary>
    /// <param name="entity">The office inquiry entity to insert</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>A task representing the fire-and-forget operation</returns>
    Task InsertOfficeInquiryAsync(OfficeInquiry entity, CancellationToken cancellationToken = default);
}
