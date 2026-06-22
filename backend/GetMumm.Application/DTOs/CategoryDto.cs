namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for menu category
/// </summary>
public class CategoryDto
{
    /// <summary>
    /// Unique category identifier
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Category name in English
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Category name in Arabic
    /// </summary>
    public string NameAr { get; set; } = string.Empty;

    /// <summary>
    /// Category description in English (optional)
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Category description in Arabic (optional)
    /// </summary>
    public string DescriptionAr { get; set; } = string.Empty;

    /// <summary>
    /// Category image URL (optional)
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Number of active menu items in this category
    /// </summary>
    public int ItemCount { get; set; }
}
