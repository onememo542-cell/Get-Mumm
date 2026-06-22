namespace GetMumm.Application.DTOs;

/// <summary>
/// Filter and pagination parameters for menu items query
/// </summary>
public class MenuItemFilterDto
{
    /// <summary>
    /// Filter by category ID (optional)
    /// </summary>
    public Guid? CategoryId { get; set; }

    /// <summary>
    /// Search term to filter by name or description (optional)
    /// </summary>
    public string Search { get; set; } = string.Empty;

    /// <summary>
    /// Page number for pagination (must be greater than 0, default is 1)
    /// </summary>
    public int Page { get; set; } = 1;

    /// <summary>
    /// Number of items per page (must be greater than 0 and not exceed 100, default is 10)
    /// </summary>
    public int PageSize { get; set; } = 10;
}
