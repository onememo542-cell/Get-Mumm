namespace GetMumm.Application.DTOs;

/// <summary>
/// Standardized error response DTO returned by the exception handling middleware.
/// Provides consistent error information to API clients.
/// </summary>
public class ErrorResponse
{
    /// <summary>
    /// Gets or sets the exception type name (e.g., "NotFoundException", "ValidationException").
    /// Used by clients to determine error category and appropriate handling.
    /// </summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the human-readable error message.
    /// Safe to display to end users (no sensitive information).
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets field-level validation errors (if applicable).
    /// Only populated for validation failures (HTTP 422).
    /// Format: { "fieldName": ["error1", "error2"], ... }
    /// </summary>
    public Dictionary<string, string[]>? Errors { get; set; }

    /// <summary>
    /// Gets or sets the trace ID for correlating requests and responses in logs.
    /// Useful for debugging and support investigations.
    /// </summary>
    public string? TraceId { get; set; }

    /// <summary>
    /// Gets or sets the timestamp (UTC) when the error occurred.
    /// Helps clients understand when the error happened.
    /// </summary>
    public DateTime Timestamp { get; set; }
}
