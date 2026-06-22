using GetMumm.Api.Extensions;
using GetMumm.Api.Middleware;
using GetMumm.Infrastructure.Configuration;
using GetMumm.Infrastructure.Data.Contexts;
using GetMumm.Infrastructure.Data.Seeders;
using GetMumm.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog((context, config) =>
{
    config
        .MinimumLevel.Information()
        .Enrich.FromLogContext()
        .Enrich.WithEnvironmentUserName()
        .Enrich.WithThreadId()
        .WriteTo.Console()
        .WriteTo.File(
            "logs/app-.txt",
            rollingInterval: RollingInterval.Day,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}");
});

// Add services to the container.
builder.Services.AddControllers(options =>
{
    options.ReturnHttpNotAcceptable = true;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Get Mumm API",
        Version = "v1",
        Description = "ASP.NET Core backend for Get Mumm restaurant"
    });
});

// Add CORS
builder.Services.AddCors(options =>
{
    var corsSettings = new CorsSettings();
    builder.Configuration.GetSection("Cors").Bind(corsSettings);
    var allowedOrigins = corsSettings.GetAllowedOrigins();
    
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Add JSON options
builder.Services.Configure<JsonOptions>(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

// Add application and infrastructure services
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

// Apply migrations and seed database
try
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Applying database migrations...");
    
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
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during database initialization");
    // Continue running even if seeding fails
}

// Configure the HTTP request pipeline.
app.UseSerilogRequestLogging();

// Add middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Get Mumm API v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
