namespace Edu4Migration.Api.DTOs;

public record AuditLogDto(
    int Id,
    string AdminEmail,
    string EntityType,
    string Action,
    string EntityName,
    DateTime CreatedAt);

public record AuditLogPageDto(
    List<AuditLogDto> Items,
    int Page,
    int PageSize,
    int Total,
    int TotalPages);
