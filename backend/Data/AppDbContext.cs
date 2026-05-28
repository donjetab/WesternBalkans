using Edu4Migration.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<HomepageContent> HomepageContents => Set<HomepageContent>();
    public DbSet<ContentPage> ContentPages => Set<ContentPage>();
    public DbSet<ContentSection> ContentSections => Set<ContentSection>();
    public DbSet<NewsItem> NewsItems => Set<NewsItem>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AdminUser>().HasIndex(user => user.Email).IsUnique();
        modelBuilder.Entity<ContentPage>().HasIndex(page => page.Slug).IsUnique();
        modelBuilder.Entity<ContentPage>()
            .HasMany(page => page.Sections)
            .WithOne(section => section.Page)
            .HasForeignKey(section => section.ContentPageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
