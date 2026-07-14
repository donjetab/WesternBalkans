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

var defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(defaultConnection))
{
    throw new InvalidOperationException("Database connection string is missing. Set ConnectionStrings:DefaultConnection with .NET User Secrets for development or ConnectionStrings__DefaultConnection in the server environment.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(defaultConnection));

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<SeedService>();
builder.Services.AddScoped<AuditService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT key is missing. Set it with .NET User Secrets for development or Jwt__Key in the server environment.");
}
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
    await EnsureAuditLogsTableAsync(db);
    await EnsureAdminUserColumnsAsync(db);
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

static async Task EnsureAdminUserColumnsAsync(AppDbContext db)
{
    var existingColumns = await GetExistingColumnsAsync(db, "AdminUsers");

    var requiredColumns = new Dictionary<string, string>
    {
        ["Role"] = "nvarchar(max) NOT NULL DEFAULT('Admin')"
    };

    await AddMissingColumnsAsync(db.Database.GetDbConnection(), "AdminUsers", existingColumns, requiredColumns);
}

static async Task EnsureAuditLogsTableAsync(AppDbContext db)
{
    var connection = db.Database.GetDbConnection();
    if (connection.State != System.Data.ConnectionState.Open)
    {
        await connection.OpenAsync();
    }

    await using var command = connection.CreateCommand();
    command.CommandText = """
        IF OBJECT_ID(N'[AuditLogs]', N'U') IS NULL
        BEGIN
            CREATE TABLE [AuditLogs] (
                [Id] int IDENTITY(1,1) NOT NULL,
                [AdminUserId] int NULL,
                [AdminEmail] nvarchar(max) NOT NULL,
                [EntityType] nvarchar(max) NOT NULL,
                [Action] nvarchar(max) NOT NULL,
                [EntityName] nvarchar(max) NOT NULL,
                [CreatedAt] datetime2 NOT NULL,
                CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id]),
                CONSTRAINT [FK_AuditLogs_AdminUsers_AdminUserId] FOREIGN KEY ([AdminUserId]) REFERENCES [AdminUsers] ([Id])
            );
            CREATE INDEX [IX_AuditLogs_AdminUserId] ON [AuditLogs] ([AdminUserId]);
        END
    """;
    await command.ExecuteNonQueryAsync();
}

static async Task EnsureHomepageColumnsAsync(AppDbContext db)
{
    var existingColumns = await GetExistingColumnsAsync(db, "HomepageContents");

    var requiredColumns = new Dictionary<string, string>
    {
        ["HeroEyebrowSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["HeroTitleSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["HeroSubtitleSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["HeroBodySq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["StatsSqJson"] = "nvarchar(max) NOT NULL DEFAULT('[]')",
        ["FocusAreasSqJson"] = "nvarchar(max) NOT NULL DEFAULT('[]')"
    };

    await AddMissingColumnsAsync(db.Database.GetDbConnection(), "HomepageContents", existingColumns, requiredColumns);
}

static async Task EnsureContentPageColumnsAsync(AppDbContext db)
{
    var existingColumns = await GetExistingColumnsAsync(db, "ContentPages");

    var requiredColumns = new Dictionary<string, string>
    {
        ["EyebrowSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["TitleSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["IntroSq"] = "nvarchar(max) NOT NULL DEFAULT('')"
    };

    await AddMissingColumnsAsync(db.Database.GetDbConnection(), "ContentPages", existingColumns, requiredColumns);
}

static async Task EnsureNewsColumnsAsync(AppDbContext db)
{
    var existingColumns = await GetExistingColumnsAsync(db, "NewsItems");

    var requiredColumns = new Dictionary<string, string>
    {
        ["TitleSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["ExcerptSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["ContentSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["ThumbnailUrl"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["DocumentTitle"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["DocumentTitleSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["DocumentUrl"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["GalleryJson"] = "nvarchar(max) NOT NULL DEFAULT('[]')"
    };

    await AddMissingColumnsAsync(db.Database.GetDbConnection(), "NewsItems", existingColumns, requiredColumns);
}

static async Task EnsureContentSectionColumnsAsync(AppDbContext db)
{
    var existingColumns = await GetExistingColumnsAsync(db, "ContentSections");

    var requiredColumns = new Dictionary<string, string>
    {
        ["TitleSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["BodySq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["DocumentTitle"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["DocumentTitleSq"] = "nvarchar(max) NOT NULL DEFAULT('')",
        ["DocumentUrl"] = "nvarchar(max) NOT NULL DEFAULT('')"
    };

    await AddMissingColumnsAsync(db.Database.GetDbConnection(), "ContentSections", existingColumns, requiredColumns);
}

static async Task<HashSet<string>> GetExistingColumnsAsync(AppDbContext db, string tableName)
{
    var connection = db.Database.GetDbConnection();
    if (connection.State != System.Data.ConnectionState.Open)
    {
        await connection.OpenAsync();
    }

    var existingColumns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    await using var command = connection.CreateCommand();
    command.CommandText = @"
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = @tableName";

    var param = command.CreateParameter();
    param.ParameterName = "@tableName";
    param.Value = tableName;
    command.Parameters.Add(param);

    await using var reader = await command.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        existingColumns.Add(reader.GetString(0));
    }

    return existingColumns;
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
        command.CommandText = $"ALTER TABLE {tableName} ADD {name} {definition}";
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
