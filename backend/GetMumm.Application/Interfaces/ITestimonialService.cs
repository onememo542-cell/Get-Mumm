using GetMumm.Application.DTOs;

namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for testimonial-related business operations.
/// Provides abstraction for retrieving customer reviews and testimonials.
/// </summary>
public interface ITestimonialService
{
    /// <summary>
    /// Retrieves all testimonials ordered by creation date (newest first).
    /// </summary>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Collection of testimonials ordered by creation date descending</returns>
    Task<IEnumerable<TestimonialDto>> GetTestimonialsAsync(CancellationToken cancellationToken = default);
}
