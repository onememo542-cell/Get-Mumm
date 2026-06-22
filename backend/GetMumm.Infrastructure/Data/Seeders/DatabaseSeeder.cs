namespace GetMumm.Infrastructure.Data.Seeders;

using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.Extensions.Logging;

/// <summary>
/// Main database seeder orchestrator.
/// Coordinates seeding of all entity types through individual seeders.
/// </summary>
public class DatabaseSeeder
{
    private readonly GetMummDbContext _context;
    private readonly ILogger<DatabaseSeeder> _logger;
    private readonly CategoriesSeeder _categoriesSeeder;
    private readonly ChefsSeeder _chefsSeeder;
    private readonly MenuItemsSeeder _menuItemsSeeder;
    private readonly BlogPostsSeeder _blogPostsSeeder;
    private readonly TestimonialsSeeder _testimonialsSeeder;
    private readonly SubscriptionsSeeder _subscriptionsSeeder;
    private readonly ContactsSeeder _contactsSeeder;
    private readonly OfficeInquiriesSeeder _officeInquiriesSeeder;

    public DatabaseSeeder(
        GetMummDbContext context,
        ILogger<DatabaseSeeder> logger,
        CategoriesSeeder categoriesSeeder,
        ChefsSeeder chefsSeeder,
        MenuItemsSeeder menuItemsSeeder,
        BlogPostsSeeder blogPostsSeeder,
        TestimonialsSeeder testimonialsSeeder,
        SubscriptionsSeeder subscriptionsSeeder,
        ContactsSeeder contactsSeeder,
        OfficeInquiriesSeeder officeInquiriesSeeder)
    {
        _context = context;
        _logger = logger;
        _categoriesSeeder = categoriesSeeder;
        _chefsSeeder = chefsSeeder;
        _menuItemsSeeder = menuItemsSeeder;
        _blogPostsSeeder = blogPostsSeeder;
        _testimonialsSeeder = testimonialsSeeder;
        _subscriptionsSeeder = subscriptionsSeeder;
        _contactsSeeder = contactsSeeder;
        _officeInquiriesSeeder = officeInquiriesSeeder;
    }

    /// <summary>
    /// Orchestrates all database seeding operations in proper order.
    /// Seeds in dependency order: Categories, Chefs, then MenuItems (which depend on above).
    /// </summary>
    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Starting database seeding orchestration...");

            // Seed base data first (no dependencies)
            await _categoriesSeeder.SeedAsync();
            await _chefsSeeder.SeedAsync();

            // Seed data that depends on base data
            await _menuItemsSeeder.SeedAsync();

            // Seed independent data
            await _blogPostsSeeder.SeedAsync();
            await _testimonialsSeeder.SeedAsync();
            await _subscriptionsSeeder.SeedAsync();
            await _contactsSeeder.SeedAsync();
            await _officeInquiriesSeeder.SeedAsync();

            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during database seeding");
            throw;
        }
    }
}
