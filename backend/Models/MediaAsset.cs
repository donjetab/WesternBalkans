namespace Edu4Migration.Api.Models;

public class MediaAsset
{
    public int Id { get; set; }
    public required string FileName { get; set; }
    public required string Url { get; set; }
    public string AltText { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
