using System.Globalization;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Edu4Migration.Api.Data;
using Edu4Migration.Api.Models;
using Edu4Migration.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController(AppDbContext db, IWebHostEnvironment environment, AuditService audit) : ControllerBase
{
    [HttpPost("upload")]
    [Authorize(Roles = "Admin,MainAdmin")]
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

        if (!await HasExpectedFileSignatureAsync(file, extension))
        {
            return BadRequest("The file contents do not match the selected file type.");
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
        await audit.LogAsync(GetCurrentUserId(), GetCurrentEmail(), "Media", "Uploaded", asset.FileName);
        return Ok(asset);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,MainAdmin")]
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
        await audit.LogAsync(GetCurrentUserId(), GetCurrentEmail(), "Media", "Deleted", asset.FileName);
        return NoContent();
    }

    [HttpDelete]
    [Authorize(Roles = "Admin,MainAdmin")]
    public async Task<IActionResult> DeleteAssetByUrl([FromQuery] string url)
    {
        var asset = await db.MediaAssets.SingleOrDefaultAsync(item => item.Url == url);
        DeleteFile(url);

        if (asset is not null)
        {
            db.MediaAssets.Remove(asset);
            await db.SaveChangesAsync();
        }

        await audit.LogAsync(GetCurrentUserId(), GetCurrentEmail(), "Media", "Deleted", asset?.FileName ?? url);

        return NoContent();
    }

    [Authorize(Roles = "Admin,MainAdmin")]
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

        string relativePath;
        try
        {
            relativePath = Uri.UnescapeDataString(url[uploadsPrefix.Length..]).Replace("/", Path.DirectorySeparatorChar.ToString());
        }
        catch (UriFormatException)
        {
            return;
        }

        var uploadsRoot = Path.GetFullPath(Path.Combine(environment.ContentRootPath, "Uploads"));
        var fullPath = Path.GetFullPath(Path.Combine(uploadsRoot, relativePath));
        var pathFromRoot = Path.GetRelativePath(uploadsRoot, fullPath);

        if (!Path.IsPathRooted(pathFromRoot)
            && pathFromRoot != ".."
            && !pathFromRoot.StartsWith($"..{Path.DirectorySeparatorChar}", StringComparison.Ordinal)
            && System.IO.File.Exists(fullPath))
        {
            System.IO.File.Delete(fullPath);
        }
    }

    private static async Task<bool> HasExpectedFileSignatureAsync(IFormFile file, string extension)
    {
        var header = new byte[12];
        await using var stream = file.OpenReadStream();
        var bytesRead = await stream.ReadAsync(header.AsMemory(0, header.Length));

        return extension switch
        {
            ".jpg" or ".jpeg" => bytesRead >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF,
            ".png" => bytesRead >= 8 && header.AsSpan(0, 8).SequenceEqual(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A }),
            ".webp" => bytesRead >= 12
                && header.AsSpan(0, 4).SequenceEqual("RIFF"u8)
                && header.AsSpan(8, 4).SequenceEqual("WEBP"u8),
            ".pdf" => bytesRead >= 5 && header.AsSpan(0, 5).SequenceEqual("%PDF-"u8),
            _ => false
        };
    }

    private static bool BooleanHasValue(string value)
    {
        return !string.IsNullOrWhiteSpace(value);
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
}
