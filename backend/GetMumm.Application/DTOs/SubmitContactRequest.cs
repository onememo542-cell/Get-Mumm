namespace GetMumm.Application.DTOs;

/// <summary>
/// Request DTO for submitting a contact form
/// </summary>
public class SubmitContactRequest
{
    /// <summary>
    /// Contact name (required, max 100 characters)
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Contact email address (required, valid email format)
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Contact phone number (optional, valid phone format if provided)
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Contact message (required, minimum 10 characters)
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Message subject (required, max 200 characters)
    /// </summary>
    public string Subject { get; set; } = string.Empty;
}
