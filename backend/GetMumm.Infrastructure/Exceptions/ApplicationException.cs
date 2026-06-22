namespace GetMumm.Infrastructure.Exceptions;

/// <summary>
/// Base exception class for all application-specific exceptions.
/// Provides a consistent way to handle errors with HTTP status code mapping.
/// </summary>
public class ApplicationException : Exception
{
    /// <summary>
    /// Gets the HTTP status code associated with this exception.
    /// </summary>
    public int StatusCode { get; }

    /// <summary>
    /// Initializes a new instance of the ApplicationException class.
    /// </summary>
    /// <param name="message">The error message.</param>
    /// <param name="statusCode">The HTTP status code (default: 500).</param>
    /// <param name="innerException">The inner exception if any.</param>
    public ApplicationException(
        string message,
        int statusCode = StatusCodes.Status500InternalServerError,
        Exception? innerException = null)
        : base(message, innerException)
    {
        StatusCode = statusCode;
    }
}
