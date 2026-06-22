using Microsoft.AspNetCore.Mvc;

namespace GetMumm.Api.Configurations;

public static class ControllersConfiguration
{
    public static IServiceCollection AddControllersConfiguration(this IServiceCollection services)
    {
        // Add services to the container
        services.AddControllers(options =>
        {
            options.ReturnHttpNotAcceptable = true;
        });

        // Configure JSON options
        services.Configure<JsonOptions>(options =>
        {
            options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        });

        return services;
    }
}
