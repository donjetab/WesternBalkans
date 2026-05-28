using Edu4Migration.Api.Data;
using Edu4Migration.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController(AppDbContext db, IWebHostEnvironment environment) : ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpPost("upload")]
    [RequestSizeLimit(10_000_000)]
    public async Task<ActionResult<MediaAsset>> Upload(IFormFile file, [FromForm] string altText = "")
    {
        if (file.Length == 0)
        {
            return BadRequest("File is empty.");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".pdf" };
        if (!allowed.Contains(extension))
        {
            return BadRequest("Unsupported file type.");
        }

        var uploadsPath = Path.Combine(environment.ContentRootPath, "Uploads");
        Directory.CreateDirectory(uploadsPath);
        var fileName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(uploadsPath, fileName);

        await using (var stream = System.IO.File.Create(fullPath))
        {
            await file.CopyToAsync(stream);
        }

        var asset = new MediaAsset
        {
            FileName = file.FileName,
            Url = $"/uploads/{fileName}",
            AltText = altText
        };

        db.MediaAssets.Add(asset);
        await db.SaveChangesAsync();
        return Ok(asset);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<List<MediaAsset>>> GetAssets()
    {
        return Ok(await db.MediaAssets.OrderByDescending(asset => asset.CreatedAt).ToListAsync());
    }
}
