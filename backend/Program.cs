using System.Text;
using Edu4Migration.Api.Data;
using Edu4Migration.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "DataProtectionKeys")));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<SeedService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is missing.");
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    await EnsureHomepageColumnsAsync(db);
    await EnsureContentPageColumnsAsync(db);
    await EnsureNewsColumnsAsync(db);
    await EnsureContentSectionColumnsAsync(db);
    await BackfillAlbanianContentAsync(db);
    await MigrateDocumentUrlsAsync(db);
    await scope.ServiceProvider.GetRequiredService<SeedService>().SeedAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "Uploads");
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

static async Task EnsureHomepageColumnsAsync(AppDbContext db)
{
    var connection = db.Database.GetDbConnection();
    if (connection.State != System.Data.ConnectionState.Open)
    {
        await connection.OpenAsync();
    }

    var existingColumns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    await using (var command = connection.CreateCommand())
    {
        command.CommandText = "PRAGMA table_info(HomepageContents)";
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            existingColumns.Add(reader.GetString(1));
        }
    }

    var requiredColumns = new Dictionary<string, string>
    {
        ["HeroEyebrowSq"] = "TEXT NOT NULL DEFAULT ''",
        ["HeroTitleSq"] = "TEXT NOT NULL DEFAULT ''",
        ["HeroSubtitleSq"] = "TEXT NOT NULL DEFAULT ''",
        ["HeroBodySq"] = "TEXT NOT NULL DEFAULT ''",
        ["StatsSqJson"] = "TEXT NOT NULL DEFAULT '[]'",
        ["FocusAreasSqJson"] = "TEXT NOT NULL DEFAULT '[]'"
    };

    await AddMissingColumnsAsync(connection, "HomepageContents", existingColumns, requiredColumns);
}

static async Task EnsureContentPageColumnsAsync(AppDbContext db)
{
    var connection = db.Database.GetDbConnection();
    if (connection.State != System.Data.ConnectionState.Open)
    {
        await connection.OpenAsync();
    }

    var existingColumns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    await using (var command = connection.CreateCommand())
    {
        command.CommandText = "PRAGMA table_info(ContentPages)";
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            existingColumns.Add(reader.GetString(1));
        }
    }

    var requiredColumns = new Dictionary<string, string>
    {
        ["EyebrowSq"] = "TEXT NOT NULL DEFAULT ''",
        ["TitleSq"] = "TEXT NOT NULL DEFAULT ''",
        ["IntroSq"] = "TEXT NOT NULL DEFAULT ''"
    };

    await AddMissingColumnsAsync(connection, "ContentPages", existingColumns, requiredColumns);
}

static async Task EnsureNewsColumnsAsync(AppDbContext db)
{
    var connection = db.Database.GetDbConnection();
    if (connection.State != System.Data.ConnectionState.Open)
    {
        await connection.OpenAsync();
    }

    var existingColumns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    await using (var command = connection.CreateCommand())
    {
        command.CommandText = "PRAGMA table_info(NewsItems)";
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            existingColumns.Add(reader.GetString(1));
        }
    }

    var requiredColumns = new Dictionary<string, string>
    {
        ["TitleSq"] = "TEXT NOT NULL DEFAULT ''",
        ["ExcerptSq"] = "TEXT NOT NULL DEFAULT ''",
        ["ContentSq"] = "TEXT NOT NULL DEFAULT ''",
        ["ThumbnailUrl"] = "TEXT NOT NULL DEFAULT ''",
        ["DocumentTitle"] = "TEXT NOT NULL DEFAULT ''",
        ["DocumentTitleSq"] = "TEXT NOT NULL DEFAULT ''",
        ["DocumentUrl"] = "TEXT NOT NULL DEFAULT ''",
        ["GalleryJson"] = "TEXT NOT NULL DEFAULT '[]'"
    };

    await AddMissingColumnsAsync(connection, "NewsItems", existingColumns, requiredColumns);
}

static async Task EnsureContentSectionColumnsAsync(AppDbContext db)
{
    var connection = db.Database.GetDbConnection();
    if (connection.State != System.Data.ConnectionState.Open)
    {
        await connection.OpenAsync();
    }

    var existingColumns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    await using (var command = connection.CreateCommand())
    {
        command.CommandText = "PRAGMA table_info(ContentSections)";
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            existingColumns.Add(reader.GetString(1));
        }
    }

    var requiredColumns = new Dictionary<string, string>
    {
        ["TitleSq"] = "TEXT NOT NULL DEFAULT ''",
        ["BodySq"] = "TEXT NOT NULL DEFAULT ''",
        ["DocumentTitle"] = "TEXT NOT NULL DEFAULT ''",
        ["DocumentTitleSq"] = "TEXT NOT NULL DEFAULT ''",
        ["DocumentUrl"] = "TEXT NOT NULL DEFAULT ''"
    };

    await AddMissingColumnsAsync(connection, "ContentSections", existingColumns, requiredColumns);
}

