# SQLite to SQL Server Migration Guide

This guide provides step-by-step instructions for migrating your Edu4Migration database from SQLite to Microsoft SQL Server while preserving all data, relationships, and IDs.

## Overview

The migration process will:
- ✅ Transfer all data from SQLite to SQL Server
- ✅ Preserve all IDs and relationships
- ✅ Maintain foreign keys and referential integrity
- ✅ Handle multi-language content (Albanian/Sq fields)
- ✅ Keep the original SQLite database intact (as a backup)
- ✅ Migrate: AdminUsers, HomepageContents, ContentPages, ContentSections, NewsItems, MediaAssets

## Prerequisites

Before starting, ensure you have:
- SQL Server Express (SQLEXPRESS) or any SQL Server instance installed and running
- .NET 8 SDK
- The Edu4Migration project configured with both SQLite and SQL Server packages
- Backup of your SQLite database (`edu4migration.db`)

## Step-by-Step Migration Process

### Step 1: Verify SQL Server is Running

Check that SQL Server Express is running:

```powershell
Get-Service | Where-Object { $_.Name -like '*SQL*' }
```

Expected output shows `MSSQL$SQLEXPRESS` with status `Running`.

If not running, start it:

```powershell
Start-Service MSSQL$SQLEXPRESS
```

### Step 2: Create the SQL Server Database (Optional)

SQL Server will auto-create the database on first connection, but you can pre-create it:

```sql
CREATE DATABASE edu4migration;
```

### Step 3: Apply the EF Core Migration

Navigate to the backend directory and apply the SQL Server migration:

```bash
cd backend
dotnet-ef database update
```

This creates all tables in SQL Server with the correct schema.

**Output should show:**
```
Build started...
Build succeeded.
Applying migration '20260605131815_InitialSqlServerMigration'
Done.
```

### Step 4: Configure Database Contexts (Program.cs)

The migration utility requires two separate DbContext instances:
1. One for reading from SQLite
2. One for writing to SQL Server

The project has been configured in `Program.cs` to support this. Verify the following is present:

```csharp
// SQL Server context (default)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// SQLite context for reading (optional, can be created in Program.cs for migration)
```

### Step 5: Run the Data Migration

Create a temporary migration runner program, or use the provided migration endpoint.

**Option A: Using the Migration API Endpoint (Recommended)**

A temporary endpoint can be added to handle migrations. Add this to `Program.cs`:

```csharp
// Temporary migration endpoint - REMOVE AFTER MIGRATION!
if (app.Environment.IsDevelopment())
{
    app.MapPost("/admin/migrate-sqlite-to-sqlserver", async (
        IServiceProvider serviceProvider,
        ILogger<Program> logger) =>
    {
        try
        {
            logger.LogWarning("⚠️  Starting SQLite to SQL Server data migration...");
            
            // Create temporary SQLite context
            var sqliteOptions = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite("Data Source=edu4migration.db;")
                .Options;
            
            using var sqliteContext = new AppDbContext(sqliteOptions);
            var sqlServerContext = serviceProvider.GetRequiredService<AppDbContext>();
            var migrationService = new DataMigrationService(
                sqliteContext,
                sqlServerContext,
                serviceProvider.GetRequiredService<ILogger<DataMigrationService>>());
            
            await migrationService.MigrateAllDataAsync();
            
            logger.LogInformation("✅ Migration completed successfully!");
            return Results.Ok(new { message = "Migration completed successfully!" });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "❌ Migration failed");
            return Results.BadRequest(new { error = ex.Message });
        }
    }).WithName("MigrateSqliteToSqlServer").WithOpenApi();
}
```

Then start the backend:

```bash
dotnet run
```

And call the migration endpoint:

```bash
curl -X POST http://localhost:5088/admin/migrate-sqlite-to-sqlserver
```

**Option B: Using a Console Application**

Create a standalone migration runner (see `migrate-data.cs` example below).

**Option C: Manual SQL Import**

Export SQLite data and import to SQL Server using SQL Server Management Studio or sqlcmd.

### Step 6: Verify Migration Success

After migration completes, verify the data:

#### Check record counts:

```bash
# In SQL Server (via SQL Server Management Studio or sqlcmd):
SELECT 'AdminUsers' as [Table], COUNT(*) as [Count] FROM AdminUsers
UNION ALL
SELECT 'HomepageContents', COUNT(*) FROM HomepageContents
UNION ALL
SELECT 'ContentPages', COUNT(*) FROM ContentPages
UNION ALL
SELECT 'ContentSections', COUNT(*) FROM ContentSections
UNION ALL
SELECT 'NewsItems', COUNT(*) FROM NewsItems
UNION ALL
SELECT 'MediaAssets', COUNT(*) FROM MediaAssets;
```

#### Verify foreign keys are intact:

