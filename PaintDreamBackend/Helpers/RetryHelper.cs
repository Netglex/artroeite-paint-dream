namespace PaintDreamBackend.Helpers;

public static class RetryHelper
{
    public static async Task UntilNoException(Action action, TimeSpan interval)
    {
        var successful = false;
        while (!successful)
        {
            try
            {
                action.Invoke();
                successful = true;
            }
            catch
            {
                await Task.Delay(interval);
            }
        }
    }
}