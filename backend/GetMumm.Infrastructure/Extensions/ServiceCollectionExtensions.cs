namespace GetMumm.Infrastructure.Extensions;

using GetMumm.Application.Interfaces;
using GetMumm.Domain.Interfaces;
using GetMumm.Infrastructure.Configuration;
using GetMumm.Infrastructure.Data.Repositories;
using GetMumm.Infrastructure.Data.Contexts;
using GetMumm.Infrastructure.Data.Seeders;
using GetMumm.Infrastructure.ExternalServices;
using GetMumm.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

/// <summary>
/// Extension methods for registering infrastructure layer services.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds infrastructure layer services to the DI container.
    /// </summary>
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Bind strongly-typed configuration
        services.Configure<DatabaseSettings>(configuration.GetSection("Database"));
        services.Configure<SupabaseSettings>(configuration.GetSection("Supabase"));
        services.Configure<CorsSettings>(configuration.GetSection("Cors"));
        
        // Register DbContext
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<GetMummDbContext>(options =>
            options.UseNpgsql(connectionString,
                b => b.MigrationsAssembly("GetMumm.Infrastructure")));
        
        // Register generic repository
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        
        // Register external services
        services.AddScoped<ISupabaseService, SupabaseService>();
        
        // Register caching service
        services.AddMemoryCache();
        services.AddScoped<ICacheService, CacheService>();
        
        // Register individual seeders
        services.AddScoped<CategoriesSeeder>();
        services.AddScoped<ChefsSeeder>();
        services.AddScoped<MenuItemsSeeder>();
        services.AddScoped<BlogPostsSeeder>();
        services.AddScoped<TestimonialsSeeder>();
        services.AddScoped<SubscriptionsSeeder>();
        services.AddScoped<ContactsSeeder>();
        services.AddScoped<OfficeInquiriesSeeder>();
        
        // Register main database seeder orchestrator
        services.AddScoped<DatabaseSeeder>();
        
        return services;
    }
}
