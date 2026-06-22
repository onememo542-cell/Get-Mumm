namespace GetMumm.Application.DTOs;

/// <summary>
/// Response DTO for listing all menu categories
/// </summary>
public class ListCategoriesResponse
{
    /// <summary>
    /// Collection of category data transfer objects
    /// </summary>
    public IEnumerable<CategoryDto> Data { get; set; } = Enumerable.Empty<CategoryDto>();
}
