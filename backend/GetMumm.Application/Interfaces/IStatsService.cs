using GetMumm.Application.DTOs;

namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for statistics-related business operations.
/// Provides system statistics and analytics data.
/// </summary>
public interface IStatsService
{
    /// <summary>
    /// Retrieves system statistics including item count, chef count, and subscription count.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>System statistics</returns>
    Task<StatsDto> GetStatsAsync(CancellationToken cancellationToken = default);
}
