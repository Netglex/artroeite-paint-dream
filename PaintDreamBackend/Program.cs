using Microsoft.EntityFrameworkCore;
using PaintDreamBackend.Services;
using PaintDreamBackend.Services.Api;
using PaintDreamBackend.Services.Store;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();
builder.Services.AddGrpcReflection();

builder.Services.AddDbContext<PaintDreamContext>(o =>
{
    o.UseNpgsql(builder.Configuration.GetConnectionString(PaintDreamContext.ConnectionStringKey));
});

builder.Services.AddHostedService<PaintDreamService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcService<PixelInfoServer>();
app.MapGrpcReflectionService();

app.Run();

