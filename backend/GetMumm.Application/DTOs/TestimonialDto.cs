namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for customer testimonial
/// </summary>
public class TestimonialDto
{
    /// <summary>
    /// Unique testimonial identifier
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Customer name
    /// </summary>
    public string CustomerName { get; set; } = string.Empty;

    /// <summary>
    /// Rating given (0-5 scale)
    /// </summary>
    public decimal Rating { get; set; }

    /// <summary>
    /// Testimonial content/review text
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// When the testimonial was created
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
