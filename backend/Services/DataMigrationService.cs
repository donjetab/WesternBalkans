using Edu4Migration.Api.Data;
using Edu4Migration.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Edu4Migration.Api.Services;

/// <summary>
/// Service for migrating data from SQLite to SQL Server.
/// This service reads all data from the existing SQLite database and inserts it into SQL Server,
/// preserving all relationships, foreign keys, and ID values.
/// </summary>
public class DataMigrationService
{
    private readonly AppDbContext _sqliteContext;
    private readonly AppDbContext _sqlServerContext;
    private readonly ILogger<DataMigrationService> _logger;

    public DataMigrationService(
        AppDbContext sqliteContext,
        AppDbContext sqlServerContext,
        ILogger<DataMigrationService> logger)
    {
        _sqliteContext = sqliteContext;
        _sqlServerContext = sqlServerContext;
        _logger = logger;
    }

    /// <summary>
    /// Executes the complete data migration from SQLite to SQL Server.
    /// Migrates all tables while preserving IDs and relationships.
    /// </summary>
    public async Task MigrateAllDataAsync()
    {
        try
        {
            _logger.LogInformation("Starting data migration from SQLite to SQL Server...");

            // Disable foreign keys constraints for SQL Server during migration
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT AdminUsers ON");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT HomepageContents ON");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT ContentPages ON");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT ContentSections ON");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT NewsItems ON");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT MediaAssets ON");

            // Migrate data table by table
            await MigrateAdminUsersAsync();
            _logger.LogInformation("✓ AdminUsers migrated");

            await MigrateMediaAssetsAsync();
            _logger.LogInformation("✓ MediaAssets migrated");

            await MigrateHomepageContentsAsync();
            _logger.LogInformation("✓ HomepageContents migrated");

            await MigrateContentPagesAsync();
            _logger.LogInformation("✓ ContentPages migrated");

            await MigrateContentSectionsAsync();
            _logger.LogInformation("✓ ContentSections migrated");

            await MigrateNewsItemsAsync();
            _logger.LogInformation("✓ NewsItems migrated");

            // Re-enable identity insert
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT AdminUsers OFF");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT HomepageContents OFF");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT ContentPages OFF");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT ContentSections OFF");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT NewsItems OFF");
            await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT MediaAssets OFF");

            _logger.LogInformation("✓ Data migration completed successfully!");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during data migration");
            
            // Clean up - disable identity insert on error
            try
            {
                await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT AdminUsers OFF");
                await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT HomepageContents OFF");
                await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT ContentPages OFF");
                await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT ContentSections OFF");
                await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT NewsItems OFF");
                await _sqlServerContext.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT MediaAssets OFF");
            }
            catch { /* Ignore cleanup errors */ }

            throw;
        }
    }

    private async Task MigrateAdminUsersAsync()
    {
        var users = await _sqliteContext.AdminUsers.ToListAsync();
        
        foreach (var user in users)
        {
            var existingUser = await _sqlServerContext.AdminUsers
                .FirstOrDefaultAsync(u => u.Id == user.Id);
            
            if (existingUser == null)
            {
                _sqlServerContext.AdminUsers.Add(user);
            }
        }

        await _sqlServerContext.SaveChangesAsync();
    }

    private async Task MigrateMediaAssetsAsync()
    {
        var assets = await _sqliteContext.MediaAssets.ToListAsync();
        
        foreach (var asset in assets)
        {
            var existingAsset = await _sqlServerContext.MediaAssets
                .FirstOrDefaultAsync(a => a.Id == asset.Id);
            
            if (existingAsset == null)
            {
                _sqlServerContext.MediaAssets.Add(asset);
            }
        }

        await _sqlServerContext.SaveChangesAsync();
    }

    private async Task MigrateHomepageContentsAsync()
    {
        var contents = await _sqliteContext.HomepageContents.ToListAsync();
        
        foreach (var content in contents)
        {
            var existingContent = await _sqlServerContext.HomepageContents
                .FirstOrDefaultAsync(c => c.Id == content.Id);
            
            if (existingContent == null)
            {
                _sqlServerContext.HomepageContents.Add(content);
            }
        }

        await _sqlServerContext.SaveChangesAsync();
    }

    private async Task MigrateContentPagesAsync()
    {
        var pages = await _sqliteContext.ContentPages
            .Include(p => p.Sections)
            .ToListAsync();
        
        foreach (var page in pages)
        {
            var existingPage = await _sqlServerContext.ContentPages
                .FirstOrDefaultAsync(p => p.Id == page.Id);
            
            if (existingPage == null)
            {
                _sqlServerContext.ContentPages.Add(page);
            }
        }

        await _sqlServerContext.SaveChangesAsync();
    }

    private async Task MigrateContentSectionsAsync()
    {
        var sections = await _sqliteContext.ContentSections.ToListAsync();
        
        foreach (var section in sections)
        {
            var existingSection = await _sqlServerContext.ContentSections
                .FirstOrDefaultAsync(s => s.Id == section.Id);
            
            if (existingSection == null)
            {
                _sqlServerContext.ContentSections.Add(section);
            }
        }

        await _sqlServerContext.SaveChangesAsync();
    }

    private async Task MigrateNewsItemsAsync()
    {
        var newsItems = await _sqliteContext.NewsItems.ToListAsync();
        
        foreach (var item in newsItems)
        {
            var existingItem = await _sqlServerContext.NewsItems
                .FirstOrDefaultAsync(n => n.Id == item.Id);
            
            if (existingItem == null)
            {
                _sqlServerContext.NewsItems.Add(item);
            }
        }

        await _sqlServerContext.SaveChangesAsync();
    }
}
