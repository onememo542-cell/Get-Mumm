namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for menu item detailed view
/// </summary>
public class MenuItemDetailDto : MenuItemDto
{
    /// <summary>
    /// Foreign key reference to Category
    /// </summary>
    public Guid CategoryId { get; set; }

    /// <summary>
    /// Associated chef detailed information
    /// </summary>
    public ChefDetailDto? Chef { get; set; }
}
