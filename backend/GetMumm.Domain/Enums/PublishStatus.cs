namespace GetMumm.Domain.Enums;

/// <summary>
/// Represents the publication status of a blog post
/// </summary>
public enum PublishStatus
{
    /// <summary>
    /// Blog post is in draft mode and not published
    /// </summary>
    Draft = 0,

    /// <summary>
    /// Blog post is published and visible to users
    /// </summary>
    Published = 1,

    /// <summary>
    /// Blog post is archived and no longer visible
    /// </summary>
    Archived = 2
}
