# Quick Migration Reference

## One-Line Summary

Migrate from SQLite to SQL Server with data preservation using EF Core migration + data sync service.

## Quick Steps (5 minutes)

### 1. Start SQL Server
```powershell
Start-Service MSSQL$SQLEXPRESS
```

### 2. Apply Database Migration
```bash
cd backend
dotnet-ef database update
```

### 3. Start the Backend API
```bash
dotnet run
```

### 4. Run the Data Migration
Call the migration endpoint:
```bash
curl -X POST http://localhost:5088/admin/migrate-sqlite-to-sqlserver
```

Or use PowerShell script:
```powershell
.\migrate-data.ps1
```

### 5. Verify
```bash
curl http://localhost:5088/api/news
curl http://localhost:5088/api/content/pages
```

## Files Modified

| File | Change |
|------|--------|
| `Program.cs` | Added `DataMigrationService` DI + migration endpoint |
| `Services/DataMigrationService.cs` | NEW - Data migration logic |
| `Migrations/` | NEW - EF Core schema migration for SQL Server |
| `appsettings.json` | SQL Server connection string (already set) |
| `migrate-data.ps1` | NEW - PowerShell migration script |
| `migrate-data.csx` | NEW - C# script alternative |

## Key Features

✅ Preserves all data and IDs  
✅ Maintains relationships and foreign keys  
✅ Handles multilingual content (English + Albanian)  
✅ Safe - reads from SQLite, writes to SQL Server  
✅ Keeps SQLite database as backup  
✅ Automatic `SET IDENTITY_INSERT` handling  
✅ Comprehensive logging and error handling  

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to SQL Server" | Run `Start-Service MSSQL$SQLEXPRESS` |
| "SQLite database not found" | Ensure `edu4migration.db` exists in backend folder |
| "Migration endpoint returns 404" | Make sure backend is running in Development environment |
| "Data missing after migration" | Check counts before/after, retry migration |
| "Foreign key violations" | Run migration again - it skips existing records |

## Connection Strings

**SQLite:**
```
Data Source=edu4migration.db;
```

**SQL Server:**
```
Server=localhost\SQLEXPRESS;Database=edu4migration;Trusted_Connection=true;Encrypt=false;
```

## Rollback

If needed, restore the connection string in `appsettings.json`:
```json
"DefaultConnection": "Data Source=edu4migration.db;"
```

And change `UseSqlServer` to `UseSqlite` in `Program.cs`.

## Database Tables

- AdminUsers
- HomepageContents
- ContentPages
- ContentSections
- NewsItems
- MediaAssets

All tables migrate with IDs, timestamps, and multilingual content preserved.

## Security Notes

⚠️ Remove the migration endpoint after successful migration!

⚠️ Change JWT key and admin password in production!

⚠️ Never expose the migration endpoint in production!

## Next Steps

1. ✅ Verify all API endpoints work
2. ✅ Test frontend displays data correctly
3. ✅ Archive SQLite database as backup
4. ✅ Remove temporary migration endpoint from Program.cs
5. ✅ Deploy to production with SQL Server

---

For detailed instructions, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
