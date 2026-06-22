using System.Diagnostics;
using Serilog.Context;

namespace GetMumm.Api.Middleware;

/// <summary>
/// Middleware component that logs all HTTP requests and responses using Serilog.
/// Records HTTP method, path, status code, response time, and correlation IDs for request tracing.
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    /// <summary>
    /// Initializes a new instance of the RequestLoggingMiddleware class.
    /// </summary>
    /// <param name="next">The next middleware in the pipeline</param>
    /// <param name="logger">The logger instance for recording request/response information</param>
    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Invokes the middleware to process the HTTP request and log request/response details.
    /// </summary>
    /// <param name="context">The HTTP context for the current request</param>
    public async Task InvokeAsync(HttpContext context)
    {
        // Start timing the request
        var stopwatch = Stopwatch.StartNew();

        // Get or create a correlation ID for this request
        var correlationId = GetOrCreateCorrelationId(context);
        
        // Add correlation ID to the logging context
        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            var request = context.Request;
            var requestPath = request.Path.Value ?? "/";
            var requestMethod = request.Method;
            var queryString = request.QueryString.HasValue ? request.QueryString.Value : string.Empty;

            // Log incoming request
            _logger.LogInformation(
                "Incoming HTTP Request: {Method} {Path}{QueryString} | Host: {Host} | User-Agent: {UserAgent}",
                requestMethod,
                requestPath,
                queryString,
                request.Host.Host,
                request.Headers.UserAgent.FirstOrDefault() ?? "Unknown");

            // Capture the original response body stream
            var originalBodyStream = context.Response.Body;
            using var responseBodyStream = new MemoryStream();
            context.Response.Body = responseBodyStream;

            try
            {
                // Call the next middleware
                await _next(context);

                // Stop timing
                stopwatch.Stop();

                var response = context.Response;
                var statusCode = response.StatusCode;
                var elapsedMilliseconds = stopwatch.ElapsedMilliseconds;

                // Log outgoing response
                _logger.LogInformation(
                    "Outgoing HTTP Response: {Method} {Path} | Status: {StatusCode} | Duration: {ElapsedMilliseconds}ms",
                    requestMethod,
                    requestPath,
                    statusCode,
                    elapsedMilliseconds);

                // Copy the response body to the original stream
                await responseBodyStream.CopyToAsync(originalBodyStream);
            }
            catch (Exception exception)
            {
                stopwatch.Stop();
                var elapsedMilliseconds = stopwatch.ElapsedMilliseconds;

                // Log unhandled exception during request processing
                _logger.LogError(exception,
                    "Unhandled Exception during HTTP Request: {Method} {Path} | Duration: {ElapsedMilliseconds}ms",
                    requestMethod,
                    requestPath,
                    elapsedMilliseconds);

                // Copy the response body to the original stream even on error
                await responseBodyStream.CopyToAsync(originalBodyStream);
                throw;
            }
            finally
            {
                context.Response.Body = originalBodyStream;
            }
        }
    }

    /// <summary>
    /// Gets an existing correlation ID from the request headers or creates a new one.
    /// The correlation ID is used to trace a single logical request across the application.
    /// </summary>
    /// <param name="context">The HTTP context</param>
    /// <returns>The correlation ID (existing or newly generated)</returns>
    private static string GetOrCreateCorrelationId(HttpContext context)
    {
        const string correlationIdHeader = "X-Correlation-ID";
        const string traceIdHeader = "X-Trace-ID";

        // Check if correlation ID already exists in request headers
        if (context.Request.Headers.TryGetValue(correlationIdHeader, out var correlationId))
        {
            var correlationIdValue = correlationId.FirstOrDefault();
            if (!string.IsNullOrEmpty(correlationIdValue))
            {
                // Add to response headers as well
                context.Response.Headers[correlationIdHeader] = correlationIdValue;
                return correlationIdValue;
            }
        }

        // Generate a new correlation ID if not present
        var newCorrelationId = $"{context.TraceIdentifier}-{Guid.NewGuid():N}";
        
        // Add correlation ID to request and response headers
        context.Request.Headers[correlationIdHeader] = newCorrelationId;
        context.Response.Headers[correlationIdHeader] = newCorrelationId;
        context.Response.Headers[traceIdHeader] = context.TraceIdentifier;

        return newCorrelationId;
    }
}

