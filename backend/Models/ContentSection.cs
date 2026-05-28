namespace Edu4Migration.Api.Models;

public class ContentSection
{
    public int Id { get; set; }
    public int ContentPageId { get; set; }
    public ContentPage? Page { get; set; }
    public required string Title { get; set; }
    public required string Body { get; set; }
    public int SortOrder { get; set; }
}
