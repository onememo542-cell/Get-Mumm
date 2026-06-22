using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Enums;
using GetMumm.Domain.Interfaces;

namespace GetMumm.Application.Services;

/// <summary>
/// Service for subscription management including CRUD operations.
/// Implements business logic for user subscription management.
/// </summary>
public class SubscriptionService : ISubscriptionService
{
    private readonly IRepository<Subscription> _subscriptionRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the SubscriptionService class.
    /// </summary>
    /// <param name="subscriptionRepository">Repository for Subscription entities</param>
    /// <param name="mapper">AutoMapper instance for entity-to-DTO conversion</param>
    public SubscriptionService(
        IRepository<Subscription> subscriptionRepository,
        IMapper mapper)
    {
        _subscriptionRepository = subscriptionRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Gets all subscriptions.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of subscriptions</returns>
    public async Task<IEnumerable<SubscriptionDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var subscriptions = await _subscriptionRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<SubscriptionDto>>(subscriptions);
    }

    /// <summary>
    /// Gets a subscription by ID.
    /// </summary>
    /// <param name="id">Subscription ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Subscription detail, or null if not found</returns>
    public async Task<SubscriptionDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var subscription = await _subscriptionRepository.GetByIdAsync(id, cancellationToken);
        if (subscription == null)
            return null;

        return _mapper.Map<SubscriptionDto>(subscription);
    }

    /// <summary>
    /// Creates a new subscription.
    /// </summary>
    /// <param name="request">Create subscription request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created subscription</returns>
    public async Task<SubscriptionDto> CreateAsync(CreateSubscriptionRequest request, CancellationToken cancellationToken = default)
    {
        var subscription = new Subscription
        {
            UserId = request.UserId,
            Type = request.Type,
            StartDate = DateTime.UtcNow,
            Status = SubscriptionStatus.Active
        };

        var created = await _subscriptionRepository.CreateAsync(subscription, cancellationToken);
        return _mapper.Map<SubscriptionDto>(created);
    }

    /// <summary>
    /// Updates an existing subscription.
    /// </summary>
    /// <param name="id">Subscription ID</param>
    /// <param name="request">Update subscription request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated subscription, or null if not found</returns>
    public async Task<SubscriptionDto?> UpdateAsync(Guid id, UpdateSubscriptionRequest request, CancellationToken cancellationToken = default)
    {
        var subscription = await _subscriptionRepository.GetByIdAsync(id, cancellationToken);
        if (subscription == null)
            return null;

        subscription.Type = request.Type;
        subscription.Status = request.Status;

        var updated = await _subscriptionRepository.UpdateAsync(subscription, cancellationToken);
        return _mapper.Map<SubscriptionDto>(updated);
    }

    /// <summary>
    /// Cancels a subscription.
    /// </summary>
    /// <param name="id">Subscription ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if successful, false if not found</returns>
    public async Task<bool> CancelAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _subscriptionRepository.DeleteAsync(id, cancellationToken);
    }
}
