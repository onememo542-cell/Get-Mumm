using GetMumm.Application.DTOs;

namespace GetMumm.Application.Interfaces;

/// <summary>
/// Interface for blog-related business operations.
/// </summary>
public interface IBlogService
{
    Task<IEnumerable<BlogPostDto>> GetAllPublishedBlogPostsAsync(CancellationToken cancellationToken = default);
    Task<PaginatedResult<BlogPostDto>> GetBlogPostsAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default);
    Task<BlogPostDetailDto?> GetBlogPostByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<BlogPostDetailDto?> GetBlogPostBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
