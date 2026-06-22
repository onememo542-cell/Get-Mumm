namespace GetMumm.Application.DTOs;

using GetMumm.Domain.Enums;

/// <summary>
/// Data transfer object for subscription
/// </summary>
public class SubscriptionDto
{
    /// <summary>
    /// Unique subscription identifier
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User ID for the subscription (external user identifier)
    /// </summary>
    public string UserId { get; set; } = string.Empty;

    /// <summary>
    /// Subscription type
    /// </summary>
    public SubscriptionType Type { get; set; }

    /// <summary>
    /// Subscription start date
    /// </summary>
    public DateTime StartDate { get; set; }

    /// <summary>
    /// Subscription end date
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Subscription status
    /// </summary>
    public SubscriptionStatus Status { get; set; }
}

/// <summary>
/// Request DTO for creating a subscription
/// </summary>
public class CreateSubscriptionRequest
{
    /// <summary>
    /// User ID for the subscription (external user identifier)
    /// </summary>
    public string UserId { get; set; } = string.Empty;

    /// <summary>
    /// Subscription type
    /// </summary>
    public SubscriptionType Type { get; set; }
}

/// <summary>
/// Request DTO for updating a subscription
/// </summary>
public class UpdateSubscriptionRequest
{
    /// <summary>
    /// Subscription type
    /// </summary>
    public SubscriptionType Type { get; set; }

    /// <summary>
    /// Subscription status
    /// </summary>
    public SubscriptionStatus Status { get; set; }
}
