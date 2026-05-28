namespace Edu4Migration.Api.Models;

public class HomepageContent
{
    public int Id { get; set; }
    public string HeroEyebrow { get; set; } = "";
    public string HeroTitle { get; set; } = "";
    public string HeroSubtitle { get; set; } = "";
    public string HeroBody { get; set; } = "";
    public string HeroImageUrl { get; set; } = "";
    public string StatsJson { get; set; } = "[]";
    public string FocusAreasJson { get; set; } = "[]";
    public string PartnersJson { get; set; } = "[]";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
