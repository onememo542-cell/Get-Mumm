namespace GetMumm.Application.DTOs;

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
    public string Type { get; set; } = string.Empty;

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
    public string Status { get; set; } = string.Empty;
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
    public string Type { get; set; } = string.Empty;
}

/// <summary>
/// Request DTO for updating a subscription
/// </summary>
public class UpdateSubscriptionRequest
{
    /// <summary>
    /// Subscription type
    /// </summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>
    /// Subscription status
    /// </summary>
    public string Status { get; set; } = string.Empty;
}
