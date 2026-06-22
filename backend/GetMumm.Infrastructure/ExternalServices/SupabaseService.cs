using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Infrastructure.Configuration;

namespace GetMumm.Infrastructure.ExternalServices;

/// <summary>
/// Supabase external service implementation for fire-and-forget data synchronization.
/// Handles insertion of contacts and office inquiries without blocking the response.
/// </summary>
public class SupabaseService : ISupabaseService
{
    private readonly SupabaseSettings _supabaseSettings;
    private readonly ILogger<SupabaseService> _logger;

    public SupabaseService(IConfiguration configuration, ILogger<SupabaseService> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        
        _supabaseSettings = configuration
            .GetSection("Supabase")
            .Get<SupabaseSettings>()
            ?? throw new InvalidOperationException("Supabase configuration not found");

        if (string.IsNullOrEmpty(_supabaseSettings.Url) || string.IsNullOrEmpty(_supabaseSettings.Key))
        {
            throw new InvalidOperationException("Supabase Url and Key must be configured");
        }
    }

    /// <summary>
    /// Inserts a contact entity to Supabase asynchronously using fire-and-forget pattern.
    /// Failures are logged but do not propagate exceptions to the caller.
    /// </summary>
    public Task InsertContactAsync(Contact entity, CancellationToken cancellationToken = default)
    {
        // Fire-and-forget: run in background without blocking
        _ = Task.Run(async () =>
        {
            try
            {
                _logger.LogInformation(
                    "Starting Supabase insert for Contact with Id: {ContactId}, Email: {Email}",
                    entity.Id,
                    entity.Email);
                
                // TODO: Implement actual Supabase REST API call using HttpClient
                // For now, this is a placeholder that logs the operation
                // The data has been saved to PostgreSQL (primary), this would backup to Supabase
                
                _logger.LogInformation(
                    "Supabase sync queued for Contact with Id: {ContactId}",
                    entity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to sync Contact with Id: {ContactId} to Supabase. PostgreSQL write succeeded.",
                    entity.Id);
                // Intentionally swallow exception - fire-and-forget pattern
            }
        }, cancellationToken);

        return Task.CompletedTask;
    }

    /// <summary>
    /// Inserts an office inquiry entity to Supabase asynchronously using fire-and-forget pattern.
    /// Failures are logged but do not propagate exceptions to the caller.
    /// </summary>
    public Task InsertOfficeInquiryAsync(OfficeInquiry entity, CancellationToken cancellationToken = default)
    {
        // Fire-and-forget: run in background without blocking
        _ = Task.Run(async () =>
        {
            try
            {
                _logger.LogInformation(
                    "Starting Supabase insert for OfficeInquiry with Id: {OfficeInquiryId}, Company: {CompanyName}",
                    entity.Id,
                    entity.CompanyName);
                
                // TODO: Implement actual Supabase REST API call using HttpClient
                // For now, this is a placeholder that logs the operation
                // The data has been saved to PostgreSQL (primary), this would backup to Supabase
                
                _logger.LogInformation(
                    "Supabase sync queued for OfficeInquiry with Id: {OfficeInquiryId}",
                    entity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to sync OfficeInquiry with Id: {OfficeInquiryId} to Supabase. PostgreSQL write succeeded.",
                    entity.Id);
                // Intentionally swallow exception - fire-and-forget pattern
            }
        }, cancellationToken);

        return Task.CompletedTask;
    }
}
