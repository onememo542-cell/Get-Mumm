using GetMumm.Api.Configurations;
using GetMumm.Api.Extensions;
using GetMumm.Infrastructure.Extensions;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Serilog
builder.Host.ConfigureSerilog();

// 2. Add controllers and JSON options configuration
builder.Services.AddControllersConfiguration();

// Add CORS, Swagger, and other configurations
builder.Services.AddCorsConfiguration(builder.Configuration);
builder.Services.AddSwaggerConfiguration();

// Add application and infrastructure services
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

// 3. Apply database migrations and seed data
await app.ApplyDatabaseMigrationsAsync();

// 4. Configure the HTTP request pipeline
app.ConfigurePipeline();

app.Run();
