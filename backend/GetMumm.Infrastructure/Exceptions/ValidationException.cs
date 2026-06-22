namespace GetMumm.Infrastructure.Exceptions;

/// <summary>
/// Exception thrown when request validation fails.
/// Maps to HTTP 422 Unprocessable Entity status code.
/// Includes field-level error details for clients to display validation messages.
/// </summary>
public class ValidationException : ApplicationException
{
    /// <summary>
    /// Gets a dictionary of validation errors keyed by field name.
    /// </summary>
    public Dictionary<string, string[]> Errors { get; }

    /// <summary>
    /// Initializes a new instance of the ValidationException class.
    /// </summary>
    /// <param name="message">The error message.</param>
    /// <param name="errors">Dictionary of field-level validation errors.</param>
    public ValidationException(string message, Dictionary<string, string[]> errors)
        : base(message, StatusCodes.Status422UnprocessableEntity)
    {
        Errors = errors ?? new Dictionary<string, string[]>();
    }

    /// <summary>
    /// Initializes a new instance of the ValidationException class with a single error.
    /// </summary>
    /// <param name="fieldName">The name of the field that failed validation.</param>
    /// <param name="errorMessage">The validation error message.</param>
    public ValidationException(string fieldName, string errorMessage)
        : this(
            "One or more validation failures have occurred.",
            new Dictionary<string, string[]> { { fieldName, new[] { errorMessage } } })
    {
    }
}
