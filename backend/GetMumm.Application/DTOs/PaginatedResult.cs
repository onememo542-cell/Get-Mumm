namespace GetMumm.Application.DTOs;

/// <summary>
/// Generic wrapper for paginated results
/// </summary>
/// <typeparam name="T">The type of items in the paginated collection</typeparam>
public class PaginatedResult<T>
{
    /// <summary>
    /// Collection of items for the current page
    /// </summary>
    public IEnumerable<T> Data { get; set; } = Enumerable.Empty<T>();

    /// <summary>
    /// Total number of items across all pages
    /// </summary>
    public int Total { get; set; }

    /// <summary>
    /// Current page number (1-based)
    /// </summary>
    public int Page { get; set; }

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Calculate the total number of pages
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
