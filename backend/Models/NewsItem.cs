namespace Edu4Migration.Api.Models;

public class NewsItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string TitleSq { get; set; } = "";
    public string Excerpt { get; set; } = "";
    public string ExcerptSq { get; set; } = "";
    public string Content { get; set; } = "";
    public string ContentSq { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public string ThumbnailUrl { get; set; } = "";
    public string DocumentTitle { get; set; } = "";
    public string DocumentTitleSq { get; set; } = "";
    public string DocumentUrl { get; set; } = "";
    public string GalleryJson { get; set; } = "[]";
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
