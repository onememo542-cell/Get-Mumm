namespace GetMumm.Domain.Entities;

/// <summary>
/// Represents a customer testimonial/review.
/// </summary>
public class Testimonial : BaseEntity
{
    /// <summary>
    /// Name of the customer providing the testimonial
    /// </summary>
    public string CustomerName { get; set; } = string.Empty;

    /// <summary>
    /// Rating on a numeric scale (typically 1-5)
    /// </summary>
    public int Rating { get; set; }

    /// <summary>
    /// Testimonial content/review text
    /// </summary>
    public string Content { get; set; } = string.Empty;
}
