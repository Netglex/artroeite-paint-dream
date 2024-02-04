namespace PaintDreamBackend.Extensions;

public static class CancellationTokenExtensions
{
    public static Task WaitAsync(this CancellationToken cancellationToken)
    {
        return Task.Run(cancellationToken.WaitHandle.WaitOne);
    }
}