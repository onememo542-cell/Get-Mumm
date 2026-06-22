using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;

namespace GetMumm.Application.Services;

/// <summary>
/// Service for testimonial operations.
/// Implements business logic for retrieving and managing customer testimonials.
/// </summary>
public class TestimonialService : ITestimonialService
{
    private readonly IRepository<Testimonial> _testimonialRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the TestimonialService class.
    /// </summary>
    /// <param name="testimonialRepository">Repository for Testimonial entities</param>
    /// <param name="mapper">AutoMapper instance for entity-to-DTO conversion</param>
    public TestimonialService(
        IRepository<Testimonial> testimonialRepository,
        IMapper mapper)
    {
        _testimonialRepository = testimonialRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Gets all testimonials ordered by creation date (newest first).
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of testimonials ordered by creation date descending</returns>
    public async Task<IEnumerable<TestimonialDto>> GetTestimonialsAsync(CancellationToken cancellationToken = default)
    {
        var testimonials = await _testimonialRepository.GetAllAsync(cancellationToken);
        var orderedTestimonials = testimonials.OrderByDescending(t => t.CreatedAt);
        return _mapper.Map<IEnumerable<TestimonialDto>>(orderedTestimonials);
    }
}
