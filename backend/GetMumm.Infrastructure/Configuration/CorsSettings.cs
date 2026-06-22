namespace GetMumm.Infrastructure.Configuration;

/// <summary>
/// CORS configuration settings.
/// </summary>
public class CorsSettings
{
    public string[] AllowedOrigins { get; set; } = Array.Empty<string>();
    
    /// <summary>
    /// Gets the allowed origins as an array, parsing from comma-separated string if necessary.
    /// </summary>
    public string[] GetAllowedOrigins()
    {
        if (AllowedOrigins != null && AllowedOrigins.Length > 0)
        {
            return AllowedOrigins;
        }
        
        return Array.Empty<string>();
    }
}
