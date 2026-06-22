namespace GetMumm.Application.DTOs;

/// <summary>
/// Data transfer object for blog post list view
/// </summary>
public class BlogPostDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string ExcerptAr { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string ContentAr { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Type { get; set; } = "blog";
    public DateTime? PublishedAt { get; set; }
    public string Author { get; set; } = string.Empty;
    public string AuthorAr { get; set; } = string.Empty;
    public int ReadTimeMinutes { get; set; } = 3;
    public List<string> Tags { get; set; } = new();
}
