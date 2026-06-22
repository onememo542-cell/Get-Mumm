namespace GetMumm.Infrastructure.Data.Seeders;

using GetMumm.Domain.Entities;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.Extensions.Logging;

/// <summary>
/// Seeder for Contact entities (sample contact submissions).
/// </summary>
public class ContactsSeeder
{
    private readonly GetMummDbContext _context;
    private readonly ILogger<ContactsSeeder> _logger;

    public ContactsSeeder(GetMummDbContext context, ILogger<ContactsSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds sample contact submissions.
    /// </summary>
    public async Task SeedAsync()
    {
        if (_context.Contacts.Any())
        {
            _logger.LogInformation("Contacts already exist, skipping seed");
            return;
        }

        try
        {
            var contacts = new[]
            {
                new Contact
                {
                    Id = Guid.NewGuid(),
                    Name = "John Smith",
                    Email = "john.smith@example.com",
                    Phone = "+1-555-123-4567",
                    Subject = "Catering Inquiry",
                    Message = "Hello, I'm interested in catering services for my upcoming corporate event. Could you provide pricing information?",
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Contact
                {
                    Id = Guid.NewGuid(),
                    Name = "Emma Wilson",
                    Email = "emma.wilson@example.com",
                    Phone = "+1-555-234-5678",
                    Subject = "Menu Question",
                    Message = "Are your vegetarian options suitable for vegans? Please provide details about ingredients.",
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Contact
                {
                    Id = Guid.NewGuid(),
                    Name = "David Brown",
                    Email = "david.brown@example.com",
                    Phone = "+1-555-345-6789",
                    Subject = "Feedback",
                    Message = "Thank you for the wonderful dining experience! Your food was excellent and the service was exceptional.",
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await _context.Contacts.AddRangeAsync(contacts);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded {count} contact submissions", contacts.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding contacts");
            throw;
        }
    }
}
