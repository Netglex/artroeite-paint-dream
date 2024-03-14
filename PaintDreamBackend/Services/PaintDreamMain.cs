using PaintDreamBackend.Helpers;
using PaintDreamBackend.Services.Store;

namespace PaintDreamBackend.Services;

public class PaintDreamMain(IServiceScopeFactory serviceScopeFactory, ILogger<PaintDreamMain> logger) : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
    private readonly ILogger<PaintDreamMain> _logger = logger;

    public override async Task StartAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PaintDreamContext>();

        await RetryHelper.UntilNoException(async () => {
            _logger.LogInformation("Trying to connect to DB...");
            await dbContext.Database.EnsureCreatedAsync(stoppingToken);
            _logger.LogInformation("Connected to DB");
        }, TimeSpan.FromSeconds(2), stoppingToken);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.CompletedTask;
    }
}