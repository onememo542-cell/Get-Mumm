namespace GetMumm.Domain.Enums;

/// <summary>
/// Represents the status of a subscription
/// </summary>
public enum SubscriptionStatus
{
    /// <summary>
    /// Subscription is currently active and valid
    /// </summary>
    Active = 0,

    /// <summary>
    /// Subscription is paused temporarily
    /// </summary>
    Paused = 1,

    /// <summary>
    /// Subscription has been canceled
    /// </summary>
    Canceled = 2
}
