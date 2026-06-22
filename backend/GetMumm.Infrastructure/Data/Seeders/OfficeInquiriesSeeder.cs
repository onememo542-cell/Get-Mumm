namespace GetMumm.Infrastructure.Data.Seeders;

using GetMumm.Domain.Entities;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.Extensions.Logging;

/// <summary>
/// Seeder for OfficeInquiry entities (B2B catering inquiries).
/// </summary>
public class OfficeInquiriesSeeder
{
    private readonly GetMummDbContext _context;
    private readonly ILogger<OfficeInquiriesSeeder> _logger;

    public OfficeInquiriesSeeder(GetMummDbContext context, ILogger<OfficeInquiriesSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds sample office catering inquiries.
    /// </summary>
    public async Task SeedAsync()
    {
        if (_context.OfficeInquiries.Any())
        {
            _logger.LogInformation("Office inquiries already exist, skipping seed");
            return;
        }

        try
        {
            var inquiries = new[]
            {
                new OfficeInquiry
                {
                    Id = Guid.NewGuid(),
                    CompanyName = "Tech Solutions Inc.",
                    ContactName = "Robert Peterson",
                    Email = "robert.peterson@techsolutions.com",
                    Phone = "+1-555-456-7890",
                    HeadCount = 50,
                    DeliveryArea = "Downtown Manhattan",
                    Frequency = "Weekly",
                    Message = "We're looking for regular office catering for our employees. We need lunch delivery every Friday.",
                    CreatedAt = DateTime.UtcNow.AddDays(-4)
                },
                new OfficeInquiry
                {
                    Id = Guid.NewGuid(),
                    CompanyName = "Creative Agency Co.",
                    ContactName = "Lisa Anderson",
                    Email = "lisa.anderson@creativeagency.com",
                    Phone = "+1-555-567-8901",
                    HeadCount = 25,
                    DeliveryArea = "Brooklyn",
                    Frequency = "Monthly",
                    Message = "We host monthly team celebrations and would like to order your Mediterranean platters.",
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                }
            };

            await _context.OfficeInquiries.AddRangeAsync(inquiries);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded {count} office inquiries", inquiries.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding office inquiries");
            throw;
        }
    }
}
