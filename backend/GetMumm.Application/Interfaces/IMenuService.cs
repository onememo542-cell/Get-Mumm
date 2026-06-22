using GetMumm.Application.DTOs;

namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for menu-related business operations.
/// Provides abstraction for retrieving menu items, categories, and featured offerings.
/// </summary>
public interface IMenuService
{
    /// <summary>
    /// Retrieves all menu categories.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Collection of all categories</returns>
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves paginated menu items with optional filtering.
    /// Supports filtering by category ID and search term, with pagination.
    /// </summary>
    /// <param name="filter">Filter and pagination parameters</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Paginated collection of menu items matching filter criteria</returns>
    Task<PaginatedResult<MenuItemDto>> GetMenuItemsAsync(MenuItemFilterDto filter, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves all featured menu items.
    /// Featured items are items marked as featured and currently available.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Collection of featured items</returns>
    Task<IEnumerable<MenuItemDto>> GetFeaturedItemsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a single menu item by ID with full details.
    /// </summary>
    /// <param name="id">Menu item ID</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Menu item details, or null if not found</returns>
    Task<MenuItemDetailDto?> GetMenuItemByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
