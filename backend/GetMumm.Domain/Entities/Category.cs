namespace GetMumm.Domain.Entities;

/// <summary>
/// Menu category entity for organizing menu items
/// </summary>
public class Category : BaseEntity
{
    /// <summary>
    /// English category name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Arabic category name
    /// </summary>
    public string NameAr { get; set; } = string.Empty;

    /// <summary>
    /// English category description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Arabic category description
    /// </summary>
    public string DescriptionAr { get; set; } = string.Empty;

    /// <summary>
    /// Category image URL
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Count of menu items in this category
    /// </summary>
    public int ItemCount { get; set; }

    /// <summary>
    /// Navigation property: menu items in this category
    /// </summary>
    public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
}
