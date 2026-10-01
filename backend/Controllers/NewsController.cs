using System.Security.Claims;
using System.Text.Json;
using Edu4Migration.Api.Data;
using Edu4Migration.Api.DTOs;
using Edu4Migration.Api.Models;
using Edu4Migration.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsController(AppDbContext db, AuditService audit) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<NewsDto>>> GetNews([FromQuery] bool includeDrafts = false)
    {
        if (includeDrafts && User.Identity?.IsAuthenticated != true)
        {
            return Unauthorized();
        }

        var query = db.NewsItems.AsQueryable();
        if (!includeDrafts)
        {
            query = query.Where(item => item.IsPublished && item.PublishedAt <= DateTime.UtcNow);
        }

        var items = await query.OrderByDescending(item => item.PublishedAt).Select(item => ToDto(item)).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<NewsDto>> GetNewsItem(int id)
    {
        var item = await db.NewsItems.FindAsync(id);
        if (item is null)
        {
            return NotFound();
        }

        if ((!item.IsPublished || item.PublishedAt > DateTime.UtcNow) && User.Identity?.IsAuthenticated != true)
        {
            return NotFound();
        }

        return Ok(ToDto(item));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,MainAdmin")]
    public async Task<ActionResult<NewsDto>> CreateNews(UpsertNewsRequest request)
    {
        var item = new NewsItem
        {
            Title = request.Title,
            TitleSq = request.TitleSq,
            Excerpt = request.Excerpt,
            ExcerptSq = request.ExcerptSq,
            Content = request.Content,
            ContentSq = request.ContentSq,
            ImageUrl = request.ImageUrl,
            ThumbnailUrl = request.ThumbnailUrl,
            DocumentTitle = request.DocumentTitle,
            DocumentTitleSq = request.DocumentTitleSq,
            DocumentUrl = request.DocumentUrl,
            GalleryJson = JsonSerializer.Serialize(request.Gallery ?? new List<string>()),
            PublishedAt = request.PublishedAt,
            IsPublished = request.IsPublished
        };

        db.NewsItems.Add(item);
        await db.SaveChangesAsync();
        await audit.LogAsync(GetCurrentUserId(), GetCurrentEmail(), "News", "Created", item.Title);
        return CreatedAtAction(nameof(GetNewsItem), new { id = item.Id }, ToDto(item));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,MainAdmin")]
    public async Task<ActionResult<NewsDto>> UpdateNews(int id, UpsertNewsRequest request)
    {
        var item = await db.NewsItems.FindAsync(id);
        if (item is null)
        {
            return NotFound();
        }

        item.Title = request.Title;
        item.TitleSq = request.TitleSq;
        item.Excerpt = request.Excerpt;
        item.ExcerptSq = request.ExcerptSq;
        item.Content = request.Content;
        item.ContentSq = request.ContentSq;
        item.ImageUrl = request.ImageUrl;
        item.ThumbnailUrl = request.ThumbnailUrl;
        item.DocumentTitle = request.DocumentTitle;
        item.DocumentTitleSq = request.DocumentTitleSq;
        item.DocumentUrl = request.DocumentUrl;
        item.GalleryJson = JsonSerializer.Serialize(request.Gallery ?? new List<string>());
        item.PublishedAt = request.PublishedAt;
        item.IsPublished = request.IsPublished;
        item.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        await audit.LogAsync(GetCurrentUserId(), GetCurrentEmail(), "News", "Updated", item.Title);
        return Ok(ToDto(item));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,MainAdmin")]
    public async Task<IActionResult> DeleteNews(int id)
    {
        var item = await db.NewsItems.FindAsync(id);
        if (item is null)
        {
            return NotFound();
        }

        db.NewsItems.Remove(item);
        await db.SaveChangesAsync();
        await audit.LogAsync(GetCurrentUserId(), GetCurrentEmail(), "News", "Deleted", item.Title);
        return NoContent();
    }

    private int GetCurrentUserId()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return int.TryParse(id, out var parsed) ? parsed : 0;
    }

    private string GetCurrentEmail()
    {
        return User.FindFirstValue(ClaimTypes.Email) ?? "system";
    }

    private static NewsDto ToDto(NewsItem item)
    {
        return new NewsDto(
            item.Id,
            item.Title,
            item.TitleSq,
            item.Excerpt,
            item.ExcerptSq,
            item.Content,
            item.ContentSq,
            item.ImageUrl,
            item.ThumbnailUrl,
            item.DocumentTitle,
            item.DocumentTitleSq,
            item.DocumentUrl,
            DeserializeGallery(item.GalleryJson),
            item.PublishedAt,
            item.IsPublished);
    }

    private static List<string> DeserializeGallery(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }
}
