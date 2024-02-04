using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PaintDreamBackend.Models.Store;

namespace PaintDreamBackend.Services.Store;

public class PaintDreamContext(DbContextOptions<PaintDreamContext> options) : DbContext(options)
{
    public const string ConnectionStringKey = "PaintDream";

    private Dictionary<Type, ValueConverter> _valueConverterDictionary = new()
    {
        [typeof(DateTime)] = new ValueConverter<DateTime, string>(
            v => v.ToString(),
            v => DateTime.SpecifyKind(DateTime.Parse(v), DateTimeKind.Utc)
        )
    };

    public DbSet<PixelInfoHistoryDb> PixelInfoHistories { get; set; }
    public DbSet<PixelInfoDb> PixelInfos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        foreach (var mutableEntityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var propertyInfo in mutableEntityType.ClrType.GetProperties())
            {
                if (_valueConverterDictionary.TryGetValue(propertyInfo.PropertyType, out var valueConverter))
                {
                    mutableEntityType
                        .AddProperty(propertyInfo)
                        .SetValueConverter(valueConverter);
                }
            }
        }
    }
}