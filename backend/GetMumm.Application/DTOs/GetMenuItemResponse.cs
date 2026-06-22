namespace GetMumm.Application.DTOs;

/// <summary>
/// Response DTO for retrieving a single menu item with full details
/// </summary>
public class GetMenuItemResponse
{
    /// <summary>
    /// Menu item detail data transfer object
    /// </summary>
    public MenuItemDetailDto Data { get; set; } = new();
}
