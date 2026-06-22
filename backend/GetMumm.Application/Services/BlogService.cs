using AutoMapper;
using GetMumm.Application.DTOs;
using GetMumm.Application.Interfaces;
using GetMumm.Domain.Entities;
using GetMumm.Domain.Enums;
using GetMumm.Domain.Interfaces;

namespace GetMumm.Application.Services;

public class BlogService : IBlogService
{
    private readonly IRepository<BlogPost> _blogPostRepository;
    private readonly IMapper _mapper;

    public BlogService(IRepository<BlogPost> blogPostRepository, IMapper mapper)
    {
        _blogPostRepository = blogPostRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BlogPostDto>> GetAllPublishedBlogPostsAsync(CancellationToken cancellationToken = default)
    {
        var allPosts = await _blogPostRepository.GetAllAsync(cancellationToken);
        var published = allPosts
            .Where(x => x.PublishStatus == PublishStatus.Published)
            .OrderByDescending(x => x.PublishedAt)
            .ToList();
        return _mapper.Map<IEnumerable<BlogPostDto>>(published);
    }

    public async Task<PaginatedResult<BlogPostDto>> GetBlogPostsAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
    {
        var allPosts = await _blogPostRepository.GetAllAsync(cancellationToken);
        var postsList = allPosts
            .Where(x => x.PublishStatus == PublishStatus.Published)
            .OrderByDescending(x => x.PublishedAt)
            .ToList();

        var paginatedPosts = postsList.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        var dtos = _mapper.Map<IEnumerable<BlogPostDto>>(paginatedPosts);

        return new PaginatedResult<BlogPostDto>
        {
            Data = dtos,
            Total = postsList.Count,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<BlogPostDetailDto?> GetBlogPostByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var post = await _blogPostRepository.GetByIdAsync(id, cancellationToken);
        if (post == null) return null;
        return _mapper.Map<BlogPostDetailDto>(post);
    }

    public async Task<BlogPostDetailDto?> GetBlogPostBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var allPosts = await _blogPostRepository.GetAllAsync(cancellationToken);
        var post = allPosts.FirstOrDefault(x => x.Slug == slug);
        if (post == null) return null;
        return _mapper.Map<BlogPostDetailDto>(post);
    }
}
