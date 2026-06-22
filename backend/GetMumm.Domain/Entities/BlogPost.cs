namespace GetMumm.Domain.Entities;

using GetMumm.Domain.Enums;

/// <summary>
/// Represents a blog post with bilingual support and publishing workflow.
/// </summary>
public class BlogPost : BaseEntity
{
    /// <summary>
    /// English blog post title
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Arabic blog post title
    /// </summary>
    public string TitleAr { get; set; } = string.Empty;

    /// <summary>
    /// English blog post content
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Arabic blog post content
    /// </summary>
    public string ContentAr { get; set; } = string.Empty;

    /// <summary>
    /// English author name
    /// </summary>
    public string AuthorName { get; set; } = string.Empty;

    /// <summary>
    /// Arabic author name
    /// </summary>
    public string AuthorNameAr { get; set; } = string.Empty;

    /// <summary>
    /// URL-friendly slug for the blog post
    /// </summary>
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// Publishing status (Draft, Published, Archived)
    /// </summary>
    public PublishStatus PublishStatus { get; set; } = PublishStatus.Draft;

    /// <summary>
    /// Publication timestamp (when post was published)
    /// </summary>
    public DateTime? PublishedAt { get; set; }
}
