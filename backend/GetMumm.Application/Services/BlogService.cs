using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Interfaces;

namespace GetMumm.Application.Services;

/// <summary>
/// Service for blog post operations including retrieval and content management.
/// Implements business logic for blog-related queries with pagination support.
/// </summary>
public class BlogService : IBlogService
{
    private readonly IRepository<BlogPost> _blogPostRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the BlogService class.
    /// </summary>
    /// <param name="blogPostRepository">Repository for BlogPost entities</param>
    /// <param name="mapper">AutoMapper instance for entity-to-DTO conversion</param>
    public BlogService(
        IRepository<BlogPost> blogPostRepository,
        IMapper mapper)
    {
        _blogPostRepository = blogPostRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Gets published blog posts with pagination.
    /// </summary>
    /// <param name="page">Page number</param>
    /// <param name="pageSize">Items per page</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated collection of published blog posts</returns>
    public async Task<PaginatedResult<BlogPostDto>> GetBlogPostsAsync(
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        // Get only published blog posts
        var allPosts = await _blogPostRepository.FindAsync(
            x => x.PublishStatus == "Published",
            cancellationToken);
        var postsList = allPosts.OrderByDescending(x => x.PublishedAt).ToList();

        // Apply pagination
        var paginatedPosts = postsList
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Map to DTOs
        var dtos = _mapper.Map<IEnumerable<BlogPostDto>>(paginatedPosts);

        // Return paginated result
        return new PaginatedResult<BlogPostDto>
        {
            Data = dtos,
            Total = postsList.Count,
            Page = page,
            PageSize = pageSize
        };
    }

    /// <summary>
    /// Gets a single blog post by ID.
    /// Returns null if blog post not found.
    /// </summary>
    /// <param name="id">Blog post ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Blog post detail, or null if not found</returns>
    public async Task<BlogPostDetailDto?> GetBlogPostByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var post = await _blogPostRepository.GetByIdAsync(id, cancellationToken);
        if (post == null)
            return null;

        return _mapper.Map<BlogPostDetailDto>(post);
    }

    /// <summary>
    /// Gets a blog post by its slug.
    /// Returns null if blog post not found.
    /// </summary>
    /// <param name="slug">Blog post slug</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Blog post detail, or null if not found</returns>
    public async Task<BlogPostDetailDto?> GetBlogPostBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var posts = await _blogPostRepository.FindAsync(
            x => x.Slug == slug,
            cancellationToken);

        var post = posts.FirstOrDefault();
        if (post == null)
            return null;

        return _mapper.Map<BlogPostDetailDto>(post);
    }
}
