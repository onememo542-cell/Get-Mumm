namespace GetMumm.Application.DTOs;

/// <summary>
/// Response DTO for retrieving featured menu items
/// </summary>
public class GetFeaturedItemsResponse
{
    /// <summary>
    /// Collection of featured menu item data transfer objects
    /// </summary>
    public IEnumerable<MenuItemDto> Data { get; set; } = Enumerable.Empty<MenuItemDto>();
}
