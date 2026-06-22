namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for system statistics
/// </summary>
public class StatsDto
{
    /// <summary>
    /// Total number of active menu items
    /// </summary>
    public int MenuItemCount { get; set; }

    /// <summary>
    /// Total number of chefs
    /// </summary>
    public int ChefCount { get; set; }

    /// <summary>
    /// Total number of active subscriptions
    /// </summary>
    public int SubscriptionCount { get; set; }
}
