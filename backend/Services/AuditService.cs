using Edu4Migration.Api.Data;
using Edu4Migration.Api.Models;

namespace Edu4Migration.Api.Services;

public class AuditService(AppDbContext db)
{
    public async Task LogAsync(int? adminUserId, string adminEmail, string entityType, string action, string entityName)
    {
        var log = new AuditLog
        {
            AdminUserId = adminUserId,
            AdminEmail = adminEmail,
            EntityType = entityType,
            Action = action,
            EntityName = entityName,
            CreatedAt = DateTime.UtcNow
        };

        db.AuditLogs.Add(log);
        await db.SaveChangesAsync();
    }
}
