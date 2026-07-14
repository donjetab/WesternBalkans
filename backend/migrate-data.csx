#!/usr/bin/env dotnet-script
// Install-Package Microsoft.EntityFrameworkCore.Sqlite
// Install-Package Microsoft.EntityFrameworkCore.SqlServer
// Run with: dotnet script migrate-data.csx

using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Edu4Migration.Api.Data;
using Edu4Migration.Api.Services;
using Microsoft.Extensions.Logging;

// Configuration
const string SQLITE_CONNECTION = "Data Source=edu4migration.db;";
const string SQLSERVER_CONNECTION = "Server=localhost\\SQLEXPRESS;Database=edu4migration;Trusted_Connection=true;Encrypt=false;";

Console.WriteLine("========================================");
Console.WriteLine("  SQLite to SQL Server Data Migration");
Console.WriteLine("========================================");
Console.WriteLine();

try
{
    Console.WriteLine("📋 Setting up database contexts...");
    
    // Create SQLite context
    var sqliteOptions = new DbContextOptionsBuilder<AppDbContext>()
        .UseSqlite(SQLITE_CONNECTION)
        .LogTo(Console.WriteLine, LogLevel.Information)
        .Options;
    
    // Create SQL Server context
    var sqlServerOptions = new DbContextOptionsBuilder<AppDbContext>()
        .UseSqlServer(SQLSERVER_CONNECTION)
        .LogTo(Console.WriteLine, LogLevel.Information)
        .Options;
    
    using var sqliteContext = new AppDbContext(sqliteOptions);
    using var sqlServerContext = new AppDbContext(sqlServerOptions);
    
    // Create logger
    var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
    var logger = loggerFactory.CreateLogger<DataMigrationService>();
    
    Console.WriteLine("✅ Database contexts created successfully");
    Console.WriteLine();
    
    Console.WriteLine("🔍 Checking SQLite database...");
    var sqliteRecords = await sqliteContext.AdminUsers.CountAsync();
    Console.WriteLine($"   Found {sqliteRecords} admin users in SQLite");
    Console.WriteLine();
    
    Console.WriteLine("📊 Starting data migration...");
    Console.WriteLine();
    
    var migrationService = new DataMigrationService(
        sqliteContext,
        sqlServerContext,
        logger);
    
    await migrationService.MigrateAllDataAsync();
    
    Console.WriteLine();
    Console.WriteLine("========================================");
    Console.WriteLine("✅ MIGRATION COMPLETED SUCCESSFULLY!");
    Console.WriteLine("========================================");
    Console.WriteLine();
    Console.WriteLine("📈 Verifying results...");
    
    var adminCount = await sqlServerContext.AdminUsers.CountAsync();
    var pageCount = await sqlServerContext.ContentPages.CountAsync();
    var newsCount = await sqlServerContext.NewsItems.CountAsync();
    var sectionCount = await sqlServerContext.ContentSections.CountAsync();
    
    Console.WriteLine($"   AdminUsers:      {adminCount}");
    Console.WriteLine($"   ContentPages:    {pageCount}");
    Console.WriteLine($"   ContentSections: {sectionCount}");
    Console.WriteLine($"   NewsItems:       {newsCount}");
    Console.WriteLine();
    Console.WriteLine("✅ All data has been migrated to SQL Server!");
}
catch (Exception ex)
{
    Console.WriteLine();
    Console.WriteLine("========================================");
    Console.WriteLine("❌ MIGRATION FAILED!");
    Console.WriteLine("========================================");
    Console.WriteLine();
    Console.WriteLine($"Error: {ex.Message}");
    Console.WriteLine();
    Console.WriteLine("Stack Trace:");
    Console.WriteLine(ex.StackTrace);
    Environment.Exit(1);
}
