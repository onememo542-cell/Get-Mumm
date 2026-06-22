namespace GetMumm.Application.DTOs;

/// <summary>
/// Response DTO for listing all chefs
/// </summary>
public class ListChefsResponse
{
    /// <summary>
    /// Collection of chef data transfer objects
    /// </summary>
    public IEnumerable<ChefDto> Data { get; set; } = Enumerable.Empty<ChefDto>();
}
