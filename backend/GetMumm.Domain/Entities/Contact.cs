namespace GetMumm.Domain.Entities;

/// <summary>
/// Represents a contact form submission.
/// </summary>
public class Contact : BaseEntity
{
    /// <summary>
    /// Contact person's name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Contact person's email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Contact person's phone number
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Contact message content
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Contact subject/topic
    /// </summary>
    public string Subject { get; set; } = string.Empty;
}
