using Testcontainers.PostgreSql;
using GetMumm.Infrastructure.Data.Contexts;
using Microsoft.EntityFrameworkCore;

namespace GetMumm.Tests.Fixtures;

/// <summary>
/// Fixture for integration tests using TestContainers PostgreSQL.
/// Provides real database instance for end-to-end testing.
/// </summary>
public class IntegrationTestFixture : IAsyncLifetime
{
    private PostgreSqlContainer? _container;
    private GetMummDbContext? _dbContext;
    private string? _connectionString;

    public GetMummDbContext DbContext => _dbContext ?? throw new InvalidOperationException("DbContext not initialized");
    public string ConnectionString => _connectionString ?? throw new InvalidOperationException("Connection string not set");

    /// <summary>
    /// Initialize PostgreSQL container and database.
    /// </summary>
    public async Task InitializeAsync()
    {
        _container = new PostgreSqlBuilder()
            .WithImage("postgres:16-alpine")
            .WithDatabase("getmumm_test")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .Build();

        await _container.StartAsync();
        
        _connectionString = _container.GetConnectionString();
        
        // Create DbContext with test database
        var options = new DbContextOptionsBuilder<GetMummDbContext>()
            .UseNpgsql(_connectionString)
            .Options;

        _dbContext = new GetMummDbContext(options);
        
        // Ensure database is created and migrations applied
        await _dbContext.Database.EnsureDeletedAsync();
        await _dbContext.Database.MigrateAsync();
    }

    /// <summary>
    /// Reset the database to clean state between tests.
    /// </summary>
    public async Task ResetDatabaseAsync()
    {
        if (_dbContext != null)
        {
            await _dbContext.Database.EnsureDeletedAsync();
            await _dbContext.Database.MigrateAsync();
        }
    }

    /// <summary>
    /// Dispose resources and stop container.
    /// </summary>
    public async Task DisposeAsync()
    {
        if (_dbContext != null)
        {
            await _dbContext.DisposeAsync();
        }

        if (_container != null)
        {
            await _container.StopAsync();
        }
    }
}
