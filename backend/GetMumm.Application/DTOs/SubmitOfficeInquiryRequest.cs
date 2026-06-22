namespace GetMumm.Application.DTOs;

/// <summary>
/// Request DTO for submitting an office catering inquiry
/// </summary>
public class SubmitOfficeInquiryRequest
{
    /// <summary>
    /// Company name (required)
    /// </summary>
    public string CompanyName { get; set; } = string.Empty;

    /// <summary>
    /// Contact person name (required)
    /// </summary>
    public string ContactName { get; set; } = string.Empty;

    /// <summary>
    /// Contact email address (required, valid email format)
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Contact phone number (optional)
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Number of employees/head count (required, must be greater than 0)
    /// </summary>
    public int HeadCount { get; set; }

    /// <summary>
    /// Preferred delivery area (optional)
    /// </summary>
    public string DeliveryArea { get; set; } = string.Empty;

    /// <summary>
    /// Inquiry frequency preference (optional, e.g., "Daily", "Weekly", "Monthly")
    /// </summary>
    public string Frequency { get; set; } = string.Empty;

    /// <summary>
    /// Additional message or requirements (required)
    /// </summary>
    public string Message { get; set; } = string.Empty;
}
