using Microsoft.EntityFrameworkCore;
using PaintDreamBackend.Helpers;
using PaintDreamBackend.Services;
using PaintDreamBackend.Services.Api;
using PaintDreamBackend.Services.Store;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();
builder.Services.AddGrpcReflection();
builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
    );
});

await RetryHelper.UntilNoException(() => builder.Services.AddDbContext<PaintDreamContext>(o =>
{
    o.UseNpgsql(builder.Configuration.GetConnectionString(PaintDreamContext.ConnectionStringKey));
}), TimeSpan.FromSeconds(2));

builder.Services.AddDbContext<PaintDreamContext>(o =>
{
    o.UseNpgsql(builder.Configuration.GetConnectionString(PaintDreamContext.ConnectionStringKey));
});

builder.Services.AddHostedService<PaintDreamMain>();

var app = builder.Build();
app.UseCors();

// Configure the HTTP request pipeline.
app.MapGrpcService<PixelInfoServer>();
app.MapGrpcReflectionService();

app.Run();

