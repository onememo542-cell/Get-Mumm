namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for chef list view
/// </summary>
public class ChefDto
{
    /// <summary>
    /// Unique chef identifier
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Chef name in English
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Chef name in Arabic
    /// </summary>
    public string NameAr { get; set; } = string.Empty;

    /// <summary>
    /// Chef biography in English
    /// </summary>
    public string Bio { get; set; } = string.Empty;

    /// <summary>
    /// Chef biography in Arabic
    /// </summary>
    public string BioAr { get; set; } = string.Empty;

    /// <summary>
    /// Chef profile image URL
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Array of specialties in English
    /// </summary>
    public string[] Specialties { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Array of specialties in Arabic
    /// </summary>
    public string[] SpecialtiesAr { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Number of menu items created by this chef
    /// </summary>
    public int ItemCount { get; set; }

    /// <summary>
    /// Chef rating on 0-5 scale
    /// </summary>
    public decimal Rating { get; set; }
}
