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

    private static readonly Subject<List<PixelInfoDb>> OnPixelInfosCreated = new();
    private static readonly SemaphoreSlim Semaphore = new(1, 1);

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
                History = { pih.History.OrderByDescending(pi => pi.CreationDate).Select(pi => new PixelInfoDto
                {
                    CreationDate = pi.CreationDate.ToTimestamp(),
                    Color = new ColorDto { R = pi.Color.R, G = pi.Color.G, B = pi.Color.B }
                })}
            }) }
        });
    }

    public override async Task<Empty> CreatePixelInfos(CreatePixelInfosDto request, ServerCallContext context)
    {
        try
        {
            _logger.LogInformation("Creating pixel infos from client {Peer}", context.Peer);

            await Semaphore.WaitAsync();

            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<PaintDreamContext>();

            var pixelInfos = new List<PixelInfoDb>();
            foreach (var cpi in request.PixelInfos)
            {
                var pixelInfoHistory = await dbContext.PixelInfoHistories.FirstOrDefaultAsync(pih => pih.Position.X == cpi.Position.X && pih.Position.Y == cpi.Position.Y);

                pixelInfoHistory ??= new PixelInfoHistoryDb
                {
                    Position = new PositionDb(cpi.Position.X, cpi.Position.Y),
                };

                var pixelInfo = new PixelInfoDb
                {
                    Color = new ColorDb(cpi.Color.R, cpi.Color.G, cpi.Color.B),
                    History = pixelInfoHistory
                };

                await dbContext.PixelInfos.AddAsync(pixelInfo);
                pixelInfos.Add(pixelInfo);
            }
            await dbContext.SaveChangesAsync();
            OnPixelInfosCreated.OnNext(pixelInfos);
        }
        catch { }
        finally
        {
            Semaphore.Release();
        }

        return new Empty();
    }

    public override async Task SubscribePixelInfosUpdates(Empty request, IServerStreamWriter<FullPixelInfosDto> responseStream, ServerCallContext context)
    {
        _logger.LogInformation("Streaming new pixel infos to client {Peer}", context.Peer);

        OnPixelInfosCreated.Subscribe(async (pis) =>
        {
            try
            {
                _logger.LogInformation("Sending new pixel infos to client {Peer}", context.Peer);

                await responseStream.WriteAsync(new FullPixelInfosDto
                {
                    PixelInfos =
                    {
                        pis.Select(pi => new FullPixelInfoDto
                        {
                            Position = new PositionDto { X = pi.History.Position.X, Y = pi.History.Position.Y },
                            CreationDate = pi.CreationDate.ToTimestamp(),
                            Color = new ColorDto { R = pi.Color.R, G = pi.Color.G, B = pi.Color.B }
                        })
                    }
                }, context.CancellationToken);
            }
            catch { }
        });

        await Task.WhenAny(
            context.CancellationToken.WaitAsync(),
            _hostApplicationLifetime.ApplicationStopping.WaitAsync()
        );
    }
}
