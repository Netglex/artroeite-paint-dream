using Microsoft.EntityFrameworkCore;

namespace PaintDreamBackend.Models.Store;

[Owned]
public class ColorDb(float r, float g, float b)
{
    public float R {get; set;} = r;
    public float G {get; set;} = g;
    public float B {get; set;} = b;
}