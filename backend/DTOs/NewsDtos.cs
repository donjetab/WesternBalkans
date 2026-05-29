namespace Edu4Migration.Api.DTOs;

public record NewsDto(
    int Id,
    string Title,
    string Excerpt,
    string Content,
    string ImageUrl,
    string ThumbnailUrl,
    string DocumentTitle,
    string DocumentUrl,
    List<string> Gallery,
    DateTime PublishedAt,
    bool IsPublished);

public record UpsertNewsRequest(
    string Title,
    string Excerpt,
    string Content,
    string ImageUrl,
    string ThumbnailUrl,
    string DocumentTitle,
    string DocumentUrl,
    List<string> Gallery,
    DateTime PublishedAt,
    bool IsPublished);
