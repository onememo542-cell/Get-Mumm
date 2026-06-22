using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;

namespace GetMumm.Application.Services;

/// <summary>
/// Service for system statistics operations.
/// Implements business logic for retrieving analytics and statistics data.
/// </summary>
public class StatsService : IStatsService
{
    private readonly IRepository<MenuItem> _menuItemRepository;
    private readonly IRepository<Chef> _chefRepository;
    private readonly IRepository<Subscription> _subscriptionRepository;

    /// <summary>
    /// Initializes a new instance of the StatsService class.
    /// </summary>
    /// <param name="menuItemRepository">Repository for MenuItem entities</param>
    /// <param name="chefRepository">Repository for Chef entities</param>
    /// <param name="subscriptionRepository">Repository for Subscription entities</param>
    public StatsService(
        IRepository<MenuItem> menuItemRepository,
        IRepository<Chef> chefRepository,
        IRepository<Subscription> subscriptionRepository)
    {
        _menuItemRepository = menuItemRepository;
        _chefRepository = chefRepository;
        _subscriptionRepository = subscriptionRepository;
    }

    /// <summary>
    /// Gets system statistics.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>System statistics</returns>
    public async Task<StatsDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        var menuItems = await _menuItemRepository.GetAllAsync(cancellationToken);
        var chefs = await _chefRepository.GetAllAsync(cancellationToken);
        var subscriptions = await _subscriptionRepository.GetAllAsync(cancellationToken);

        return new StatsDto
        {
            MenuItemCount = menuItems.Count(),
            ChefCount = chefs.Count(),
            SubscriptionCount = subscriptions.Count()
        };
    }
}
