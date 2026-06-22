using GetMumm.Api.Middleware;
using Serilog;

namespace GetMumm.Api.Configurations;

public static class PipelineConfiguration
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // Configure the HTTP request pipeline.
        app.UseSerilogRequestLogging();

        // Add middleware (order matters - logging first, then rate limiting, then validation, then exception handling)
        app.UseMiddleware<RequestLoggingMiddleware>();
        app.UseMiddleware<RateLimitingMiddleware>();
        app.UseMiddleware<FluentValidationMiddleware>();
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        // Enable Swagger in all environments for deployment testing
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Get Mumm API v1");
            options.RoutePrefix = string.Empty; // Optional: serves swagger UI at the app's root (http://get-mumm.runasp.net/)
        });

        app.UseHttpsRedirection();
        app.UseCors("AllowFrontend");
        app.UseAuthorization();
        app.MapControllers();

        return app;
    }
}
