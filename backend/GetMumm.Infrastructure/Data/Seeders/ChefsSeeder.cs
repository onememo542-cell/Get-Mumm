namespace GetMumm.Infrastructure.Data.Seeders;

using GetMumm.Domain.Entities;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.Extensions.Logging;

/// <summary>
/// Seeder for Chef entities.
/// </summary>
public class ChefsSeeder
{
    private readonly GetMummDbContext _context;
    private readonly ILogger<ChefsSeeder> _logger;

    public ChefsSeeder(GetMummDbContext context, ILogger<ChefsSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds chef profiles.
    /// </summary>
    public async Task SeedAsync()
    {
        if (_context.Chefs.Any())
        {
            _logger.LogInformation("Chefs already exist, skipping seed");
            return;
        }

        try
        {
            var chefs = new[]
            {
                new Chef
                {
                    Id = Guid.NewGuid(),
                    Name = "Chef Mohammed",
                    NameAr = "الشيف محمد",
                    Bio = "Award-winning chef with 15 years of experience in Middle Eastern cuisine",
                    BioAr = "شيف حائز على جوائز بخبرة 15 سنة في الطهي الشرقي الأوسط",
                    ImageUrl = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400",
                    Specialties = new[] { "Traditional Arabic", "Grilled Meats", "Kebabs" },
                    SpecialtiesAr = new[] { "العربية التقليدية", "اللحوم المشوية", "كباب" },
                    ItemCount = 12,
                    Rating = 4.8m,
                    JoinedYear = 2018,
                    CreatedAt = DateTime.UtcNow
                },
                new Chef
                {
                    Id = Guid.NewGuid(),
                    Name = "Chef Fatima",
                    NameAr = "الشيفة فاطمة",
                    Bio = "Passionate about fusion cuisine, blending traditional and modern flavors",
                    BioAr = "متحمسة لطهي الفيوجن، تمزج النكهات التقليدية والحديثة",
                    ImageUrl = "https://images.unsplash.com/photo-1507631521471-37f1ac129fbf?w=400",
                    Specialties = new[] { "Fusion Cuisine", "Seafood", "Pastries" },
                    SpecialtiesAr = new[] { "طهي الفيوجن", "المأكولات البحرية", "المعجنات" },
                    ItemCount = 8,
                    Rating = 4.6m,
                    JoinedYear = 2019,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await _context.Chefs.AddRangeAsync(chefs);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded {count} chefs", chefs.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding chefs");
            throw;
        }
    }
}
