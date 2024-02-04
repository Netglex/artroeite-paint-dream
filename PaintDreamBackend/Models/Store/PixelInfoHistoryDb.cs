namespace PaintDreamBackend.Models.Store;

public class PixelInfoHistoryDb
{
    public int Id { get; set; }
    public required PositionDb Position { get; set; }
    public List<PixelInfoDb> History { get; } = [];
}