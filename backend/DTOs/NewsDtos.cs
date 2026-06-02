namespace Edu4Migration.Api.DTOs;

public record NewsDto(
    int Id,
    string Title,
    string TitleSq,
    string Excerpt,
    string ExcerptSq,
    string Content,
    string ContentSq,
    string ImageUrl,
    string ThumbnailUrl,
    string DocumentTitle,
    string DocumentTitleSq,
    string DocumentUrl,
    List<string> Gallery,
    DateTime PublishedAt,
    bool IsPublished);

public record UpsertNewsRequest(
    string Title,
    string TitleSq,
    string Excerpt,
    string ExcerptSq,
    string Content,
    string ContentSq,
    string ImageUrl,
    string ThumbnailUrl,
    string DocumentTitle,
    string DocumentTitleSq,
    string DocumentUrl,
    List<string> Gallery,
    DateTime PublishedAt,
    bool IsPublished);
