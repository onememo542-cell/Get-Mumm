namespace GetMumm.Infrastructure.Configuration;

/// <summary>
/// Database configuration settings.
/// </summary>
public class DatabaseSettings
{
    public string Provider { get; set; } = "PostgreSQL";
    
    public string Host { get; set; } = "localhost";
    
    public int Port { get; set; } = 5432;
    
    public string Username { get; set; } = string.Empty;
    
    public string Password { get; set; } = string.Empty;
    
    public string Database { get; set; } = string.Empty;
    
    public string ConnectionString { get; set; } = string.Empty;
    
    /// <summary>
    /// Builds a connection string from individual components if not explicitly set.
    /// </summary>
    public string GetConnectionString()
    {
        if (!string.IsNullOrEmpty(ConnectionString))
        {
            return ConnectionString;
        }
        
        return $"Host={Host};Port={Port};Database={Database};Username={Username};Password={Password}";
    }
}
