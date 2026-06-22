using GetMumm.Application.DTOs;
using GetMumm.Infrastructure.Exceptions;

namespace GetMumm.Api.Middleware;

/// <summary>
/// Middleware component that handles all unhandled exceptions in the application.
/// Catches exceptions, logs them, and returns standardized error responses to clients.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    /// <summary>
    /// Initializes a new instance of the ExceptionHandlingMiddleware class.
    /// </summary>
    /// <param name="next">The next middleware in the pipeline.</param>
    /// <param name="logger">The logger instance for recording exceptions.</param>
    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Invokes the middleware to process the HTTP request.
    /// Wraps the next middleware in a try-catch to handle all exceptions.
    /// </summary>
    /// <param name="context">The HTTP context for the current request.</param>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    /// <summary>
    /// Handles the exception by logging it and returning an appropriate error response.
    /// Maps application exceptions to their configured HTTP status codes.
    /// </summary>
    /// <param name="context">The HTTP context for the current request.</param>
    /// <param name="exception">The exception that was thrown.</param>
    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "An unhandled exception occurred: {ExceptionMessage}", exception.Message);

        var response = context.Response;
        response.ContentType = "application/json";

        var errorResponse = new ErrorResponse
        {
            Type = exception.GetType().Name,
            Message = exception.Message,
            TraceId = context.TraceIdentifier,
            Timestamp = DateTime.UtcNow
        };

        // Handle application-specific exceptions with custom status codes
        if (exception is Infrastructure.Exceptions.ApplicationException appException)
        {
            response.StatusCode = appException.StatusCode;

            // Include field-level validation errors if present
            if (exception is ValidationException validationException)
            {
                errorResponse.Errors = validationException.Errors;
            }
        }
        else
        {
            // Handle unexpected exceptions with 500 Internal Server Error
            response.StatusCode = StatusCodes.Status500InternalServerError;

            // In production, don't expose stack traces or sensitive details
            if (!IsProduction())
            {
                errorResponse.Message = $"{exception.Message}\n{exception.StackTrace}";
            }
            else
            {
                errorResponse.Message = "An unexpected error occurred. Please contact support with trace ID.";
            }
        }

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(errorResponse, options);

        return response.WriteAsync(json);
    }

    /// <summary>
    /// Determines if the application is running in production environment.
    /// </summary>
    /// <returns>True if in production; false otherwise.</returns>
    private bool IsProduction()
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        return environment?.Equals("Production", StringComparison.OrdinalIgnoreCase) ?? false;
    }
}
