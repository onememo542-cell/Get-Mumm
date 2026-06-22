namespace GetMumm.Domain.Entities;

/// <summary>
/// Represents a user subscription.
/// </summary>
public class Subscription : BaseEntity
{
    /// <summary>
    /// External user identifier (typically from authentication system)
    /// </summary>
    public string UserId { get; set; } = string.Empty;

    /// <summary>
    /// Subscription type (Monthly, Quarterly, Annual, etc.)
    /// </summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>
    /// Subscription start date
    /// </summary>
    public DateTime StartDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Subscription end date (null for ongoing subscriptions)
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Current subscription status (Active, Paused, Canceled)
    /// </summary>
    public string Status { get; set; } = "Active";
}
