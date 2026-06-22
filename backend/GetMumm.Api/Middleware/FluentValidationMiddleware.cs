using FluentValidation;
using GetMumm.Application.DTOs;
using GetMumm.Infrastructure.Exceptions;
using System.Reflection;
using System.Text.Json;
using ApplicationValidationException = GetMumm.Infrastructure.Exceptions.ValidationException;

namespace GetMumm.Api.Middleware;

/// <summary>
/// Middleware component that validates request DTOs using FluentValidation.
/// Intercepts HTTP requests, validates request bodies containing DTOs before they reach controllers,
/// and returns HTTP 400 with detailed field-level error messages on validation failure.
/// </summary>
public class FluentValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<FluentValidationMiddleware> _logger;
    private readonly IServiceProvider _serviceProvider;

    /// <summary>
    /// Initializes a new instance of the FluentValidationMiddleware class.
    /// </summary>
    /// <param name="next">The next middleware in the pipeline.</param>
    /// <param name="logger">The logger instance for recording validation errors.</param>
    /// <param name="serviceProvider">The service provider for resolving validators.</param>
    public FluentValidationMiddleware(RequestDelegate next, ILogger<FluentValidationMiddleware> logger, IServiceProvider serviceProvider)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    }

    /// <summary>
    /// Invokes the middleware to process the HTTP request.
    /// Validates request DTOs before passing the request to the next middleware.
    /// </summary>
    /// <param name="context">The HTTP context for the current request.</param>
    public async Task InvokeAsync(HttpContext context)
    {
        // Only validate POST, PUT, and PATCH requests with request bodies
        if (!IsValidationRequiredForMethod(context.Request.Method))
        {
            await _next(context);
            return;
        }

        // Skip if no content-type header
        if (string.IsNullOrEmpty(context.Request.ContentType))
        {
            await _next(context);
            return;
        }

        // Only validate JSON content
        if (!context.Request.ContentType.Contains("application/json", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        // Read the request body
        context.Request.EnableBuffering();
        var requestBody = await new StreamReader(context.Request.Body).ReadToEndAsync();
        context.Request.Body.Position = 0;

        // Skip if empty body
        if (string.IsNullOrEmpty(requestBody))
        {
            await _next(context);
            return;
        }

        try
        {
            // Validate the request body against registered validators
            await ValidateRequestBodyAsync(context, requestBody);
        }
        catch (ApplicationValidationException validationException)
        {
            _logger.LogWarning("Validation failed for request to {Path}: {@Errors}", 
                context.Request.Path, validationException.Errors);
            
            // Let exception handling middleware catch and format the response
            throw;
        }

        // If validation passes, proceed to next middleware
        await _next(context);
    }

    /// <summary>
    /// Determines whether validation is required for the given HTTP method.
    /// </summary>
    private static bool IsValidationRequiredForMethod(string method)
    {
        return method.Equals(HttpMethods.Post, StringComparison.OrdinalIgnoreCase) ||
               method.Equals(HttpMethods.Put, StringComparison.OrdinalIgnoreCase) ||
               method.Equals(HttpMethods.Patch, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Validates the request body against registered FluentValidation validators.
    /// </summary>
    /// <param name="context">The HTTP context for the current request.</param>
    /// <param name="requestBody">The JSON request body as a string.</param>
    private async Task ValidateRequestBodyAsync(HttpContext context, string requestBody)
    {
        // Try to deserialize the JSON to determine the DTO type
        using var jsonDocument = JsonDocument.Parse(requestBody);
        var rootElement = jsonDocument.RootElement;

        // Map common API endpoints to their expected DTO types
        var dtoType = GetDtoTypeForEndpoint(context.Request.Path);
        if (dtoType == null)
        {
            // No specific DTO type mapped for this endpoint
            return;
        }

        try
        {
            // Deserialize JSON to the expected DTO type
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var dto = JsonSerializer.Deserialize(requestBody, dtoType, options);

            if (dto == null)
            {
                return; // No validation needed for null requests
            }

            // Get the validator for this DTO type
            var validatorType = typeof(IValidator<>).MakeGenericType(dtoType);
            var validator = _serviceProvider.GetService(validatorType);

            if (validator == null)
            {
                // No validator registered for this DTO type
                return;
            }

            // Invoke ValidateAsync method on the validator
            var validateAsyncMethod = validatorType.GetMethod("ValidateAsync", 
                new[] { dtoType, typeof(CancellationToken) });
            
            if (validateAsyncMethod == null)
            {
                return;
            }

            var validationTask = (Task)validateAsyncMethod.Invoke(validator, new[] { dto, default(CancellationToken) })!;
            await validationTask;

            // Get the Result property from the validation task
            var resultProperty = validationTask.GetType().GetProperty("Result");
            var validationResult = resultProperty?.GetValue(validationTask);

            if (validationResult == null)
            {
                return;
            }

            // Check if validation failed
            var isValidProperty = validationResult.GetType().GetProperty("IsValid");
            var isValid = (bool?)isValidProperty?.GetValue(validationResult) ?? true;

            if (!isValid)
            {
                // Extract error messages
                var errorsProperty = validationResult.GetType().GetProperty("Errors");
                var errorsObject = errorsProperty?.GetValue(validationResult);
                
                var errorsDictionary = ExtractValidationErrors(errorsObject);
                throw new ApplicationValidationException("One or more validation failures have occurred.", errorsDictionary);
            }
        }
        catch (JsonException jsonException)
        {
            _logger.LogWarning("Invalid JSON in request body: {JsonException}", jsonException.Message);
            // Invalid JSON, let the exception handling middleware handle it
            throw;
        }
        catch (ApplicationValidationException)
        {
            // Re-throw validation exceptions to be handled by exception middleware
            throw;
        }
        catch (Exception exception)
        {
            _logger.LogWarning(exception, "An error occurred during request validation");
            // Other errors don't block the request
        }
    }

    /// <summary>
    /// Determines the DTO type expected for a given API endpoint path.
    /// </summary>
    private static Type? GetDtoTypeForEndpoint(PathString path)
    {
        var pathValue = path.Value?.ToLowerInvariant() ?? string.Empty;

        // Map endpoints to their request DTO types
        return pathValue switch
        {
            var p when p.StartsWith("/api/contact") && p.Contains("office-inquiry") => 
                typeof(SubmitOfficeInquiryRequest),
            var p when p.StartsWith("/api/contact") && !p.Contains("office-inquiry") => 
                typeof(SubmitContactRequest),
            var p when p.StartsWith("/api/menu/items") && !p.Contains("/items/") => 
                typeof(MenuItemFilterDto),
            var p when p.StartsWith("/api/subscriptions") => 
                typeof(SubscriptionDto),
            _ => null
        };
    }

    /// <summary>
    /// Extracts validation errors from the FluentValidation error collection.
    /// </summary>
    /// <param name="errorsObject">The collection of validation errors.</param>
    /// <returns>A dictionary mapping field names to their error messages.</returns>
    private static Dictionary<string, string[]> ExtractValidationErrors(object? errorsObject)
    {
        var errorsDictionary = new Dictionary<string, string[]>();

        if (errorsObject == null)
        {
            return errorsDictionary;
        }

        // Cast to IEnumerable to iterate through errors
        if (errorsObject is not System.Collections.IEnumerable errors)
        {
            return errorsDictionary;
        }

        foreach (var error in errors)
        {
            if (error == null)
            {
                continue;
            }

            // Get PropertyName and ErrorMessage from the validation failure
            var propertyNameProperty = error.GetType().GetProperty("PropertyName");
            var errorMessageProperty = error.GetType().GetProperty("ErrorMessage");

            var propertyName = (string?)propertyNameProperty?.GetValue(error) ?? "Unknown";
            var errorMessage = (string?)errorMessageProperty?.GetValue(error) ?? "Unknown error";

            if (errorsDictionary.ContainsKey(propertyName))
            {
                // Add to existing property errors
                var existingErrors = errorsDictionary[propertyName].ToList();
                existingErrors.Add(errorMessage);
                errorsDictionary[propertyName] = existingErrors.ToArray();
            }
            else
            {
                // Create new property error entry
                errorsDictionary[propertyName] = new[] { errorMessage };
            }
        }

        return errorsDictionary;
    }
}
