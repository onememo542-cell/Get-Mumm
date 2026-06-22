namespace GetMumm.Domain.Entities;

/// <summary>
/// Menu item entity representing a dish or food offering
/// </summary>
public class MenuItem : BaseEntity
{
    /// <summary>
    /// English menu item name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Arabic menu item name
    /// </summary>
    public string NameAr { get; set; } = string.Empty;

    /// <summary>
    /// English item description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Arabic item description
    /// </summary>
    public string DescriptionAr { get; set; } = string.Empty;

    /// <summary>
    /// Item price in base currency
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Foreign key reference to Category
    /// </summary>
    public Guid CategoryId { get; set; }

    /// <summary>
    /// Category name (denormalized for quick access)
    /// </summary>
    public string CategoryName { get; set; } = string.Empty;

    /// <summary>
    /// Category name in Arabic (denormalized)
    /// </summary>
    public string CategoryNameAr { get; set; } = string.Empty;

    /// <summary>
    /// Item image URL
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Array of dietary restrictions (JSON stored)
    /// </summary>
    public string[] Dietary { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Whether item is currently available for ordering
    /// </summary>
    public bool IsAvailable { get; set; } = true;

    /// <summary>
    /// Whether item should be featured on homepage
    /// </summary>
    public bool IsFeatured { get; set; }

    /// <summary>
    /// Chef name (denormalized reference)
    /// </summary>
    public string ChefName { get; set; } = string.Empty;

    /// <summary>
    /// Chef name in Arabic (denormalized)
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

    /// <summary>
    /// Foreign key reference to Chef (optional)
    /// </summary>
    public Guid? ChefId { get; set; }

    /// <summary>
    /// Navigation property: associated category
    /// </summary>
    public virtual Category? Category { get; set; }

    /// <summary>
    /// Navigation property: associated chef
    /// </summary>
    public virtual Chef? Chef { get; set; }
}
