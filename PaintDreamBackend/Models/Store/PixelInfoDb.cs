using System.ComponentModel.DataAnnotations.Schema;

namespace PaintDreamBackend.Models.Store;

public class PixelInfoDb
{
    public int Id { get; set; }
    public DateTime CreationDate { get; } = DateTime.UtcNow;
    public required ColorDb Color { get; set; }

    [ForeignKey(nameof(History))]
    public int HistoryId { get; set; }
    public required PixelInfoHistoryDb History { get; set; }
}