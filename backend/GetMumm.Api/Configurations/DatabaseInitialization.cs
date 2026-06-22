using GetMumm.Infrastructure.Data.Contexts;
using GetMumm.Infrastructure.Data.Seeders;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace GetMumm.Api.Configurations;

public static class DatabaseInitialization
{
    public static async Task ApplyDatabaseMigrationsAsync(this WebApplication app)
    {
        try
        {
            var logger = app.Services.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Applying database migrations...");
            
            const int maxRetries = 3;
            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    using (var scope = app.Services.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<GetMummDbContext>();
                        await dbContext.Database.MigrateAsync();
                        
                        logger.LogInformation("Database migrations applied successfully");
                        
                        // Seed database
                        logger.LogInformation("Seeding database with sample data...");
                        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
                        await seeder.SeedAsync();
                        logger.LogInformation("Database seeding completed");
                    }
                    break; // Success — exit retry loop
                }
                catch (Exception ex) when (attempt < maxRetries && (
                    ex is System.Net.Sockets.SocketException ||
                    ex.InnerException is System.Net.Sockets.SocketException ||
                    ex is Npgsql.NpgsqlException ||
                    ex.InnerException is Npgsql.NpgsqlException ||
                    ex.InnerException is TimeoutException))
                {
                    var delay = TimeSpan.FromSeconds(Math.Pow(2, attempt));
                    logger.LogWarning(ex, 
                        "Database connection attempt {Attempt}/{MaxRetries} failed (SocketException). Retrying in {Delay}s...",
                        attempt, maxRetries, delay.TotalSeconds);
                    await Task.Delay(delay);
                }
            }
        }
        catch (Exception ex)
        {
            var logger = app.Services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred during database initialization. " +
                "Error type: {ErrorType}. Check your connection string and ensure Supabase is accessible.",
                ex.GetType().Name);
            // Continue running even if seeding fails — API endpoints that don't need DB will still work
        }
    }
}
