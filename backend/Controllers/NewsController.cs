using Edu4Migration.Api.Data;
using Edu4Migration.Api.DTOs;
using Edu4Migration.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<NewsDto>>> GetNews([FromQuery] bool includeDrafts = false)
    {
        var query = db.NewsItems.AsQueryable();
        if (!includeDrafts)
        {
            query = query.Where(item => item.IsPublished && item.PublishedAt <= DateTime.UtcNow.AddDays(1));
        }

        var items = await query.OrderByDescending(item => item.PublishedAt).Select(item => ToDto(item)).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<NewsDto>> GetNewsItem(int id)
    {
        var item = await db.NewsItems.FindAsync(id);
        return item is null ? NotFound() : Ok(ToDto(item));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<NewsDto>> CreateNews(UpsertNewsRequest request)
    {
        var item = new NewsItem
        {
            Title = request.Title,
            Excerpt = request.Excerpt,
            Content = request.Content,
            ImageUrl = request.ImageUrl,
            PublishedAt = request.PublishedAt,
            IsPublished = request.IsPublished
        };

        db.NewsItems.Add(item);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetNewsItem), new { id = item.Id }, ToDto(item));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<NewsDto>> UpdateNews(int id, UpsertNewsRequest request)
    {
        var item = await db.NewsItems.FindAsync(id);
        if (item is null)
        {
            return NotFound();
        }

        item.Title = request.Title;
        item.Excerpt = request.Excerpt;
        item.Content = request.Content;
        item.ImageUrl = request.ImageUrl;
        item.PublishedAt = request.PublishedAt;
        item.IsPublished = request.IsPublished;
        item.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return Ok(ToDto(item));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteNews(int id)
    {
        var item = await db.NewsItems.FindAsync(id);
        if (item is null)
        {
            return NotFound();
        }

        db.NewsItems.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static NewsDto ToDto(NewsItem item)
    {
        return new NewsDto(item.Id, item.Title, item.Excerpt, item.Content, item.ImageUrl, item.PublishedAt, item.IsPublished);
    }
}
