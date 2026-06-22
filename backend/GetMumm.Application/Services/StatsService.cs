using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;

namespace GetMumm.Application.Services;

public class StatsService : IStatsService
{
    private readonly IRepository<MenuItem> _menuItemRepository;
    private readonly IRepository<Chef> _chefRepository;
    private readonly IRepository<Subscription> _subscriptionRepository;
    private readonly IRepository<BlogPost> _blogPostRepository;
    private readonly IRepository<Testimonial> _testimonialRepository;

    public StatsService(
        IRepository<MenuItem> menuItemRepository,
        IRepository<Chef> chefRepository,
        IRepository<Subscription> subscriptionRepository,
        IRepository<BlogPost> blogPostRepository,
        IRepository<Testimonial> testimonialRepository)
    {
        _menuItemRepository = menuItemRepository;
        _chefRepository = chefRepository;
        _subscriptionRepository = subscriptionRepository;
        _blogPostRepository = blogPostRepository;
        _testimonialRepository = testimonialRepository;
    }

    public async Task<StatsDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        var menuItems     = await _menuItemRepository.GetAllAsync(cancellationToken);
        var chefs         = await _chefRepository.GetAllAsync(cancellationToken);
        var subscriptions = await _subscriptionRepository.GetAllAsync(cancellationToken);
        var blogPosts     = await _blogPostRepository.GetAllAsync(cancellationToken);
        var testimonials  = await _testimonialRepository.GetAllAsync(cancellationToken);

        return new StatsDto
        {
            MenuItemCount     = menuItems.Count(),
            ChefCount         = chefs.Count(),
            SubscriptionCount = subscriptions.Count(),
            BlogPostCount     = blogPosts.Count(),
            TestimonialCount  = testimonials.Count()
        };
    }
}
