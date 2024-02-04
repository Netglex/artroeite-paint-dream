using Microsoft.EntityFrameworkCore;

namespace PaintDreamBackend.Models.Store;

[Owned]
public class PositionDb(int x, int y)
{
    public int X { get; set; } = x;
    public int Y { get; set; } = y;
}