using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
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
    public async Task<ActionResult<MediaAsset>> Upload(
        IFormFile file,
        [FromForm] string altText = "",
        [FromForm] string folder = "",
        [FromForm] string publishedAt = "",
        [FromForm] string title = "",
        [FromForm] int fileIndex = 0)
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
        var relativeFolder = CreateRelativeFolder(folder, publishedAt, title);
        var targetPath = Path.Combine(uploadsPath, relativeFolder);
        Directory.CreateDirectory(targetPath);

        var baseName = folder.Equals("News", StringComparison.OrdinalIgnoreCase)
            ? fileIndex == 0 ? "thumbnail" : fileIndex.ToString(CultureInfo.InvariantCulture)
            : folder.Equals("Documents", StringComparison.OrdinalIgnoreCase)
                ? SlugForFileName(Path.GetFileNameWithoutExtension(file.FileName))
                : Guid.NewGuid().ToString("N");
        var fileName = GetAvailableFileName(targetPath, baseName, extension);
        var fullPath = Path.Combine(targetPath, fileName);

        await using (var stream = System.IO.File.Create(fullPath))
        {
            await file.CopyToAsync(stream);
        }

        var asset = new MediaAsset
        {
            FileName = file.FileName,
            Url = ToUrl(relativeFolder, fileName),
            AltText = altText
        };

        db.MediaAssets.Add(asset);
        await db.SaveChangesAsync();
        return Ok(asset);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsset(int id)
    {
        var asset = await db.MediaAssets.FindAsync(id);
        if (asset is null)
        {
            return NotFound();
        }

        DeleteFile(asset.Url);
        db.MediaAssets.Remove(asset);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete]
    public async Task<IActionResult> DeleteAssetByUrl([FromQuery] string url)
    {
        var asset = await db.MediaAssets.SingleOrDefaultAsync(item => item.Url == url);
        DeleteFile(url);

        if (asset is not null)
        {
            db.MediaAssets.Remove(asset);
            await db.SaveChangesAsync();
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<List<MediaAsset>>> GetAssets()
    {
        return Ok(await db.MediaAssets.OrderByDescending(asset => asset.CreatedAt).ToListAsync());
    }

    private static string CreateRelativeFolder(string folder, string publishedAt, string title)
    {
        if (!folder.Equals("News", StringComparison.OrdinalIgnoreCase))
        {
            return folder.Equals("Documents", StringComparison.OrdinalIgnoreCase) ? "Documents" : "";
        }

        var date = DateTime.TryParse(publishedAt, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed)
            ? parsed.ToString("yyyy.MM.dd", CultureInfo.InvariantCulture)
            : DateTime.UtcNow.ToString("yyyy.MM.dd", CultureInfo.InvariantCulture);
        var safeTitle = SlugForFolder(title);

        return Path.Combine("News", $"{date} - {safeTitle}");
    }

    private static string SlugForFileName(string value)
    {
        var safe = SlugForFolder(value).Replace(" ", "-");
        return string.IsNullOrWhiteSpace(safe) ? Guid.NewGuid().ToString("N") : safe;
    }

    private static string SlugForFolder(string value)
    {
        var normalized = value.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder();
        foreach (var character in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark)
            {
                builder.Append(character);
            }
        }

        var safe = Regex.Replace(builder.ToString().Normalize(NormalizationForm.FormC), @"[^\w\s.-]", "");
        safe = Regex.Replace(safe, @"\s+", " ").Trim();
        return string.IsNullOrWhiteSpace(safe) ? "Untitled News" : safe;
    }

    private static string GetAvailableFileName(string targetPath, string baseName, string extension)
    {
        var fileName = $"{baseName}{extension}";
        var counter = 2;

        while (System.IO.File.Exists(Path.Combine(targetPath, fileName)))
        {
            fileName = $"{baseName}-{counter}{extension}";
            counter += 1;
        }

        return fileName;
    }

    private static string ToUrl(string relativeFolder, string fileName)
    {
        var segments = new[] { "/uploads", relativeFolder.Replace("\\", "/"), fileName }.Where(BooleanHasValue);
        return string.Join("/", segments).Replace("//", "/");
    }

    private void DeleteFile(string url)
    {
        const string uploadsPrefix = "/uploads/";
        if (!url.StartsWith(uploadsPrefix, StringComparison.OrdinalIgnoreCase)) return;

        var relativePath = Uri.UnescapeDataString(url[uploadsPrefix.Length..]).Replace("/", Path.DirectorySeparatorChar.ToString());
        var fullPath = Path.GetFullPath(Path.Combine(environment.ContentRootPath, "Uploads", relativePath));
        var uploadsRoot = Path.GetFullPath(Path.Combine(environment.ContentRootPath, "Uploads"));

        if (fullPath.StartsWith(uploadsRoot, StringComparison.OrdinalIgnoreCase) && System.IO.File.Exists(fullPath))
        {
            System.IO.File.Delete(fullPath);
        }
    }

    private static bool BooleanHasValue(string value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }
}
