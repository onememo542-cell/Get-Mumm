namespace GetMumm.Domain.Entities;

/// <summary>
/// Represents an office catering inquiry.
/// </summary>
public class OfficeInquiry : BaseEntity
{
    /// <summary>
    /// Company name for the inquiry
    /// </summary>
    public string CompanyName { get; set; } = string.Empty;

    /// <summary>
    /// Contact person's name at the company
    /// </summary>
    public string ContactName { get; set; } = string.Empty;

    /// <summary>
    /// Contact email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Contact phone number
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Number of employees to cater for
    /// </summary>
    public int HeadCount { get; set; }

    /// <summary>
    /// Delivery area or location
    /// </summary>
    public string? DeliveryArea { get; set; }

    /// <summary>
    /// Catering frequency preference (one-time, weekly, monthly, etc.)
    /// </summary>
    public string? Frequency { get; set; }

    /// <summary>
    /// Additional message or notes about the inquiry
    /// </summary>
    public string Message { get; set; } = string.Empty;
}