static async Task AddMissingColumnsAsync(
    System.Data.Common.DbConnection connection,
    string tableName,
    HashSet<string> existingColumns,
    Dictionary<string, string> requiredColumns)
{
    foreach (var (name, definition) in requiredColumns)
    {
        if (existingColumns.Contains(name)) continue;

        await using var command = connection.CreateCommand();
        command.CommandText = $"ALTER TABLE {tableName} ADD COLUMN {name} {definition}";
        await command.ExecuteNonQueryAsync();
    }
}

static async Task BackfillAlbanianContentAsync(AppDbContext db)
{
    await db.Database.ExecuteSqlRawAsync("""
        UPDATE HomepageContents
        SET
            HeroEyebrowSq = CASE WHEN HeroEyebrowSq = '' THEN HeroEyebrow ELSE HeroEyebrowSq END,
            HeroTitleSq = CASE WHEN HeroTitleSq = '' THEN HeroTitle ELSE HeroTitleSq END,
            HeroSubtitleSq = CASE WHEN HeroSubtitleSq = '' THEN HeroSubtitle ELSE HeroSubtitleSq END,
            HeroBodySq = CASE WHEN HeroBodySq = '' THEN HeroBody ELSE HeroBodySq END,
            StatsSqJson = CASE WHEN StatsSqJson = '[]' THEN StatsJson ELSE StatsSqJson END,
            FocusAreasSqJson = CASE WHEN FocusAreasSqJson = '[]' THEN FocusAreasJson ELSE FocusAreasSqJson END
    """);

    await db.Database.ExecuteSqlRawAsync("""
        UPDATE ContentPages
        SET
            EyebrowSq = CASE WHEN EyebrowSq = '' THEN Eyebrow ELSE EyebrowSq END,
            TitleSq = CASE WHEN TitleSq = '' THEN Title ELSE TitleSq END,
            IntroSq = CASE WHEN IntroSq = '' THEN Intro ELSE IntroSq END
    """);

    await db.Database.ExecuteSqlRawAsync("""
        UPDATE ContentSections
        SET
            TitleSq = CASE WHEN TitleSq = '' THEN Title ELSE TitleSq END,
            BodySq = CASE WHEN BodySq = '' THEN Body ELSE BodySq END,
            DocumentTitleSq = CASE WHEN DocumentTitleSq = '' THEN DocumentTitle ELSE DocumentTitleSq END
    """);

    await db.Database.ExecuteSqlRawAsync("""
        UPDATE NewsItems
        SET
            TitleSq = CASE WHEN TitleSq = '' THEN Title ELSE TitleSq END,
            ExcerptSq = CASE WHEN ExcerptSq = '' THEN Excerpt ELSE ExcerptSq END,
            ContentSq = CASE WHEN ContentSq = '' THEN Content ELSE ContentSq END,
            DocumentTitleSq = CASE WHEN DocumentTitleSq = '' THEN DocumentTitle ELSE DocumentTitleSq END
    """);
}

static async Task MigrateDocumentUrlsAsync(AppDbContext db)
{
    await db.Database.ExecuteSqlRawAsync("""
        UPDATE NewsItems
        SET DocumentUrl = replace(DocumentUrl, '/assets/Downloadable%20Documents/', '/uploads/Documents/')
        WHERE DocumentUrl LIKE '/assets/Downloadable%20Documents/%'
    """);

    await db.Database.ExecuteSqlRawAsync("""
        UPDATE ContentSections
        SET DocumentUrl = replace(DocumentUrl, '/assets/Downloadable%20Documents/', '/uploads/Documents/')
        WHERE DocumentUrl LIKE '/assets/Downloadable%20Documents/%'
    """);

    await db.Database.ExecuteSqlRawAsync("""
        UPDATE ContentSections
        SET
            DocumentTitle = CASE
                WHEN DocumentTitle = '' THEN 'ToR Microcredential Expert PDF'
                ELSE DocumentTitle
            END,
            DocumentUrl = '/uploads/Documents/ToR-Microcredential-Expert-WB-Edu4Migration.pdf'
        WHERE Title LIKE '%Microcredential Expert%'
          AND (DocumentUrl IS NULL OR DocumentUrl = '')
    """);
}
