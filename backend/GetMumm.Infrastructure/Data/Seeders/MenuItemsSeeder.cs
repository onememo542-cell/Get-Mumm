namespace GetMumm.Infrastructure.Data.Seeders;

using GetMumm.Domain.Entities;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.Extensions.Logging;

/// <summary>
/// Seeder for MenuItem entities.
/// </summary>
public class MenuItemsSeeder
{
    private readonly GetMummDbContext _context;
    private readonly ILogger<MenuItemsSeeder> _logger;

    public MenuItemsSeeder(GetMummDbContext context, ILogger<MenuItemsSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds menu items with category and chef relationships.
    /// </summary>
    public async Task SeedAsync()
    {
        if (_context.MenuItems.Any())
        {
            _logger.LogInformation("Menu items already exist, skipping seed");
            return;
        }

        try
        {
            var categories = await _context.Categories.ToListAsync();
            var chefs = await _context.Chefs.ToListAsync();

            if (!categories.Any() || !chefs.Any())
            {
                _logger.LogWarning("Cannot seed menu items: missing categories or chefs");
                return;
            }

            var appetizersCategory = categories.First(c => c.Name == "Appetizers");
            var mainCoursesCategory = categories.First(c => c.Name == "Main Courses");
            var chef1 = chefs.First();
            var chef2 = chefs.ElementAtOrDefault(1) ?? chef1;

            var menuItems = new[]
            {
                new MenuItem
                {
                    Id = Guid.NewGuid(),
                    Name = "Hummus Trio",
                    NameAr = "ثلاثية الحمص",
                    Description = "Traditional hummus served three ways: classic, roasted garlic, and spiced",
                    DescriptionAr = "حمص تقليدي يقدم بثلاث طرق: كلاسيكي، ثوم محمص، ومتبل",
                    Price = 8.99m,
                    CategoryId = appetizersCategory.Id,
                    CategoryName = appetizersCategory.Name,
                    CategoryNameAr = appetizersCategory.NameAr,
                    ImageUrl = "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
                    Dietary = new[] { "Vegetarian", "Vegan", "Gluten-Free" },
                    IsAvailable = true,
                    IsFeatured = true,
                    ChefName = chef1.Name,
                    ChefNameAr = chef1.NameAr,
                    ChefId = chef1.Id,
                    Rating = 4.7m,
                    PrepTimeMinutes = 10,
                    CreatedAt = DateTime.UtcNow
                },
                new MenuItem
                {
                    Id = Guid.NewGuid(),
                    Name = "Grilled Lamb Kebab",
                    NameAr = "كباب الضأن المشوي",
                    Description = "Tender marinated lamb skewers grilled to perfection, served with pita and tahini sauce",
                    DescriptionAr = "أسياخ لحم ضأن طرية مشوية بعناية، تقدم مع الخبز والطحينة",
                    Price = 16.99m,
                    CategoryId = mainCoursesCategory.Id,
                    CategoryName = mainCoursesCategory.Name,
                    CategoryNameAr = mainCoursesCategory.NameAr,
                    ImageUrl = "https://images.unsplash.com/photo-1529193591184-fcc668cb42f5?w=400",
                    Dietary = new[] { "Gluten-Free" },
                    IsAvailable = true,
                    IsFeatured = true,
                    ChefName = chef1.Name,
                    ChefNameAr = chef1.NameAr,
                    ChefId = chef1.Id,
                    Rating = 4.9m,
                    PrepTimeMinutes = 25,
                    CreatedAt = DateTime.UtcNow
                },
                new MenuItem
                {
                    Id = Guid.NewGuid(),
                    Name = "Falafel Wrap",
                    NameAr = "لفة الفلافل",
                    Description = "Crispy falafel wrapped in fresh pita with vegetables and house-made garlic sauce",
                    DescriptionAr = "فلافل مقرمشة ملفوفة بخبز طازج مع خضار وصلصة الثوم المحلية",
                    Price = 7.99m,
                    CategoryId = appetizersCategory.Id,
                    CategoryName = appetizersCategory.Name,
                    CategoryNameAr = appetizersCategory.NameAr,
                    ImageUrl = "https://images.unsplash.com/photo-1605271557592-5d25410bd969?w=400",
                    Dietary = new[] { "Vegetarian", "Vegan" },
                    IsAvailable = true,
                    IsFeatured = false,
                    ChefName = chef2.Name,
                    ChefNameAr = chef2.NameAr,
                    ChefId = chef2.Id,
                    Rating = 4.5m,
                    PrepTimeMinutes = 12,
                    CreatedAt = DateTime.UtcNow
                },
                new MenuItem
                {
                    Id = Guid.NewGuid(),
                    Name = "Seafood Mezze",
                    NameAr = "مزة المأكولات البحرية",
                    Description = "Assortment of fresh grilled shrimp, squid, and fish with seasonal vegetables",
                    DescriptionAr = "مشكلة من الروبيان والحبار والسمك المشوي مع خضار موسمية",
                    Price = 18.99m,
                    CategoryId = mainCoursesCategory.Id,
                    CategoryName = mainCoursesCategory.Name,
                    CategoryNameAr = mainCoursesCategory.NameAr,
                    ImageUrl = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
                    Dietary = new[] { "Gluten-Free" },
                    IsAvailable = true,
                    IsFeatured = true,
                    ChefName = chef2.Name,
                    ChefNameAr = chef2.NameAr,
                    ChefId = chef2.Id,
                    Rating = 4.8m,
                    PrepTimeMinutes = 30,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await _context.MenuItems.AddRangeAsync(menuItems);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded {count} menu items", menuItems.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding menu items");
            throw;
        }
    }
}
