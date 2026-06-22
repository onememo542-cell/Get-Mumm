namespace GetMumm.Infrastructure.Exceptions;

/// <summary>
/// Exception thrown when a request contains invalid data or parameters.
/// Maps to HTTP 400 Bad Request status code.
/// </summary>
public class BadRequestException : ApplicationException
{
    /// <summary>
    /// Initializes a new instance of the BadRequestException class.
    /// </summary>
    /// <param name="message">The error message describing what is invalid.</param>
    /// <param name="innerException">The inner exception if any.</param>
    public BadRequestException(string message, Exception? innerException = null)
        : base(message, StatusCodes.Status400BadRequest, innerException)
    {
    }
}
