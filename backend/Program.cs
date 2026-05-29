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
    await EnsureNewsColumnsAsync(db);
    await EnsureContentSectionColumnsAsync(db);
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

static async Task EnsureNewsColumnsAsync(AppDbContext db)
{
    var connection = db.Database.GetDbConnection();
    await connection.OpenAsync();

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
        ["ThumbnailUrl"] = "TEXT NOT NULL DEFAULT ''",
        ["DocumentTitle"] = "TEXT NOT NULL DEFAULT ''",
        ["DocumentUrl"] = "TEXT NOT NULL DEFAULT ''",
        ["GalleryJson"] = "TEXT NOT NULL DEFAULT '[]'"
    };

    foreach (var (name, definition) in requiredColumns)
    {
        if (existingColumns.Contains(name)) continue;

        await using var command = connection.CreateCommand();
        command.CommandText = $"ALTER TABLE NewsItems ADD COLUMN {name} {definition}";
        await command.ExecuteNonQueryAsync();
    }
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
        ["DocumentTitle"] = "TEXT NOT NULL DEFAULT ''",
        ["DocumentUrl"] = "TEXT NOT NULL DEFAULT ''"
    };

    foreach (var (name, definition) in requiredColumns)
    {
        if (existingColumns.Contains(name)) continue;

        await using var command = connection.CreateCommand();
        command.CommandText = $"ALTER TABLE ContentSections ADD COLUMN {name} {definition}";
        await command.ExecuteNonQueryAsync();
    }
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
}
