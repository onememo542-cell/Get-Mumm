namespace GetMumm.Application.DTOs;

/// <summary>
/// Health check response DTO indicating service status and database connectivity
/// </summary>
public class HealthCheckResponse
{
    /// <summary>
    /// Health status: "Healthy" or "Unhealthy"
    /// </summary>
    public string Status { get; set; } = "Healthy";

    /// <summary>
    /// Timestamp when health check was performed
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Optional message providing additional status information
    /// </summary>
    public string Message { get; set; } = "Service is operational";

    /// <summary>
    /// Database connectivity status
    /// </summary>
    public bool DatabaseConnected { get; set; } = true;
}
