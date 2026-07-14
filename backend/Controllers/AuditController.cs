using Edu4Migration.Api.Data;
using Edu4Migration.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Controllers;

[ApiController]
[Route("api/audit")]
[Authorize(Roles = "MainAdmin")]
public class AuditController(AppDbContext db) : ControllerBase
{
    [HttpGet("recent")]
    public async Task<ActionResult<List<AuditLogDto>>> GetRecentChanges([FromQuery] int take = 20)
    {
        var limit = Math.Clamp(take, 1, 50);
        var logs = await db.AuditLogs
            .OrderByDescending(log => log.CreatedAt)
            .Take(limit)
            .Select(log => new AuditLogDto(
                log.Id,
                log.AdminEmail,
                log.EntityType,
                log.Action,
                log.EntityName,
                log.CreatedAt))
            .ToListAsync();

        return Ok(logs);
    }

    [HttpGet]
    public async Task<ActionResult<AuditLogPageDto>> GetChanges(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string search = "",
        [FromQuery] string date = "")
    {
        var safePage = Math.Max(page, 1);
        var safePageSize = Math.Clamp(pageSize, 1, 50);
        var query = db.AuditLogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(log =>
                log.AdminEmail.Contains(term)
                || log.EntityType.Contains(term)
                || log.Action.Contains(term)
                || log.EntityName.Contains(term));
        }

        if (DateTime.TryParse(date, out var parsedDate))
        {
            var start = parsedDate.Date;
            var end = start.AddDays(1);
            query = query.Where(log => log.CreatedAt >= start && log.CreatedAt < end);
        }

        var total = await query.CountAsync();
        var totalPages = Math.Max((int)Math.Ceiling(total / (double)safePageSize), 1);
        if (safePage > totalPages) safePage = totalPages;

        var logs = await query
            .OrderByDescending(log => log.CreatedAt)
            .Skip((safePage - 1) * safePageSize)
            .Take(safePageSize)
            .Select(log => new AuditLogDto(
                log.Id,
                log.AdminEmail,
                log.EntityType,
                log.Action,
                log.EntityName,
                log.CreatedAt))
            .ToListAsync();

        return Ok(new AuditLogPageDto(logs, safePage, safePageSize, total, totalPages));
    }
}
