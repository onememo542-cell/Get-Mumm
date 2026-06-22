namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for blog post list view
/// </summary>
public class BlogPostDto
{
    /// <summary>
    /// Unique blog post identifier
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Blog post title in English
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Blog post title in Arabic
    /// </summary>
    public string TitleAr { get; set; } = string.Empty;

    /// <summary>
    /// Blog post content in English
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Blog post content in Arabic
    /// </summary>
    public string ContentAr { get; set; } = string.Empty;

    /// <summary>
    /// Author name in English
    /// </summary>
    public string AuthorName { get; set; } = string.Empty;

    /// <summary>
    /// Author name in Arabic
    /// </summary>
    public string AuthorNameAr { get; set; } = string.Empty;

    /// <summary>
    /// URL-friendly slug for the blog post
    /// </summary>
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// Publishing status (Draft, Published, Archived)
    /// </summary>
    public string PublishStatus { get; set; } = string.Empty;

    /// <summary>
    /// Publication timestamp
    /// </summary>
    public DateTime? PublishedAt { get; set; }
}
