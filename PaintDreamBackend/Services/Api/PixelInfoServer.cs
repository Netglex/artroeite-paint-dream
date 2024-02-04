using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using PaintDreamBackend.Models.Store;
using PaintDreamBackend.Services.Store;

namespace PaintDreamBackend.Services.Api;

public class PixelInfoServer(ILogger<PixelInfoServer> logger, IServiceScopeFactory serviceScopeFactory) : PixelInfo.PixelInfoBase
{
    private readonly ILogger<PixelInfoServer> _logger = logger;
    private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;

    public override Task<PixelInfoHistoriesDto> GetPixelInfoHistories(Empty request, ServerCallContext context)
    {
        _logger.LogInformation("Reading pixel info histories");

        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PaintDreamContext>();

        dbContext.PixelInfoHistories.Include(pih => pih.History);

        return Task.FromResult(new PixelInfoHistoriesDto
        {
        });
    }

    public override async Task<Empty> CreatePixelInfo(CreatePixelInfoDto request, ServerCallContext context)
    {
        _logger.LogInformation("Creating a pixel info");

        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PaintDreamContext>();

        var pixelInfoHistory = await dbContext.PixelInfoHistories.FirstOrDefaultAsync(pih => pih.Position.X == request.Position.X && pih.Position.Y == request.Position.Y);
        if (pixelInfoHistory == null)
        {
            pixelInfoHistory = new PixelInfoHistoryDb
            {
                Position = new PositionDb(request.Position.X, request.Position.Y),
            };
        }

        var pixelInfo = new PixelInfoDb
        {
            Color = new ColorDb(request.Color.R, request.Color.G, request.Color.B),
            History = pixelInfoHistory
        };

        await dbContext.PixelInfos.AddAsync(pixelInfo);
        await dbContext.SaveChangesAsync();

        return new Empty();
    }
}
