using GetMumm.Application.DTOs;

namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for subscription-related business operations.
/// Provides abstraction for managing user subscriptions and offerings.
/// </summary>
public interface ISubscriptionService
{
    /// <summary>
    /// Retrieves all active subscriptions.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Collection of all subscriptions</returns>
    Task<IEnumerable<SubscriptionDto>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a subscription by ID.
    /// </summary>
    /// <param name="id">Subscription ID</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Subscription details, or null if not found</returns>
    Task<SubscriptionDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new subscription.
    /// </summary>
    /// <param name="request">Subscription request data</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Created subscription details</returns>
    Task<SubscriptionDto> CreateAsync(CreateSubscriptionRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing subscription.
    /// </summary>
    /// <param name="id">Subscription ID</param>
    /// <param name="request">Subscription update data</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Updated subscription details</returns>
    Task<SubscriptionDto?> UpdateAsync(Guid id, UpdateSubscriptionRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cancels a subscription.
    /// </summary>
    /// <param name="id">Subscription ID</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>True if cancellation successful, false if not found</returns>
    Task<bool> CancelAsync(Guid id, CancellationToken cancellationToken = default);
}
