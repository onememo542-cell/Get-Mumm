using GetMumm.Application.DTOs;

namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for chef-related business operations.
/// Provides abstraction for retrieving chef information and profiles.
/// </summary>
public interface IChefsService
{
    /// <summary>
    /// Retrieves all chefs ordered by rating in descending order.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Collection of chefs ordered by rating (highest first)</returns>
    Task<IEnumerable<ChefDto>> GetAllChefsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a single chef by ID with full details.
    /// </summary>
    /// <param name="id">Chef ID</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Chef details, or null if not found</returns>
    Task<ChefDetailDto?> GetChefByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
