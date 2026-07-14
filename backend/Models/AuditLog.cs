namespace Edu4Migration.Api.Models;

public class AuditLog
{
    public int Id { get; set; }
    public int? AdminUserId { get; set; }
    public required string AdminEmail { get; set; }
    public required string EntityType { get; set; }
    public required string Action { get; set; }
    public required string EntityName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public AdminUser? AdminUser { get; set; }
}
