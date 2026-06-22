namespace GetMumm.Api.Configurations;

public static class SwaggerConfiguration
{
    public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            {
                Title = "Get Mumm API",
                Version = "v1",
                Description = "ASP.NET Core backend for Get Mumm restaurant"
            });
        });

        return services;
    }
}
