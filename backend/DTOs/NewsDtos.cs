namespace Edu4Migration.Api.DTOs;

public record NewsDto(
    int Id,
    string Title,
    string Excerpt,
    string Content,
    string ImageUrl,
    DateTime PublishedAt,
    bool IsPublished);

public record UpsertNewsRequest(
    string Title,
    string Excerpt,
    string Content,
    string ImageUrl,
    DateTime PublishedAt,
    bool IsPublished);
