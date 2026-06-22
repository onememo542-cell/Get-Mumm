namespace GetMumm.Infrastructure.Data.Seeders;

using GetMumm.Domain.Entities;
using GetMumm.Domain.Enums;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.Extensions.Logging;

/// <summary>
/// Seeder for BlogPost entities.
/// </summary>
public class BlogPostsSeeder
{
    private readonly GetMummDbContext _context;
    private readonly ILogger<BlogPostsSeeder> _logger;

    public BlogPostsSeeder(GetMummDbContext context, ILogger<BlogPostsSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds blog posts.
    /// </summary>
    public async Task SeedAsync()
    {
        if (_context.BlogPosts.Any())
        {
            _logger.LogInformation("Blog posts already exist, skipping seed");
            return;
        }

        try
        {
            var blogPosts = new[]
            {
                new BlogPost
                {
                    Id = Guid.NewGuid(),
                    Title = "The Art of Traditional Arabic Cuisine",
                    TitleAr = "فن الطهي العربي التقليدي",
                    Content = "Explore the rich traditions and techniques behind authentic Middle Eastern cooking. From the perfect blend of spices to the slow-cooking methods that have been passed down through generations, discover what makes traditional Arabic cuisine so special.",
                    ContentAr = "استكشف التقاليد الغنية والتقنيات وراء الطهي الشرقي الأوسط الأصيل. من المزيج المثالي للتوابل إلى طرق الطهي البطيء التي تم تناقلها عبر الأجيال...",
                    AuthorName = "Chef Mohammed",
                    AuthorNameAr = "الشيف محمد",
                    Slug = "art-of-traditional-arabic-cuisine",
                    PublishStatus = PublishStatus.Published,
                    PublishedAt = DateTime.UtcNow.AddDays(-5),
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new BlogPost
                {
                    Id = Guid.NewGuid(),
                    Title = "Fusion Cuisine: Blending East and West",
                    TitleAr = "طهي الفيوجن: دمج الشرق والغرب",
                    Content = "Discover how modern chefs are creating innovative dishes by combining traditional flavors with contemporary techniques. Learn about the philosophy behind fusion cooking and how it's revolutionizing the culinary world.",
                    ContentAr = "اكتشف كيف يقوم الطهاة المعاصرون بإنشاء أطباق مبتكرة بدمج النكهات التقليدية مع التقنيات المعاصرة. تعلم عن فلسفة طهي الفيوجن...",
                    AuthorName = "Chef Fatima",
                    AuthorNameAr = "الشيفة فاطمة",
                    Slug = "fusion-cuisine-blending-east-and-west",
                    PublishStatus = PublishStatus.Published,
                    PublishedAt = DateTime.UtcNow.AddDays(-2),
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new BlogPost
                {
                    Id = Guid.NewGuid(),
                    Title = "Seafood Selection: The Perfect Catch",
                    TitleAr = "اختيار المأكولات البحرية: الصيد المثالي",
                    Content = "Learn how to select the freshest seafood and the best cooking methods to bring out its natural flavors. Our guide covers everything from shrimp to fish to the finest calamari.",
                    ContentAr = "تعلم كيفية اختيار أطازج المأكولات البحرية وأفضل طرق الطهي لإبراز نكهاتها الطبيعية...",
                    AuthorName = "Chef Fatima",
                    AuthorNameAr = "الشيفة فاطمة",
                    Slug = "seafood-selection-perfect-catch",
                    PublishStatus = PublishStatus.Published,
                    PublishedAt = DateTime.UtcNow.AddDays(-7),
                    CreatedAt = DateTime.UtcNow.AddDays(-7)
                }
            };

            await _context.BlogPosts.AddRangeAsync(blogPosts);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded {count} blog posts", blogPosts.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding blog posts");
            throw;
        }
    }
}
