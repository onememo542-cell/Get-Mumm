namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for menu item list view
/// </summary>
public class MenuItemDto
{
    /// <summary>
    /// Unique menu item identifier
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Menu item name in English
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Menu item name in Arabic
    /// </summary>
    public string NameAr { get; set; } = string.Empty;

    /// <summary>
    /// Menu item description in English
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Menu item description in Arabic
    /// </summary>
    public string DescriptionAr { get; set; } = string.Empty;

    /// <summary>
    /// Item price
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Category name in English
    /// </summary>
    public string CategoryName { get; set; } = string.Empty;

    /// <summary>
    /// Category name in Arabic
    /// </summary>
    public string CategoryNameAr { get; set; } = string.Empty;

    /// <summary>
    /// Item image URL
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Array of dietary restrictions
    /// </summary>
    public string[] Dietary { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Whether item is available for ordering
    /// </summary>
    public bool IsAvailable { get; set; }

    /// <summary>
    /// Chef name in English
    /// </summary>
    public string ChefName { get; set; } = string.Empty;

    /// <summary>
    /// Chef name in Arabic
    /// </summary>
    public string ChefNameAr { get; set; } = string.Empty;

    /// <summary>
    /// Item rating on 0-5 scale
    /// </summary>
    public decimal? Rating { get; set; }

    /// <summary>
    /// Approximate preparation time in minutes
    /// </summary>
    public int? PrepTimeMinutes { get; set; }
}
