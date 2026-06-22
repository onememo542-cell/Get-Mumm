using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;

namespace GetMumm.Api.Controllers;

/// <summary>
/// API controller for blog post operations.
/// Provides endpoints for retrieving published blog posts with pagination.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;
    private readonly ILogger<BlogController> _logger;

    public BlogController(IBlogService blogService, ILogger<BlogController> logger)
    {
        _blogService = blogService;
        _logger = logger;
    }

    /// <summary>
    /// Get published blog posts with pagination.
    /// </summary>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 10, max: 100)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated blog posts</returns>
    [HttpGet]
    public async Task<ActionResult<dynamic>> GetBlogPosts(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get blog posts request received - Page: {Page}, PageSize: {PageSize}", page, pageSize);
            var posts = await _blogService.GetBlogPostsAsync(page, pageSize, cancellationToken);
            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving blog posts");
            throw;
        }
    }

    /// <summary>
    /// Get a single blog post by ID.
    /// </summary>
    /// <param name="id">Blog post ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Blog post details</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogPostDetailDto>> GetBlogPostById(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get blog post by ID request received - ID: {PostId}", id);
            var post = await _blogService.GetBlogPostByIdAsync(id, cancellationToken);

            if (post == null)
            {
                _logger.LogWarning("Blog post not found - ID: {PostId}", id);
                return NotFound();
            }

            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving blog post - ID: {PostId}", id);
            throw;
        }
    }

    /// <summary>
    /// Get a blog post by slug.
    /// </summary>
    /// <param name="slug">Blog post slug</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Blog post details</returns>
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<BlogPostDetailDto>> GetBlogPostBySlug(string slug, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Get blog post by slug request received - Slug: {Slug}", slug);
            var post = await _blogService.GetBlogPostBySlugAsync(slug, cancellationToken);

            if (post == null)
            {
                _logger.LogWarning("Blog post not found - Slug: {Slug}", slug);
                return NotFound();
            }

            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving blog post by slug - Slug: {Slug}", slug);
            throw;
        }
    }
}
