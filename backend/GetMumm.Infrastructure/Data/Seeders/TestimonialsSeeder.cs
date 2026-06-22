namespace GetMumm.Infrastructure.Data.Seeders;

using GetMumm.Domain.Entities;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.Extensions.Logging;

/// <summary>
/// Seeder for Testimonial entities.
/// </summary>
public class TestimonialsSeeder
{
    private readonly GetMummDbContext _context;
    private readonly ILogger<TestimonialsSeeder> _logger;

    public TestimonialsSeeder(GetMummDbContext context, ILogger<TestimonialsSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds customer testimonials.
    /// </summary>
    public async Task SeedAsync()
    {
        if (_context.Testimonials.Any())
        {
            _logger.LogInformation("Testimonials already exist, skipping seed");
            return;
        }

        try
        {
            var testimonials = new[]
            {
                new Testimonial
                {
                    Id = Guid.NewGuid(),
                    CustomerName = "Sarah Johnson",
                    Rating = 5,
                    Content = "Absolutely amazing food! The flavors are authentic and every dish is prepared with care. Highly recommend!",
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new Testimonial
                {
                    Id = Guid.NewGuid(),
                    CustomerName = "Ahmed Hassan",
                    Rating = 5,
                    Content = "This restaurant brings me back to my childhood. The food tastes exactly like my grandmother's cooking. Perfect!",
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new Testimonial
                {
                    Id = Guid.NewGuid(),
                    CustomerName = "Maria Rodriguez",
                    Rating = 4,
                    Content = "Great atmosphere, friendly staff, and delicious food. The only downside is the wait time during peak hours.",
                    CreatedAt = DateTime.UtcNow.AddDays(-6)
                },
                new Testimonial
                {
                    Id = Guid.NewGuid(),
                    CustomerName = "James Wilson",
                    Rating = 5,
                    Content = "Best Mediterranean food I've had in the city. The seafood mezze is outstanding!",
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Testimonial
                {
                    Id = Guid.NewGuid(),
                    CustomerName = "Layla Al-Rashid",
                    Rating = 5,
                    Content = "الطعام لذيذ جداً وموظفو الخدمة ودودون جداً. سأعود بالتأكيد!",
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await _context.Testimonials.AddRangeAsync(testimonials);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded {count} testimonials", testimonials.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding testimonials");
            throw;
        }
    }
}
