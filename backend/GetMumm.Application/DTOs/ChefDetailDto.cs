namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for chef detailed view
/// </summary>
public class ChefDetailDto : ChefDto
{
    /// <summary>
    /// Year chef joined the organization
    /// </summary>
    public int JoinedYear { get; set; }
}
