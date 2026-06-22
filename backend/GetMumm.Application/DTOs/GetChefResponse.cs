namespace GetMumm.Application.DTOs;

/// <summary>
/// Response DTO for retrieving a single chef with full details
/// </summary>
public class GetChefResponse
{
    /// <summary>
    /// Chef detail data transfer object
    /// </summary>
    public ChefDetailDto Data { get; set; } = new();
}
