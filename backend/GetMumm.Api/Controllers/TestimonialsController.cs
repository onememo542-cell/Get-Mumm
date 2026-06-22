using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;

namespace GetMumm.Api.Controllers;

/// <summary>
/// API controller for testimonial operations.
/// Provides endpoints for retrieving customer testimonials and reviews.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly ITestimonialService _testimonialService;
    private readonly ILogger<TestimonialsController> _logger;

    public TestimonialsController(ITestimonialService testimonialService, ILogger<TestimonialsController> logger)
    {
        _testimonialService = testimonialService;
        _logger = logger;
    }

    /// <summary>
    /// Get all testimonials ordered by creation date descending.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of testimonials</returns>
    [HttpGet]
    public async Task<ActionResult<List<TestimonialDto>>> GetTestimonials(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get testimonials request received");
            var testimonials = await _testimonialService.GetTestimonialsAsync(cancellationToken);
            return Ok(testimonials);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving testimonials");
            throw;
        }
    }
}
