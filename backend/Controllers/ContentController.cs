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
public class ContentController(AppDbContext db, AuditService audit) : ControllerBase
{
    [HttpGet("homepage")]
    public async Task<ActionResult<HomepageDto>> GetHomepage()
    {
        var content = await db.HomepageContents.OrderBy(item => item.Id).FirstOrDefaultAsync();
        return content is null ? NotFound() : Ok(ToDto(content));
    }

    [HttpPut("homepage")]
    [Authorize(Roles = "Admin,MainAdmin")]
    public async Task<ActionResult<HomepageDto>> UpdateHomepage(HomepageDto request)
    {
        var content = await db.HomepageContents.OrderBy(item => item.Id).FirstOrDefaultAsync();
        if (content is null)
        {
            content = new HomepageContent();
            db.HomepageContents.Add(content);
        }

        content.HeroEyebrow = request.HeroEyebrow;
        content.HeroEyebrowSq = request.HeroEyebrowSq;
        content.HeroTitle = request.HeroTitle;
        content.HeroTitleSq = request.HeroTitleSq;
        content.HeroSubtitle = request.HeroSubtitle;
        content.HeroSubtitleSq = request.HeroSubtitleSq;
        content.HeroBody = request.HeroBody;
        content.HeroBodySq = request.HeroBodySq;
        content.HeroImageUrl = request.HeroImageUrl;
        content.StatsJson = JsonSerializer.Serialize(request.Stats);
        content.StatsSqJson = JsonSerializer.Serialize(request.StatsSq);
        content.FocusAreasJson = JsonSerializer.Serialize(request.FocusAreas);
        content.FocusAreasSqJson = JsonSerializer.Serialize(request.FocusAreasSq);
        content.PartnersJson = JsonSerializer.Serialize(request.Partners);
        content.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        await audit.LogAsync(GetCurrentUserId(), GetCurrentEmail(), "Homepage", "Updated", "Homepage");
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

    [HttpPut("pages/{slug}")]
    [Authorize(Roles = "Admin,MainAdmin")]
    public async Task<ActionResult<ContentPageDto>> UpdatePage(string slug, ContentPageDto request)
    {
        var page = await db.ContentPages.Include(item => item.Sections).SingleOrDefaultAsync(item => item.Slug == slug);
        if (page is null)
        {
            page = new ContentPage { Slug = slug, Title = request.Title };
            db.ContentPages.Add(page);
        }

        page.Eyebrow = request.Eyebrow;
        page.EyebrowSq = request.EyebrowSq;
        page.Title = request.Title;
        page.TitleSq = request.TitleSq;
        page.Intro = request.Intro;
        page.IntroSq = request.IntroSq;
        page.UpdatedAt = DateTime.UtcNow;
        page.Sections.Clear();
        page.Sections = request.Sections.Select((section, index) => new ContentSection
        {
            Title = section.Title,
            TitleSq = section.TitleSq,
            Body = section.Body,
            BodySq = section.BodySq,
            DocumentTitle = section.DocumentTitle,
            DocumentTitleSq = section.DocumentTitleSq,
            DocumentUrl = section.DocumentUrl,
            SortOrder = section.SortOrder == 0 ? index : section.SortOrder
        }).ToList();

        await db.SaveChangesAsync();
        await audit.LogAsync(GetCurrentUserId(), GetCurrentEmail(), "ContentPage", "Updated", page.Title);
        return Ok(ToDto(page));
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

    private static HomepageDto ToDto(HomepageContent content)
    {
        return new HomepageDto(
            content.HeroEyebrow,
            content.HeroEyebrowSq,
            content.HeroTitle,
            content.HeroTitleSq,
            content.HeroSubtitle,
            content.HeroSubtitleSq,
            content.HeroBody,
            content.HeroBodySq,
            content.HeroImageUrl,
            Deserialize<List<StatDto>>(content.StatsJson) ?? [],
            Deserialize<List<StatDto>>(content.StatsSqJson) ?? [],
            Deserialize<List<FocusAreaDto>>(content.FocusAreasJson) ?? [],
            Deserialize<List<FocusAreaDto>>(content.FocusAreasSqJson) ?? [],
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
                .Select(section => new ContentSectionDto(
                    section.Title,
                    section.Body,
                    section.SortOrder,
                    section.DocumentTitle,
                    section.DocumentUrl,
                    section.TitleSq,
                    section.BodySq,
                    section.DocumentTitleSq))
                .ToList(),
            page.EyebrowSq,
            page.TitleSq,
            page.IntroSq);
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
