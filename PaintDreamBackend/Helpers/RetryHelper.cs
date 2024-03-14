namespace PaintDreamBackend.Helpers;

public static class RetryHelper
{
    public static async Task UntilNoException(Func<Task> action, TimeSpan interval, CancellationToken stoppingToken)
    {
        var successful = false;
        while (!successful)
        {
            try
            {
                await action.Invoke();
                successful = true;
            }
            catch
            {
                await Task.Delay(interval, stoppingToken);
            }
        }
    }
}