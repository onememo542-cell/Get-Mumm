using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;

namespace GetMumm.Api.Controllers;

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
    /// Get all published blog posts (flat list — used by the frontend).
    /// </summary>
    [HttpGet("posts")]
    public async Task<ActionResult<IEnumerable<BlogPostDto>>> GetPosts(CancellationToken cancellationToken = default)
    {
        try
        {
            var posts = await _blogService.GetAllPublishedBlogPostsAsync(cancellationToken);
            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving blog posts");
            throw;
        }
    }

    /// <summary>
    /// Get a blog post by slug (used by the frontend detail page).
    /// </summary>
    [HttpGet("posts/{slug}")]
    public async Task<ActionResult<BlogPostDetailDto>> GetPostBySlug(string slug, CancellationToken cancellationToken = default)
    {
        try
        {
            var post = await _blogService.GetBlogPostBySlugAsync(slug, cancellationToken);
            if (post == null) return NotFound();
            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving blog post - Slug: {Slug}", slug);
            throw;
        }
    }

    /// <summary>
    /// Get published blog posts with pagination (admin portal).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<dynamic>> GetBlogPosts(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
    {
        try
        {
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
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogPostDetailDto>> GetBlogPostById(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var post = await _blogService.GetBlogPostByIdAsync(id, cancellationToken);
            if (post == null) return NotFound();
            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving blog post - ID: {PostId}", id);
            throw;
        }
    }

    /// <summary>
    /// Get a blog post by slug (legacy route).
    /// </summary>
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<BlogPostDetailDto>> GetBlogPostBySlug(string slug, CancellationToken cancellationToken = default)
    {
        try
        {
            var post = await _blogService.GetBlogPostBySlugAsync(slug, cancellationToken);
            if (post == null) return NotFound();
            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving blog post by slug - Slug: {Slug}", slug);
            throw;
        }
    }
}
