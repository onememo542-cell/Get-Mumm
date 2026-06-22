namespace GetMumm.Domain.Entities;

/// <summary>
/// Chef entity representing culinary professionals
/// </summary>
public class Chef : BaseEntity
{
    /// <summary>
    /// English chef name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Arabic chef name
    /// </summary>
    public string NameAr { get; set; } = string.Empty;

    /// <summary>
    /// English biography
    /// </summary>
    public string Bio { get; set; } = string.Empty;

    /// <summary>
    /// Arabic biography
    /// </summary>
    public string BioAr { get; set; } = string.Empty;

    /// <summary>
    /// Chef profile image URL
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Array of specialties (JSON stored)
    /// </summary>
    public string[] Specialties { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Array of specialties in Arabic (JSON stored)
    /// </summary>
    public string[] SpecialtiesAr { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Number of menu items created by this chef
    /// </summary>
    public int ItemCount { get; set; }

    /// <summary>
    /// Chef rating on 0-5 scale
    /// </summary>
    public decimal Rating { get; set; } = 4.8m;

    /// <summary>
    /// Year chef joined the organization
    /// </summary>
    public int JoinedYear { get; set; }

    /// <summary>
    /// Navigation property: menu items created by this chef
    /// </summary>
    public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
}
