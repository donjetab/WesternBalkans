using System.Text.Json;
using Edu4Migration.Api.Data;
using Edu4Migration.Api.DTOs;
using Edu4Migration.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentController(AppDbContext db) : ControllerBase
{
    [HttpGet("homepage")]
    public async Task<ActionResult<HomepageDto>> GetHomepage()
    {
        var content = await db.HomepageContents.OrderBy(item => item.Id).FirstOrDefaultAsync();
        return content is null ? NotFound() : Ok(ToDto(content));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("homepage")]
    public async Task<ActionResult<HomepageDto>> UpdateHomepage(HomepageDto request)
    {
        var content = await db.HomepageContents.OrderBy(item => item.Id).FirstOrDefaultAsync();
        if (content is null)
        {
            content = new HomepageContent();
            db.HomepageContents.Add(content);
        }

        content.HeroEyebrow = request.HeroEyebrow;
        content.HeroTitle = request.HeroTitle;
        content.HeroSubtitle = request.HeroSubtitle;
        content.HeroBody = request.HeroBody;
        content.HeroImageUrl = request.HeroImageUrl;
        content.StatsJson = JsonSerializer.Serialize(request.Stats);
        content.FocusAreasJson = JsonSerializer.Serialize(request.FocusAreas);
        content.PartnersJson = JsonSerializer.Serialize(request.Partners);
        content.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return Ok(ToDto(content));
    }

    [HttpGet("pages/{slug}")]
    public async Task<ActionResult<ContentPageDto>> GetPage(string slug)
    {
        var page = await db.ContentPages
            .Include(item => item.Sections.OrderBy(section => section.SortOrder))
            .SingleOrDefaultAsync(item => item.Slug == slug);

        return page is null ? NotFound() : Ok(ToDto(page));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("pages/{slug}")]
    public async Task<ActionResult<ContentPageDto>> UpdatePage(string slug, ContentPageDto request)
    {
        var page = await db.ContentPages.Include(item => item.Sections).SingleOrDefaultAsync(item => item.Slug == slug);
        if (page is null)
        {
            page = new ContentPage { Slug = slug, Title = request.Title };
            db.ContentPages.Add(page);
        }

        page.Eyebrow = request.Eyebrow;
        page.Title = request.Title;
        page.Intro = request.Intro;
        page.UpdatedAt = DateTime.UtcNow;
        page.Sections.Clear();
        page.Sections = request.Sections.Select((section, index) => new ContentSection
        {
            Title = section.Title,
            Body = section.Body,
            SortOrder = section.SortOrder == 0 ? index : section.SortOrder
        }).ToList();

        await db.SaveChangesAsync();
        return Ok(ToDto(page));
    }

    private static HomepageDto ToDto(HomepageContent content)
    {
        return new HomepageDto(
            content.HeroEyebrow,
            content.HeroTitle,
            content.HeroSubtitle,
            content.HeroBody,
            content.HeroImageUrl,
            Deserialize<List<StatDto>>(content.StatsJson) ?? [],
            Deserialize<List<FocusAreaDto>>(content.FocusAreasJson) ?? [],
            Deserialize<List<PartnerDto>>(content.PartnersJson) ?? []);
    }

    private static ContentPageDto ToDto(ContentPage page)
    {
        return new ContentPageDto(
            page.Slug,
            page.Eyebrow,
            page.Title,
            page.Intro,
            page.Sections.OrderBy(section => section.SortOrder)
                .Select(section => new ContentSectionDto(section.Title, section.Body, section.SortOrder))
                .ToList());
    }

    private static T? Deserialize<T>(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch
        {
            return default;
        }
    }
}
