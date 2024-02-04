
using PaintDreamBackend.Services.Store;

namespace PaintDreamBackend.Services;

public class PaintDreamMain(IServiceScopeFactory serviceScopeFactory) : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PaintDreamContext>();

        await dbContext.Database.EnsureCreatedAsync();
    }
}