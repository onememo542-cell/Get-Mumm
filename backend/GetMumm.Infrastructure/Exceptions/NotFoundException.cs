namespace GetMumm.Infrastructure.Exceptions;

/// <summary>
/// Exception thrown when a requested resource is not found.
/// Maps to HTTP 404 Not Found status code.
/// </summary>
public class NotFoundException : ApplicationException
{
    /// <summary>
    /// Initializes a new instance of the NotFoundException class.
    /// </summary>
    /// <param name="message">The error message describing what was not found.</param>
    /// <param name="innerException">The inner exception if any.</param>
    public NotFoundException(string message, Exception? innerException = null)
        : base(message, StatusCodes.Status404NotFound, innerException)
    {
    }

    /// <summary>
    /// Initializes a new instance of the NotFoundException class with a standard message format.
    /// </summary>
    /// <param name="resourceName">The name of the resource that was not found (e.g., "MenuItem", "Chef").</param>
    /// <param name="id">The ID of the resource that was not found.</param>
    public NotFoundException(string resourceName, int id)
        : this($"{resourceName} with ID {id} was not found.")
    {
    }
}