```bash
# Check if ContentSections properly link to ContentPages
SELECT cs.Id, cs.Title, cp.Id as PageId, cp.Slug
FROM ContentSections cs
LEFT JOIN ContentPages cp ON cs.ContentPageId = cp.Id
WHERE cp.Id IS NULL;  -- Should return 0 rows
```

#### Test the API:

```bash
curl http://localhost:5088/api/news
curl http://localhost:5088/api/content/pages
```

### Step 7: Update Seeding Logic (If Needed)

The `Program.cs` currently uses `EnsureCreated()` which may cause issues during migration. Update it to use migrations:

```csharp
// Change from:
db.Database.EnsureCreated();

// To:
db.Database.Migrate();
```

### Step 8: Disable SQLite Configuration

After successful migration, you can optionally remove SQLite references from the project:

**Option 1: Keep SQLite (Recommended for now)**

Keep the SQLite package installed as a backup reference. No changes needed.

**Option 2: Remove SQLite Completely**

Remove the SQLite package:

```bash
dotnet remove package Microsoft.EntityFrameworkCore.Sqlite
```

Update `Program.cs` if there are any SQLite-specific configurations.

### Step 9: Post-Migration Cleanup

**AFTER verifying everything works perfectly:**

1. Remove the temporary migration endpoint from `Program.cs` (if you added one)
2. Update configuration to remove any SQLite connection strings
3. Archive the `edu4migration.db` file as a backup
4. Keep the SQL Server database as the production database

## Troubleshooting

### Issue: "Cannot find SQLite database file"

**Solution:** Ensure `edu4migration.db` exists in the backend project root directory.

### Issue: "Unable to locate a Local Database Runtime installation"

**Solution:** Make sure you're using `localhost\SQLEXPRESS` or a valid SQL Server instance name in the connection string, not LocalDB.

### Issue: "Foreign key constraint violated"

**Solution:** 
1. Verify all parent records are migrated before child records
2. Check that IDs are being preserved correctly
3. Ensure `SET IDENTITY_INSERT` is enabled during migration

### Issue: "Some data is missing after migration"

**Solution:**
1. Check record counts before and after migration
2. Verify no exceptions were logged during migration
3. Run the migration again (it skips existing records)

### Issue: Backend starts but data is gone

**Solution:**
1. Confirm the SQL Server connection string is correct
2. Verify the migration ran successfully
3. Check SQL Server database contains the data (use SQL Server Management Studio)

## Rollback Plan

If something goes wrong:

1. **Stop the API server**
2. **Restore the connection string to SQLite** in `appsettings.json`:
   ```json
   "DefaultConnection": "Data Source=edu4migration.db;"
   ```
3. **Remove the `UseSqlServer` call** in `Program.cs` and use `UseSqlite` instead
4. **Restart the API** - it will work with the original SQLite database
5. **Investigate the issue** and try migration again

## Files Modified

- `backend/Program.cs` - Added DbContext configuration and migration endpoint
- `backend/Services/DataMigrationService.cs` - Data migration logic (NEW)
- `backend/Migrations/` - EF Core migration files (NEW)
- `backend/appsettings.json` - SQL Server connection string

## Database Schema

### Tables Created:

1. **AdminUsers** - Admin user accounts with roles
2. **HomepageContents** - Homepage hero and content sections
3. **ContentPages** - Content pages with slugs
4. **ContentSections** - Sections within content pages (cascade delete on parent)
5. **NewsItems** - News/blog posts with publishing status
6. **MediaAssets** - Media files and images

All tables have timestamps (CreatedAt, UpdatedAt) and multilingual support (English + Albanian/Sq).

## Support

If you encounter issues not covered in this guide:

1. Check the backend logs for detailed error messages
2. Verify SQL Server is running and accessible
3. Ensure the connection string in `appsettings.json` is correct
4. Review the `DataMigrationService.cs` implementation
5. Check SQL Server for existing data using SQL Server Management Studio

## Security Notes

⚠️ **IMPORTANT:**

- The temporary migration endpoint should be **removed after migration**
- Never expose the migration endpoint in production
- The JWT key in `appsettings.json` must be changed before deployment
- Admin credentials in `appsettings.json` are for development only

## Next Steps

After successful migration:

1. ✅ Test all API endpoints thoroughly
2. ✅ Run the frontend and verify data displays correctly
3. ✅ Update any documentation referring to SQLite
4. ✅ Archive the SQLite database as a backup
5. ✅ Remove the temporary migration code
6. ✅ Update your deployment process to use SQL Server
7. ✅ Set up SQL Server backups and maintenance

---

**Migration Date:** June 5, 2026  
**From:** SQLite (edu4migration.db)  
**To:** SQL Server (SQLEXPRESS / localhost)  
**Schema Version:** EF Core 8.0.15
