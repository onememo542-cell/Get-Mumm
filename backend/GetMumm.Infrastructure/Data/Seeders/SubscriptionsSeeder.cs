namespace GetMumm.Infrastructure.Data.Seeders;

using GetMumm.Domain.Entities;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.Extensions.Logging;

/// <summary>
/// Seeder for Subscription entities.
/// </summary>
public class SubscriptionsSeeder
{
    private readonly GetMummDbContext _context;
    private readonly ILogger<SubscriptionsSeeder> _logger;

    public SubscriptionsSeeder(GetMummDbContext context, ILogger<SubscriptionsSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds subscription plans.
    /// </summary>
    public async Task SeedAsync()
    {
        if (_context.Subscriptions.Any())
        {
            _logger.LogInformation("Subscriptions already exist, skipping seed");
            return;
        }

        try
        {
            var subscriptions = new[]
            {
                new Subscription
                {
                    Id = Guid.NewGuid(),
                    UserId = "user_001",
                    Type = "Monthly",
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(1),
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                },
                new Subscription
                {
                    Id = Guid.NewGuid(),
                    UserId = "user_002",
                    Type = "Quarterly",
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(3),
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                },
                new Subscription
                {
                    Id = Guid.NewGuid(),
                    UserId = "user_003",
                    Type = "Annual",
                    StartDate = DateTime.UtcNow.AddDays(-30),
                    EndDate = DateTime.UtcNow.AddMonths(12).AddDays(-30),
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new Subscription
                {
                    Id = Guid.NewGuid(),
                    UserId = "user_004",
                    Type = "Monthly",
                    StartDate = DateTime.UtcNow.AddMonths(-1),
                    EndDate = DateTime.UtcNow.AddDays(-5),
                    Status = "Canceled",
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                }
            };

            await _context.Subscriptions.AddRangeAsync(subscriptions);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded {count} subscriptions", subscriptions.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding subscriptions");
            throw;
        }
    }
}
