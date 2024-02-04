using System.Reactive.Linq;
using System.Reactive.Subjects;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using PaintDreamBackend.Extensions;
using PaintDreamBackend.Models.Store;
using PaintDreamBackend.Services.Store;

namespace PaintDreamBackend.Services.Api;

public class PixelInfoServer : PixelInfo.PixelInfoBase
{
    private readonly ILogger<PixelInfoServer> _logger;
    private readonly IHostApplicationLifetime _hostApplicationLifetime;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    private static Subject<PixelInfoDb> OnPixelInfoCreated = new();

    public PixelInfoServer(
        ILogger<PixelInfoServer> logger,
        IHostApplicationLifetime hostApplicationLifetime,
        IServiceScopeFactory serviceScopeFactory
    )
    {
        _logger = logger;
        _hostApplicationLifetime = hostApplicationLifetime;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public override Task<PixelInfoHistoriesDto> GetPixelInfoHistories(Empty request, ServerCallContext context)
    {
        _logger.LogInformation("Reading pixel info histories for client {Peer}", context.Peer);

        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PaintDreamContext>();

        var pixelInfoHistories = dbContext.PixelInfoHistories.Include(pih => pih.History).ToList();

        var pixelInfoHistoriesDto = new PixelInfoHistoriesDto();
        pixelInfoHistoriesDto.Histories.AddRange(pixelInfoHistories.Select(pih => new PixelInfoHistoryDto
        {
            Position = new PositionDto { X = pih.Position.X, Y = pih.Position.Y },
        }));

        return Task.FromResult(new PixelInfoHistoriesDto
        {
            Histories = { pixelInfoHistories.Select(pih => new PixelInfoHistoryDto
            {
                Position = new PositionDto { X = pih.Position.X, Y = pih.Position.Y },
                History = { pih.History.Select(pi => new PixelInfoDto
                {
                    CreationDate = pi.CreationDate.ToTimestamp(),
                    Color = new ColorDto { R = pi.Color.R, G = pi.Color.G, B = pi.Color.B }
                })}
            }) }
        });
    }

    public override async Task<Empty> CreatePixelInfo(CreatePixelInfoDto request, ServerCallContext context)
    {
        _logger.LogInformation("Creating a pixel info from client {Peer}", context.Peer);

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

        OnPixelInfoCreated.OnNext(pixelInfo);

        return new Empty();
    }

    public override async Task SubscribePixelInfoUpdates(Empty request, IServerStreamWriter<FullPixelInfoDto> responseStream, ServerCallContext context)
    {
        _logger.LogInformation("Streaming new pixel infos to client {Peer}", context.Peer);

        OnPixelInfoCreated.Subscribe(async (pi) =>
        {
            _logger.LogInformation("Sending new pixel info to client {Peer}", context.Peer);

            await responseStream.WriteAsync(new FullPixelInfoDto
            {
                Position = new PositionDto { X = pi.History.Position.X, Y = pi.History.Position.Y },
                CreationDate = pi.CreationDate.ToTimestamp(),
                Color = new ColorDto { R = pi.Color.R, G = pi.Color.G, B = pi.Color.B }
            });
        }, context.CancellationToken);

        await Task.WhenAny(
            context.CancellationToken.WaitAsync(),
            _hostApplicationLifetime.ApplicationStopping.WaitAsync()
        );
    }
}
