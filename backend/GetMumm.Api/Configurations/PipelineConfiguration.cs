using GetMumm.Api.Middleware;
using Serilog;

namespace GetMumm.Api.Configurations;

public static class PipelineConfiguration
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // ── 1. Static files — MUST come first, before any middleware that wraps
        //       Response.Body. RequestLoggingMiddleware replaces the body stream with
        //       a MemoryStream; if static files run inside that, Content-Length is
        //       negotiated before the body bytes arrive and you get a stream mismatch.
        app.UseDefaultFiles(new DefaultFilesOptions
        {
            DefaultFileNames = new List<string> { "index.html" }
        });
        app.UseStaticFiles();

        // ── 2. Swagger UI lives at /swagger so index.html can own the root /
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Get Mumm API v1");
            options.RoutePrefix = "swagger";
        });

        // ── 3. Custom 404 page — also runs BEFORE RequestLoggingMiddleware.
        //       SendFileAsync uses ISendFileFeature and bypasses a swapped body stream,
        //       so we must intercept here while the real stream is still active.
        //       We use File.ReadAllBytesAsync + WriteAsync so the response body is
        //       written through the normal pipeline without stream-swap side-effects.
        app.Use(async (context, next) =>
        {
            await next();

            if (context.Response.StatusCode == 404
                && !context.Response.HasStarted
                && !context.Request.Path.StartsWithSegments("/api"))
            {
                var webRoot = app.Environment.WebRootPath
                              ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
                var notFoundPage = Path.Combine(webRoot, "404.html");

                if (File.Exists(notFoundPage))
                {
                    var html = await File.ReadAllBytesAsync(notFoundPage);
                    context.Response.StatusCode  = 404;
                    context.Response.ContentType = "text/html; charset=utf-8";
                    context.Response.ContentLength = html.Length;
                    await context.Response.Body.WriteAsync(html);
                }
            }
        });

        // ── 4. Request / response logging, rate-limiting, validation, exception handling
        app.UseSerilogRequestLogging();
        app.UseMiddleware<RequestLoggingMiddleware>();
        app.UseMiddleware<RateLimitingMiddleware>();
        app.UseMiddleware<FluentValidationMiddleware>();
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        app.UseHttpsRedirection();
        app.UseCors("AllowFrontend");
        app.UseAuthorization();
        app.MapControllers();

        return app;
    }
}
