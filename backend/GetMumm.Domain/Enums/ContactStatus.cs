namespace GetMumm.Domain.Enums;

/// <summary>
/// Represents the status of a contact form submission
/// </summary>
public enum ContactStatus
{
    /// <summary>
    /// Contact submission is new and unreviewed
    /// </summary>
    New = 0,

    /// <summary>
    /// Contact submission has been reviewed
    /// </summary>
    Reviewed = 1,

    /// <summary>
    /// Contact submission has been responded to
    /// </summary>
    Responded = 2
}
