namespace GetMumm.Application.DTOs;

/// <summary>
/// Response DTO for listing menu items with pagination
/// </summary>
public class ListMenuItemsResponse
{
    /// <summary>
    /// Collection of menu item data transfer objects for current page
    /// </summary>
    public IEnumerable<MenuItemDto> Data { get; set; } = Enumerable.Empty<MenuItemDto>();

    /// <summary>
    /// Pagination metadata for the response
    /// </summary>
    public PaginationMetadata Pagination { get; set; } = new();
}

/// <summary>
/// Metadata for paginated responses
/// </summary>
public class PaginationMetadata
{
    /// <summary>
    /// Total number of items across all pages
    /// </summary>
    public int Total { get; set; }

    /// <summary>
    /// Current page number (1-based)
    /// </summary>
    public int Page { get; set; } = 1;

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; } = 10;

    /// <summary>
    /// Total number of pages
    /// </summary>
    public int TotalPages => (Total + PageSize - 1) / PageSize;

    /// <summary>
    /// Whether there are more pages after the current one
    /// </summary>
    public bool HasNextPage => Page < TotalPages;

    /// <summary>
    /// Whether there are pages before the current one
    /// </summary>
    public bool HasPreviousPage => Page > 1;
}
