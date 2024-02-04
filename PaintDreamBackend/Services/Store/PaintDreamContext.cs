using Microsoft.EntityFrameworkCore;
using PaintDreamBackend.Models.Store;

namespace PaintDreamBackend.Services.Store;

public class PaintDreamContext(DbContextOptions<PaintDreamContext> options) : DbContext(options)
{
    public const string ConnectionStringKey = "PaintDream";

    public DbSet<PixelInfoHistoryDb> PixelInfoHistories { get; set; }
    public DbSet<PixelInfoDb> PixelInfos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .Entity<PixelInfoDb>()
            .Property(pi => pi.CreationDate)
            .HasConversion(v => v.ToString(), v => DateTime.Parse(v));
    }
}