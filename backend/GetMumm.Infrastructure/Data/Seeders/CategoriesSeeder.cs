namespace GetMumm.Infrastructure.Data.Seeders;

using GetMumm.Domain.Entities;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.Extensions.Logging;

/// <summary>
/// Seeder for Category entities.
/// </summary>
public class CategoriesSeeder
{
    private readonly GetMummDbContext _context;
    private readonly ILogger<CategoriesSeeder> _logger;

    public CategoriesSeeder(GetMummDbContext context, ILogger<CategoriesSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds menu categories.
    /// </summary>
    public async Task SeedAsync()
    {
        if (_context.Categories.Any())
        {
            _logger.LogInformation("Categories already exist, skipping seed");
            return;
        }

        try
        {
            var categories = new[]
            {
                new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Appetizers",
                    NameAr = "المقبلات",
                    Description = "Delicious starters to begin your meal",
                    DescriptionAr = "بدايات لذيذة لتبدأ وجبتك",
                    ImageUrl = "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
                    ItemCount = 5,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Main Courses",
                    NameAr = "الأطباق الرئيسية",
                    Description = "Our signature main dishes",
                    DescriptionAr = "أطباقنا الرئيسية الموقعة",
                    ImageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
                    ItemCount = 8,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Desserts",
                    NameAr = "الحلويات",
                    Description = "Sweet endings to your meal",
                    DescriptionAr = "نهايات حلوة لوجبتك",
                    ImageUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
                    ItemCount = 4,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Beverages",
                    NameAr = "المشروبات",
                    Description = "Refreshing drinks and beverages",
                    DescriptionAr = "المشروبات المنعشة",
                    ImageUrl = "https://images.unsplash.com/photo-1608270861620-7c40579d0b45?w=400",
                    ItemCount = 3,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await _context.Categories.AddRangeAsync(categories);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded {count} categories", categories.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding categories");
            throw;
        }
    }
}
