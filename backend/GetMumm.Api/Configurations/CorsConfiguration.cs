using GetMumm.Infrastructure.Configuration;

namespace GetMumm.Api.Configurations;

public static class CorsConfiguration
{
    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            var corsSettings = new CorsSettings();
            configuration.GetSection("Cors").Bind(corsSettings);
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

        return services;
    }
}
