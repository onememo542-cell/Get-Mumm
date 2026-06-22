using GetMumm.Application.DTOs;

namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for blog-related business operations.
/// Provides abstraction for retrieving blog posts and articles.
/// </summary>
public interface IBlogService
{
    /// <summary>
    /// Retrieves blog posts with pagination.
    /// Returns only published blog posts.
    /// </summary>
    /// <param name="page">Page number (must be > 0)</param>
    /// <param name="pageSize">Items per page (must be > 0 and <= 100)</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Paginated collection of published blog posts</returns>
    Task<PaginatedResult<BlogPostDto>> GetBlogPostsAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a single blog post by ID.
    /// </summary>
    /// <param name="id">Blog post ID</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Blog post details, or null if not found</returns>
    Task<BlogPostDetailDto?> GetBlogPostByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a blog post by its slug.
    /// </summary>
    /// <param name="slug">Blog post slug (URL-friendly identifier)</param>
    /// <param name="cancellationToken">Cancellation token (optional)</param>
    /// <returns>Blog post details, or null if not found</returns>
    Task<BlogPostDetailDto?> GetBlogPostBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
