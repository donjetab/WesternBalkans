namespace Edu4Migration.Api.Models;

public class ContentPage
{
    public int Id { get; set; }
    public required string Slug { get; set; }
    public string Eyebrow { get; set; } = "";
    public string EyebrowSq { get; set; } = "";
    public required string Title { get; set; }
    public string TitleSq { get; set; } = "";
    public string Intro { get; set; } = "";
    public string IntroSq { get; set; } = "";
    public List<ContentSection> Sections { get; set; } = [];
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
